-- Atomic booking operations. Privileges are granted only to authenticated callers.
-- These functions are a development contract: validate in a real Postgres/Supabase test project before live use.
create or replace function private.expire_holds(p_now timestamptz) returns void language plpgsql security definer set search_path='' as $$
begin
 update public.resource_reservations r set active=false from public.appointments a
 where r.appointment_id=a.id and a.status='held' and a.expires_at<=p_now and r.active;
 update public.appointments set status='expired' where status='held' and expires_at<=p_now;
end $$;
create or replace function public.list_availability(service_id uuid, from_at timestamptz, to_at timestamptz)
returns table(start_at timestamptz, provider_id uuid) language plpgsql stable security definer set search_path='' as $$
declare svc public.services%rowtype;
begin
 if (select auth.uid()) is null then raise exception 'authentication required'; end if;
 select * into svc from public.services where id=service_id and active;
 if not found then raise exception 'service unavailable'; end if;
 if from_at<now()+make_interval(mins=>svc.lead_minutes) or to_at>now()+make_interval(days=>svc.horizon_days) or to_at<=from_at or to_at-from_at>interval '14 days' then raise exception 'invalid search window'; end if;
 return query
 select candidate.start_at,p.id from public.providers p
 join public.provider_services ps on ps.provider_id=p.id and ps.service_id=svc.id
 join public.resources r on r.provider_id=p.id
 join public.availability_rules ar on ar.resource_id=r.id
 cross join lateral generate_series(date_trunc('day',from_at at time zone 'Africa/Dar_es_Salaam') at time zone 'Africa/Dar_es_Salaam',to_at,interval '30 minutes') candidate(start_at)
 where p.active and candidate.start_at>=from_at and candidate.start_at+make_interval(mins=>svc.duration_minutes)<=to_at
 and extract(dow from candidate.start_at at time zone 'Africa/Dar_es_Salaam')::int=ar.weekday
 and (candidate.start_at at time zone 'Africa/Dar_es_Salaam')::time>=ar.local_start
 and ((candidate.start_at+make_interval(mins=>svc.duration_minutes)) at time zone 'Africa/Dar_es_Salaam')::time<=ar.local_end
 and not exists(select 1 from public.availability_exceptions e where e.resource_id=r.id and e.during && tstzrange(candidate.start_at,candidate.start_at+make_interval(mins=>svc.duration_minutes),'[)'))
 and not exists(select 1 from public.resource_reservations rr where rr.resource_id=r.id and rr.active and rr.during && tstzrange(candidate.start_at,candidate.start_at+make_interval(mins=>svc.duration_minutes),'[)'))
 order by candidate.start_at,p.id limit 250;
end $$;
create or replace function public.hold_slot(service_id uuid, patient_id uuid, start_at timestamptz, request_key uuid)
returns public.appointments language plpgsql security definer set search_path='' as $$
declare svc public.services%rowtype; chosen uuid; resource_id uuid; prior public.appointments%rowtype; result public.appointments%rowtype; end_at timestamptz; actor uuid:=auth.uid();
begin
 if actor is null then raise exception 'authentication required'; end if;
 if not private.can_access_patient(patient_id) then raise exception 'patient access denied'; end if;
 select * into prior from public.appointments a where a.actor_id=actor and a.request_key=hold_slot.request_key;
 if found then
  if prior.service_id<>service_id or prior.patient_id<>patient_id or prior.start_at<>start_at then raise exception 'idempotency key conflict'; end if;
  return prior;
 end if;
 select * into svc from public.services where id=service_id and active;
 if not found then raise exception 'service unavailable'; end if;
 end_at:=start_at+make_interval(mins=>svc.duration_minutes);
 if start_at<now()+make_interval(mins=>svc.lead_minutes) or start_at>now()+make_interval(days=>svc.horizon_days) then raise exception 'outside booking window'; end if;
 -- Advisory lock serializes competing slot requests before expiry cleanup and constraint insertion.
 perform pg_advisory_xact_lock(hashtextextended(service_id::text||start_at::text,0));
 perform private.expire_holds(now());
 select a.provider_id into chosen from public.list_availability(service_id,start_at,end_at) a where a.start_at=hold_slot.start_at limit 1;
 if chosen is null then raise exception 'slot taken'; end if;
 select r.id into resource_id from public.resources r where r.provider_id=chosen;
 insert into public.appointments(actor_id,patient_id,service_id,provider_id,start_at,end_at,status,expires_at,request_key)
 values(actor,patient_id,service_id,chosen,start_at,end_at,'held',now()+make_interval(mins=>svc.hold_minutes),request_key) returning * into result;
 insert into public.resource_reservations(appointment_id,resource_id,during) values(result.id,resource_id,tstzrange(start_at,end_at,'[)'));
 insert into public.appointment_events(appointment_id,actor_id,new_status) values(result.id,actor,'held');
 return result;
exception when exclusion_violation then raise exception 'slot taken';
end $$;
create or replace function public.confirm_booking(hold_id uuid) returns public.appointments language plpgsql security definer set search_path='' as $$
declare a public.appointments%rowtype; actor uuid:=auth.uid();
begin
 if actor is null then raise exception 'authentication required'; end if;
 select * into a from public.appointments where id=hold_id for update;
 if not found or a.actor_id<>actor or not private.can_access_patient(a.patient_id) then raise exception 'booking unavailable'; end if;
 if a.status='confirmed' then return a; end if;
 if a.status<>'held' or a.expires_at<=now() then
  perform private.expire_holds(now()); raise exception 'hold expired';
 end if;
 update public.appointments set status='confirmed',expires_at=null where id=hold_id returning * into a;
 insert into public.appointment_events(appointment_id,actor_id,old_status,new_status) values(a.id,actor,'held','confirmed');
 insert into public.notification_outbox(user_id,kind,entity_id,dedupe_key,due_at) values(actor,'booking_confirmation',a.id,'booking:'||a.id::text,now()) on conflict(dedupe_key) do nothing;
 return a;
end $$;
create or replace function public.cancel_booking(booking_id uuid) returns public.appointments language plpgsql security definer set search_path='' as $$
declare a public.appointments%rowtype; svc public.services%rowtype; actor uuid:=auth.uid();
begin
 if actor is null then raise exception 'authentication required'; end if;
 select * into a from public.appointments where id=booking_id for update;
 if not found or a.actor_id<>actor or not private.can_access_patient(a.patient_id) then raise exception 'booking unavailable'; end if;
 if a.status='cancelled' then return a; end if;
 if a.status not in ('held','confirmed') then raise exception 'cannot cancel status'; end if;
 select * into svc from public.services where id=a.service_id;
 if a.status='confirmed' and a.start_at<now()+make_interval(mins=>svc.cancellation_cutoff_minutes) then raise exception 'policy cutoff'; end if;
 update public.resource_reservations set active=false where appointment_id=a.id;
 update public.appointments set status='cancelled',expires_at=null where id=a.id returning * into a;
 insert into public.appointment_events(appointment_id,actor_id,old_status,new_status) values(a.id,actor,'confirmed','cancelled');
 update public.notification_outbox set status='cancelled' where entity_id=a.id and status='pending' and kind like 'reminder%';
 return a;
end $$;
create or replace function public.reschedule_booking(booking_id uuid, new_start_at timestamptz, request_key uuid)
returns public.appointments language plpgsql security definer set search_path='' as $$
declare old public.appointments%rowtype; new_booking public.appointments%rowtype; svc public.services%rowtype; provider uuid; resource_id uuid; actor uuid:=auth.uid(); prior public.appointments%rowtype;
begin
 if actor is null then raise exception 'authentication required'; end if;
 select * into prior from public.appointments a where a.actor_id=actor and a.request_key=reschedule_booking.request_key;
 if found then
  if prior.replacement_of<>booking_id or prior.start_at<>new_start_at then raise exception 'idempotency key conflict'; end if;
  return prior;
 end if;
 select * into old from public.appointments where id=booking_id for update;
 if not found or old.actor_id<>actor or not private.can_access_patient(old.patient_id) or old.status<>'confirmed' then raise exception 'booking unavailable'; end if;
 select * into svc from public.services where id=old.service_id;
 if old.start_at<now()+make_interval(mins=>svc.cancellation_cutoff_minutes) then raise exception 'policy cutoff'; end if;
 if new_start_at<now()+make_interval(mins=>svc.lead_minutes) or new_start_at>now()+make_interval(days=>svc.horizon_days) then raise exception 'outside booking window'; end if;
 perform pg_advisory_xact_lock(hashtextextended(old.service_id::text||new_start_at::text,0));
 perform private.expire_holds(now());
 select a.provider_id into provider from public.list_availability(old.service_id,new_start_at,new_start_at+make_interval(mins=>svc.duration_minutes)) a where a.start_at=new_start_at limit 1;
 if provider is null then raise exception 'slot taken'; end if;
 select id into resource_id from public.resources where provider_id=provider;
 insert into public.appointments(actor_id,patient_id,service_id,provider_id,location_id,start_at,end_at,status,request_key,replacement_of)
 values(actor,old.patient_id,old.service_id,provider,old.location_id,new_start_at,new_start_at+make_interval(mins=>svc.duration_minutes),'confirmed',request_key,old.id) returning * into new_booking;
 insert into public.resource_reservations(appointment_id,resource_id,during) values(new_booking.id,resource_id,tstzrange(new_booking.start_at,new_booking.end_at,'[)'));
 update public.resource_reservations set active=false where appointment_id=old.id;
 update public.appointments set status='cancelled' where id=old.id;
 insert into public.appointment_events(appointment_id,actor_id,old_status,new_status) values(old.id,actor,'confirmed','cancelled'),(new_booking.id,actor,null,'confirmed');
 update public.notification_outbox set status='cancelled' where entity_id=old.id and status='pending' and kind like 'reminder%';
 insert into public.notification_outbox(user_id,kind,entity_id,dedupe_key,due_at) values(actor,'booking_rescheduled',new_booking.id,'reschedule:'||new_booking.id::text,now()) on conflict(dedupe_key) do nothing;
 return new_booking;
exception when exclusion_violation then raise exception 'slot taken';
end $$;
create or replace function public.register_session(session_id uuid, membership_id uuid) returns public.session_registrations language plpgsql security definer set search_path='' as $$
declare sess public.group_sessions%rowtype; m public.cohort_memberships%rowtype; r public.session_registrations%rowtype; n int;
begin
 if auth.uid() is null then raise exception 'authentication required'; end if;
 select * into sess from public.group_sessions where id=session_id for update;
 select * into m from public.cohort_memberships where id=membership_id;
 if not found or sess.id is null or sess.cohort_id<>m.cohort_id or m.status<>'active' or not private.can_access_patient(m.patient_id) then raise exception 'not eligible'; end if;
 select * into r from public.session_registrations where session_registrations.session_id=register_session.session_id and session_registrations.membership_id=register_session.membership_id;
 if found and r.status='registered' then return r; end if;
 select count(*) into n from public.session_registrations where session_registrations.session_id=register_session.session_id and status='registered';
 if n>=sess.capacity then raise exception 'session full'; end if;
 insert into public.session_registrations(session_id,membership_id,status) values(session_id,membership_id,'registered')
 on conflict(session_id,membership_id) do update set status='registered' returning * into r;
 return r;
end $$;
create or replace function public.cancel_session_registration(session_id uuid, membership_id uuid) returns public.session_registrations language plpgsql security definer set search_path='' as $$
declare r public.session_registrations%rowtype;
begin
 if not exists(select 1 from public.cohort_memberships m where m.id=membership_id and private.can_access_patient(m.patient_id)) then raise exception 'not authorized'; end if;
 update public.session_registrations s set status='cancelled' where s.session_id=cancel_session_registration.session_id and s.membership_id=cancel_session_registration.membership_id and s.status='registered' returning * into r;
 if r.session_id is null then select * into r from public.session_registrations s where s.session_id=cancel_session_registration.session_id and s.membership_id=cancel_session_registration.membership_id; end if;
 return r;
end $$;
revoke all on function private.expire_holds(timestamptz) from public;
revoke all on function public.list_availability(uuid,timestamptz,timestamptz), public.hold_slot(uuid,uuid,timestamptz,uuid), public.confirm_booking(uuid), public.cancel_booking(uuid), public.reschedule_booking(uuid,timestamptz,uuid), public.register_session(uuid,uuid), public.cancel_session_registration(uuid,uuid) from public;
grant execute on function public.list_availability(uuid,timestamptz,timestamptz), public.hold_slot(uuid,uuid,timestamptz,uuid), public.confirm_booking(uuid), public.cancel_booking(uuid), public.reschedule_booking(uuid,timestamptz,uuid), public.register_session(uuid,uuid), public.cancel_session_registration(uuid,uuid) to authenticated;

-- Group transitions require server review before an invitation can be accepted.
create or replace function public.request_group_interest(cohort_id uuid, patient_id uuid) returns public.cohort_memberships
language plpgsql security definer set search_path='' as $$
declare result public.cohort_memberships%rowtype;
begin
 if auth.uid() is null or not private.can_access_patient(patient_id) then raise exception 'patient access denied'; end if;
 if not exists(select 1 from public.cohorts c where c.id=cohort_id and c.active) then raise exception 'cohort unavailable'; end if;
 insert into public.cohort_memberships(cohort_id,patient_id,status) values(cohort_id,patient_id,'interest')
 on conflict(cohort_id,patient_id) do update set status=case when public.cohort_memberships.status in ('declined','left') then 'interest' else public.cohort_memberships.status end
 returning * into result;
 return result;
end $$;
create or replace function public.accept_group_invitation(membership_id uuid, chosen_name text) returns public.cohort_memberships
language plpgsql security definer set search_path='' as $$
declare result public.cohort_memberships%rowtype;
begin
 select * into result from public.cohort_memberships where id=membership_id for update;
 if not found or not private.can_access_patient(result.patient_id) then raise exception 'membership unavailable'; end if;
 if result.status='active' then return result; end if;
 if result.status<>'invited' then raise exception 'invitation required'; end if;
 if nullif(trim(chosen_name),'') is null or char_length(chosen_name)>80 then raise exception 'invalid display name'; end if;
 if not exists(select 1 from public.consent_events c where c.user_id=auth.uid() and c.purpose='group' and c.granted and c.occurred_at >= coalesce((select max(x.occurred_at) from public.consent_events x where x.user_id=auth.uid() and x.purpose='group' and not x.granted),'-infinity'::timestamptz)) then raise exception 'group consent required'; end if;
 update public.cohort_memberships set status='active',display_name=trim(chosen_name),joined_at=now() where id=membership_id returning * into result;
 return result;
end $$;
create or replace function public.leave_group(membership_id uuid) returns public.cohort_memberships
language plpgsql security definer set search_path='' as $$
declare result public.cohort_memberships%rowtype;
begin
 select * into result from public.cohort_memberships where id=membership_id for update;
 if not found or not private.can_access_patient(result.patient_id) then raise exception 'membership unavailable'; end if;
 if result.status='left' then return result; end if;
 if result.status not in ('active','invited') then raise exception 'cannot leave status'; end if;
 update public.cohort_memberships set status='left' where id=membership_id returning * into result;
 update public.session_registrations set status='cancelled' where session_registrations.membership_id=leave_group.membership_id and status='registered';
 return result;
end $$;
create policy questions_active_insert on public.facilitator_questions for insert to authenticated with check(
 status='pending' and answer is null and private.active_member(cohort_id)
 and exists(select 1 from public.cohort_memberships m join public.patient_access a on a.patient_id=m.patient_id where m.id=sender_membership_id and m.cohort_id=facilitator_questions.cohort_id and m.status='active' and a.user_id=(select auth.uid()))
);
revoke all on function public.request_group_interest(uuid,uuid),public.accept_group_invitation(uuid,text),public.leave_group(uuid) from public;
grant execute on function public.request_group_interest(uuid,uuid),public.accept_group_invitation(uuid,text),public.leave_group(uuid) to authenticated;
