-- Wajamama data contract. Apply only to an isolated development Supabase project until reviewed.
create schema if not exists extensions;
create extension if not exists btree_gist with schema extensions;
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table public.profiles (
 user_id uuid primary key references auth.users(id) on delete cascade,
 preferred_name text check (char_length(preferred_name)<=80), language text not null default 'sw' check(language in ('sw','en')),
 created_at timestamptz not null default now()
);
create table public.patients (
 id uuid primary key default gen_random_uuid(), display_name text not null check(char_length(display_name) between 1 and 80),
 created_at timestamptz not null default now()
);
create table public.patient_access (
 patient_id uuid not null references public.patients(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 relationship text not null check(relationship in ('self','guardian')),
 verified_at timestamptz not null,
 primary key(patient_id,user_id)
);
create index patient_access_user_idx on public.patient_access(user_id,patient_id);
create table public.consent_events (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id),
 purpose text not null check(purpose in ('terms','ai','previews','group')), granted boolean not null,
 version text not null, occurred_at timestamptz not null default now()
);
create index consent_events_user_idx on public.consent_events(user_id,purpose,occurred_at desc);
create table public.care_profiles (
 patient_id uuid primary key references public.patients(id) on delete cascade,
 pathway text not null check(pathway in ('pregnancy','postpartum','child','general')),
 estimated_due_date date, updated_at timestamptz not null default now()
);
create table public.services (
 id uuid primary key default gen_random_uuid(), name_sw text not null, name_en text not null,
 description_sw text not null default '', description_en text not null default '',
 duration_minutes int not null check(duration_minutes between 10 and 240),
 price_minor int check(price_minor>=0), currency text check(currency ~ '^[A-Z]{3}$'),
 requires_approval boolean not null default false, active boolean not null default false,
 lead_minutes int not null default 120 check(lead_minutes>=0), horizon_days int not null default 60 check(horizon_days between 1 and 365),
 cancellation_cutoff_minutes int not null default 60 check(cancellation_cutoff_minutes>=0), hold_minutes int not null default 10 check(hold_minutes between 1 and 30)
);
create table public.providers (
 id uuid primary key default gen_random_uuid(), display_name text not null, active boolean not null default false
);
create table public.locations (
 id uuid primary key default gen_random_uuid(), name text not null, address text, active boolean not null default false
);
create table public.resources (
 id uuid primary key default gen_random_uuid(), label text not null, kind text not null check(kind in ('provider','room','equipment')),
 provider_id uuid unique references public.providers(id)
);
create table public.provider_services (
 provider_id uuid not null references public.providers(id), service_id uuid not null references public.services(id),
 primary key(provider_id,service_id)
);
create table public.availability_rules (
 id uuid primary key default gen_random_uuid(), resource_id uuid not null references public.resources(id),
 weekday int not null check(weekday between 0 and 6), local_start time not null, local_end time not null,
 timezone text not null default 'Africa/Dar_es_Salaam', check(local_start<local_end)
);
create table public.availability_exceptions (
 id uuid primary key default gen_random_uuid(), resource_id uuid not null references public.resources(id),
 during tstzrange not null, reason text, exclude using gist(resource_id with =,during with &&)
);
create table public.appointments (
 id uuid primary key default gen_random_uuid(), actor_id uuid not null references auth.users(id), patient_id uuid not null references public.patients(id),
 service_id uuid not null references public.services(id), provider_id uuid references public.providers(id),
 location_id uuid references public.locations(id), start_at timestamptz not null, end_at timestamptz not null,
 status text not null check(status in ('held','requested','confirmed','checked_in','in_progress','completed','expired','cancelled','no_show')),
 expires_at timestamptz, request_key uuid not null, replacement_of uuid references public.appointments(id),
 created_at timestamptz not null default now(), check(end_at>start_at), unique(actor_id,request_key)
);
create index appointments_patient_idx on public.appointments(patient_id,start_at desc);
create index appointments_actor_idx on public.appointments(actor_id,status,start_at);
create table public.resource_reservations (
 id uuid primary key default gen_random_uuid(), appointment_id uuid not null references public.appointments(id) on delete cascade,
 resource_id uuid not null references public.resources(id), during tstzrange not null, active boolean not null default true,
 unique(appointment_id,resource_id), exclude using gist(resource_id with =,during with &&) where(active)
);
create index reservations_appointment_idx on public.resource_reservations(appointment_id);
create table public.appointment_events (
 id bigserial primary key, appointment_id uuid not null references public.appointments(id), actor_id uuid,
 old_status text, new_status text not null, at timestamptz not null default now(), metadata jsonb not null default '{}'::jsonb
);
create index appointment_events_appointment_idx on public.appointment_events(appointment_id,at);
create table public.cohorts (
 id uuid primary key default gen_random_uuid(), name text not null, facilitator_id uuid references auth.users(id),
 active boolean not null default false, max_members int check(max_members between 2 and 100)
);
create table public.cohort_memberships (
 id uuid primary key default gen_random_uuid(), cohort_id uuid not null references public.cohorts(id), patient_id uuid not null references public.patients(id),
 status text not null check(status in ('interest','review','invited','active','declined','left')),
 display_name text check(char_length(display_name)<=80), joined_at timestamptz, unique(cohort_id,patient_id)
);
create index cohort_memberships_patient_idx on public.cohort_memberships(patient_id,status);
create table public.group_sessions (
 id uuid primary key default gen_random_uuid(), cohort_id uuid not null references public.cohorts(id),
 start_at timestamptz not null, end_at timestamptz not null, location_id uuid references public.locations(id),
 facilitator_id uuid references auth.users(id), capacity int not null check(capacity between 1 and 100),
 agenda text, approved_recap text, check(end_at>start_at)
);
create index group_sessions_cohort_idx on public.group_sessions(cohort_id,start_at);
create table public.session_registrations (
 session_id uuid not null references public.group_sessions(id), membership_id uuid not null references public.cohort_memberships(id),
 status text not null check(status in ('registered','cancelled','attended','absent')), created_at timestamptz not null default now(),
 primary key(session_id,membership_id)
);
create table public.posts (
 id uuid primary key default gen_random_uuid(), cohort_id uuid not null references public.cohorts(id), author_membership_id uuid not null references public.cohort_memberships(id),
 body text not null check(char_length(body) between 1 and 2000), parent_id uuid references public.posts(id),
 pinned boolean not null default false, hidden boolean not null default false, created_at timestamptz not null default now()
);
create index posts_cohort_idx on public.posts(cohort_id,created_at desc);
create table public.post_reports (
 id uuid primary key default gen_random_uuid(), post_id uuid not null references public.posts(id), reporter_membership_id uuid not null references public.cohort_memberships(id),
 reason text not null, created_at timestamptz not null default now(), unique(post_id,reporter_membership_id)
);
create table public.facilitator_questions (
 id uuid primary key default gen_random_uuid(), cohort_id uuid not null references public.cohorts(id), sender_membership_id uuid not null references public.cohort_memberships(id),
 body text not null check(char_length(body) between 1 and 2000), peer_visibility text not null check(peer_visibility in ('private','identity_hidden')),
 status text not null default 'pending' check(status in ('pending','answered','closed')), answer text, created_at timestamptz not null default now()
);
create table public.learning_content (
 id uuid primary key default gen_random_uuid(), title_sw text not null, title_en text not null,
 body_sw text not null, body_en text not null, version text not null, reviewed_by uuid references auth.users(id),
 reviewed_at timestamptz, published boolean not null default false
);
create table public.saved_content (
 user_id uuid not null references auth.users(id), content_id uuid not null references public.learning_content(id),
 created_at timestamptz not null default now(), primary key(user_id,content_id)
);
create table public.assistant_conversations (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id), created_at timestamptz not null default now()
);
create table public.assistant_messages (
 id uuid primary key default gen_random_uuid(), conversation_id uuid not null references public.assistant_conversations(id) on delete cascade,
 role text not null check(role in ('user','assistant','tool')), body text not null, created_at timestamptz not null default now()
);
create table public.handoff_requests (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id), reason text not null,
 channel text not null, summary text, share_summary boolean not null default false,
 status text not null default 'requested' check(status in ('requested','assigned','responded','closed')), created_at timestamptz not null default now()
);
create table public.notification_preferences (
 user_id uuid primary key references auth.users(id), enabled boolean not null default false,
 detailed_preview boolean not null default false, shared_device boolean not null default true
);
create table public.device_tokens (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id), token text not null unique,
 platform text not null check(platform in ('ios','android')), created_at timestamptz not null default now()
);
create table public.notification_outbox (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id), kind text not null,
 entity_id uuid, dedupe_key text not null unique, payload jsonb not null default '{}'::jsonb,
 due_at timestamptz not null, attempts int not null default 0, status text not null default 'pending' check(status in ('pending','sent','failed','cancelled'))
);
create table private.audit_events (
 id bigserial primary key, actor_id uuid, action text not null, entity_type text not null, entity_id uuid,
 at timestamptz not null default now(), metadata jsonb not null default '{}'::jsonb
);

-- No client can set a role in a profile. Staff authorization is server-managed.
create table private.staff_assignments (
 user_id uuid not null references auth.users(id), cohort_id uuid references public.cohorts(id), patient_id uuid references public.patients(id),
 duty text not null check(duty in ('facilitator','care','scheduler','content','moderator')),
 check(cohort_id is not null or patient_id is not null)
);
create index staff_assignments_user_idx on private.staff_assignments(user_id);
create or replace function private.can_access_patient(p_patient uuid) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.patient_access a where a.patient_id=p_patient and a.user_id=(select auth.uid()) and a.verified_at is not null)
 or exists(select 1 from private.staff_assignments s where s.patient_id=p_patient and s.user_id=(select auth.uid()) and s.duty in ('care','scheduler'))
$$;
create or replace function private.active_member(p_cohort uuid) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.cohort_memberships m join public.patient_access a on a.patient_id=m.patient_id
 where m.cohort_id=p_cohort and m.status='active' and a.user_id=(select auth.uid()))
$$;
revoke all on function private.can_access_patient(uuid),private.active_member(uuid) from public;
grant usage on schema private to authenticated;
grant execute on function private.can_access_patient(uuid),private.active_member(uuid) to authenticated;

-- Every exposed table has RLS. Write access is deliberately narrow; privileged transitions use RPCs.
do $$ declare item text; begin
 for item in select unnest(array['profiles','patients','patient_access','consent_events','care_profiles','services','providers','locations','resources','provider_services','availability_rules','availability_exceptions','appointments','resource_reservations','appointment_events','cohorts','cohort_memberships','group_sessions','session_registrations','posts','post_reports','facilitator_questions','learning_content','saved_content','assistant_conversations','assistant_messages','handoff_requests','notification_preferences','device_tokens','notification_outbox']) loop
 execute format('alter table public.%I enable row level security',item);
 end loop;
end $$;
alter table private.audit_events enable row level security;
alter table private.staff_assignments enable row level security;
create policy profiles_self_read on public.profiles for select to authenticated using(user_id=(select auth.uid()));
create policy profiles_self_insert on public.profiles for insert to authenticated with check(user_id=(select auth.uid()));
create policy profiles_self_update on public.profiles for update to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
create policy patients_authorized on public.patients for select to authenticated using(private.can_access_patient(id));
create policy access_self on public.patient_access for select to authenticated using(user_id=(select auth.uid()));
create policy consent_self_read on public.consent_events for select to authenticated using(user_id=(select auth.uid()));
create policy consent_self_insert on public.consent_events for insert to authenticated with check(user_id=(select auth.uid()));
create policy care_profiles_authorized on public.care_profiles for select to authenticated using(private.can_access_patient(patient_id));
create policy services_public on public.services for select to anon,authenticated using(active);
create policy providers_public on public.providers for select to anon,authenticated using(active);
create policy locations_public on public.locations for select to anon,authenticated using(active);
create policy learning_public on public.learning_content for select to anon,authenticated using(published and reviewed_at is not null);
create policy appointments_authorized on public.appointments for select to authenticated using(private.can_access_patient(patient_id));
create policy events_authorized on public.appointment_events for select to authenticated using(exists(select 1 from public.appointments a where a.id=appointment_id and private.can_access_patient(a.patient_id)));
create policy cohorts_member on public.cohorts for select to authenticated using(private.active_member(id));
create policy membership_own on public.cohort_memberships for select to authenticated using(private.can_access_patient(patient_id));
create policy session_member on public.group_sessions for select to authenticated using(private.active_member(cohort_id));
create policy registration_member on public.session_registrations for select to authenticated using(exists(select 1 from public.cohort_memberships m where m.id=membership_id and private.can_access_patient(m.patient_id)));
create policy posts_member on public.posts for select to authenticated using(not hidden and private.active_member(cohort_id));
create policy posts_member_insert on public.posts for insert to authenticated with check(not pinned and not hidden and private.active_member(cohort_id) and exists(select 1 from public.cohort_memberships m join public.patient_access a on a.patient_id=m.patient_id where m.id=author_membership_id and m.cohort_id=posts.cohort_id and m.status='active' and a.user_id=(select auth.uid())));
create policy reports_own_read on public.post_reports for select to authenticated using(exists(select 1 from public.cohort_memberships m join public.patient_access a on a.patient_id=m.patient_id where m.id=reporter_membership_id and a.user_id=(select auth.uid())));
create policy reports_own_insert on public.post_reports for insert to authenticated with check(exists(select 1 from public.cohort_memberships m join public.patient_access a on a.patient_id=m.patient_id join public.posts p on p.id=post_id where m.id=reporter_membership_id and m.cohort_id=p.cohort_id and m.status='active' and a.user_id=(select auth.uid())));
create policy questions_own on public.facilitator_questions for select to authenticated using(exists(select 1 from public.cohort_memberships m join public.patient_access a on a.patient_id=m.patient_id where m.id=sender_membership_id and a.user_id=(select auth.uid())));
create policy saved_own on public.saved_content for all to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
create policy conversations_own on public.assistant_conversations for select to authenticated using(user_id=(select auth.uid()));
create policy messages_own on public.assistant_messages for select to authenticated using(exists(select 1 from public.assistant_conversations c where c.id=conversation_id and c.user_id=(select auth.uid())));
create policy handoff_own on public.handoff_requests for select to authenticated using(user_id=(select auth.uid()));
create policy preferences_own on public.notification_preferences for all to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
create policy tokens_own on public.device_tokens for all to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
-- No public/anonymous access to hidden questions, raw assistant text, outbox, staff assignments or audit events.
