# Wajamama mobile application — Codex implementation prompt

## Your assignment

Work inside my existing bare-bone Expo React Native repository. Implement the Wajamama mobile MVP described below, including its professional project structure, polished screens, connected navigation, Supabase foundation, and realistic development fixtures. This document carries the relevant decisions from my earlier product conversation. You do not need access to that chat. Treat this as an implementation task, not a request for another proposal.

Read repository instructions first. Inspect package.json, lockfile, app configuration, existing navigation, native directories, environment setup, and git status before modifying anything. I report using Expo SDK 57; verify the actual installed versions and compatible APIs rather than assuming compatibility from this statement. Preserve the existing SDK and package manager unless a concrete incompatibility requires discussion. Do not regenerate the project or overwrite unrelated changes. Use the installed Expo tooling to validate compatible dependencies. Consult current official documentation for APIs you use. If the repository differs from this proposed structure, migrate incrementally and explain material deviations.

Inspect all four images under this document's sibling `references/` directory before implementing UI. They are visual references, not app assets to put behind a screen. Implement actual native controls. Do not reproduce illegible text, third-party branding, phone frames, photography of devices, or irrelevant health features.

Proceed autonomously on reversible implementation work. Do not publish, deploy, send real notifications, change production data, or connect real patient data as part of this task. Where credentials or operational details are missing, provide an explicit development/demo mode and documented integration boundaries; do not invent successful backend actions.

## Product context and settled decisions

- Wajamama serves women, children, and families in Zanzibar. Its website is https://www.wajamama.com/ and its appointment page is https://www.wajamama.com/book-an-appointment. Website content can inform service naming, but verify current details before treating hours, prices, staff, locations, or contacts as production data.
- The app should support continuity of maternal and child care, education, owned appointments, and facilitated group care. It is not a generic fitness or fertility app.
- Group care, called Uzazi Bora Pamoja in the prior discussion, is central: members join a suitable pregnancy/postpartum cohort, meet a facilitator, attend sessions, ask questions, learn, and receive private follow-up. Cohort size, eligibility, session cadence, and clinical protocols are configurable and require Wajamama approval.
- Use React Native with Expo, TypeScript, and Supabase. Build our own appointment engine. Do not use Acuity, its API, or a scheduling WebView.
- Kiswahili is the default language, English optional. Every visible string, validation error, notification template, date label, and accessibility label must support localization.
- Target Android and iOS, prioritizing reliable use on modest Android phones and intermittent connections. Smartphone ownership does not imply private device access, strong connectivity, or high literacy.
- Cultural sensitivity means offering choices: respectful imagery, optional photographs, preferred name, optional caregiver involvement, privacy, and optional provider preferences where supported. Do not infer religion, marital status, literacy, dress preference, or family permissions from location.
- A conversational AI companion helps with approved education, navigation, session preparation, and appointment discovery. Text and voice are both supported interfaces. AI identity and limitations must be clear. Human handoff remains available.
- Earlier concepts used a mainly green/cream look. The attached references now take visual precedence: use a coherent pastel, rounded, editorial interface with green as the primary action color.

## Visual reference interpretation

| File | Borrow | Apply to |
| --- | --- | --- |
| references/01-service-grid.jpg | Rounded two-column colored tiles, category chips, split promotional card, floating bottom navigation | Home shortcuts and services |
| references/02-wellbeing-appointments.jpg | Human greeting, optional mood cards, prominent green appointment panel, pastel learning grid, expanded sheet | Home, appointments, optional check-in, learning categories |
| references/03-journey-voice.jpg | Single prominent circular focal point, airy progress layout, central assistant affordance | Care journey milestones and voice screen; never fertility predictions or a health score |
| references/04-learning-cards.jpg | Large editorial titles, vertically stacked pastel cards, author/avatar detail, pill filters | Learning library and session resources |

Create one visual system, not four competing themes. Proposed tokens (adjust only to improve measured contrast): background #F8F7FC, surface #FFFFFF, ink #20232B, muted ink #5E626D, primary green #286249, pale mint #D8EBD9, lavender #DDD3F7, periwinkle #DDE4FA, peach #FFD5AF, rose #F7D6DF, butter #FFF2AE, border #E4E3EB, danger #B42318. Pastel cards use dark text; primary buttons use white text only after checking contrast.

Use a consistent spacing scale 4/8/12/16/24/32, approximately 20px horizontal screen padding, 24–28px card radii, pill chips, 52–56px primary controls, and at least 48px touch targets. Body text starts around 16px with generous line height; titles about 28–32px. Respect system font scaling and allow taller cards. Use a readable system font initially; bundle any custom font and preserve fast startup. One consistent icon family with text labels. Gentle shadows and restrained decoration. Avoid heavy gradients, tiny gray labels, dense dashboards, or emoji as the only interaction label.

Use soft local illustrations where available and licensed; otherwise use simple native/vector motifs. Do not invent staff portraits or imply stock portraits depict Wajamama employees. Use initials for fixtures. Cultural imagery should be reviewed locally before release.

On regular widths, show two-column cards; at narrow widths or large accessibility text, allow one column. Floating navigation must respect device safe areas and never hide scroll content, keyboard fields, or the final CTA. Avoid elaborate card cutouts until navigation, contrast, and performance are correct.

## Information architecture

Five labeled bottom tabs: **Mwanzo**, **Miadi**, **Msaidizi**, **Pamoja**, **Jifunze**. The middle assistant tab has a modest raised circular icon and opens the assistant landing screen, never immediately activates a microphone. Profile/settings and notifications are reachable from the home header. Care journey and child profiles are reached from home. Keep navigation consistent across primary screens; onboarding and focused voice/booking flows can use full-screen stacks.

Use Expo Router if already present, or adopt it if there is no navigation system. Do not add a competing navigation framework just to match this prompt. Keep routes thin; feature screens own composition and hooks own orchestration. Protected navigation is only a UX layer; server authorization remains mandatory.

## Screen specifications and complete flows

All screens require appropriate loading, empty, error, offline, unauthorized, and retry states. Every button must work, navigate, or accurately explain why the feature is unavailable. Demonstration data must be clearly labeled and isolated from production accounts. The following copy is a draft for native Kiswahili and clinical review.

### A. Entry and onboarding

1. **Welcome / Karibu Wajamama**: calm illustration, short value proposition, default Kiswahili selector, `Anza`, `Tayari nina akaunti`, and public help/learning access. No microphone or notification permission at launch.
2. **Phone sign-in / Namba ya simu**: editable country code with Tanzania +255 default, phone validation, explanation of OTP, submit/loading/errors, and clear privacy link. Do not hardcode a production OTP. Supabase phone auth needs an actual SMS provider; demo authentication must be visibly separate.
3. **OTP verification / Thibitisha namba**: paste/autofill support, accessible digit entry, resend cooldown, wrong/expired code, change phone, connectivity recovery. Returning users resume their existing account. Sensitive device/account changes require reauthentication.
4. **Privacy choices / Faragha yako**: short layered explanations for account use, optional AI processing, notification previews, and group participation. Separate required service terms from optional choices; no preselected optional consent. Store consent version and timestamp. Microphone consent is just-in-time at voice entry.
5. **Care profile / Tuambie kuhusu wewe**: preferred name, optional language/accessibility choices, pregnancy/postpartum/child/general-care path; allow skip on nonessential fields. Ask estimated due date only on relevant path, permit `Sijui`, and show any derived week as an estimate. Never require spouse approval.
6. **Care preferences / Unapendelea huduma gani?**: optional available location, visit mode, contact channel, and group interest. Explain shared-phone notification privacy. Persist a minimal draft safely and let users resume.
7. **Group introduction / Uzazi Bora Pamoja**: explain benefits, facilitator role, what peers can see, attendance, and rules. `Ningependa kujiunga` sends a reviewable interest request; `Baadaye` continues independently. Do not silently enroll or post a profile.
8. **Onboarding summary / Uko tayari**: editable summary, optional notification prompt with benefit explained, enter home. Route returning users to the right unfinished step without repeating consent unnecessarily.

### B. Home and care journey

9. **Home / Mwanzo**: greeting and avatar/settings, notification icon, optional `Unajisikiaje leo?` check-in, prominent next appointment or group session card, four service shortcuts, recommended learning, compact journey card. Prioritize next useful action; no claim that mother/baby are healthy based on app usage. Empty home must be welcoming with `Weka miadi` and `Jifunze`.
10. **My journey / Safari yangu**: pregnancy/postpartum/child appropriate stage, dated milestones, next visit, saved learning, care-team reviewed tasks. A progress ring may show completed preparation tasks with a clear denominator, not pregnancy safety or health. Never use red missed-day streaks or guilt-based engagement.
11. **Private check-in / Unajisikiaje?**: labeled mood choices and optional note; explain who can access it and whether it is monitored. Save confirmation, edit/delete where policy allows. No automatic diagnosis or promise of immediate clinical review. Do not share with the cohort.
12. **Child profile / Wasifu wa mtoto**: dependent selector, minimum identity information, appointment links, age-appropriate reviewed resources. Guardian access is explicitly modeled. Vaccination schedules or clinical records require a validated data source; do not generate personalized medical schedules from fixtures.

### C. Owned appointments

13. **Appointments / Miadi yangu**: upcoming/past tabs, date badge, service, provider where assigned, location/mode, authoritative status, `Weka miadi`. Separate group registrations from individual visits even if both appear in one timeline.
14. **Service catalog / Chagua huduma**: chips and two-column cards; maternal, child, women's/general care and other services only where configured. Use verified descriptions; demo examples are labeled. Search/filter and no-results state.
15. **Service details / Maelezo ya huduma**: purpose, configured duration, price/currency or `Bei itathibitishwa`, preparation, supported visit modes, `Endelea`. Unknown prices are never presented as free.
16. **Visit preferences / Chagua aina ya miadi**: who the visit is for, available location/mode/provider or any available provider. Offer home/virtual only for services actually configured. Collect home address only if required and keep it private.
17. **Date and time / Chagua tarehe na saa**: accessible calendar plus readable date list, available times, no availability, refreshed/stale slot handling. Use Africa/Dar_es_Salaam display timezone, store UTC. Display unambiguous 24-hour time e.g. `10:00`; optional reviewed Swahili-time explanation may accompany it. Derive weekday labels from the date.
18. **Booking review / Hakiki miadi**: service, patient, time, location, price status, cancellation policy, optional brief reason, hold expiry indicator and `Thibitisha miadi`. Server holds are provisional. Prevent duplicate taps, validate again, recover from timeout by checking booking identity before retrying.
19. **Confirmation / Miadi imethibitishwa**: show only after server confirmation, booking reference, visit instructions, appointment details link, optional device calendar add. In demo mode label simulated confirmation. If manual approval is required show a pending request instead.
20. **Appointment details / Maelezo ya miadi**: status, preparation, verified contact/directions, `Badilisha miadi`, `Ghairi miadi`. Reschedule reviews the replacement and atomically exchanges it; old booking survives if replacement fails. Cancellation shows policy and explicit confirmation, then server result. Include slot taken, hold expired, policy cutoff, and offline states.

MVP appointment state machine: held → confirmed → checked_in → in_progress → completed; held → expired; held/confirmed → cancelled; confirmed → no_show through authorized staff actions. Add requested/pending approval only where a configured service requires it. Payments and video-call infrastructure are deferred unless already configured. No pretend payment success.

### D. Pamoja group care

21. **Pamoja landing / Pamoja**: before enrollment show introduction and request state; after approval show group name, facilitator, next session, pinned resources and moderated discussion preview. Membership should not reveal other members' clinical profiles.
22. **Group invitation and consent / Jiunge na kikundi**: cohort details, schedule, named visibility scope, rules, accept/decline. Explain: peers may see chosen name and posts; authorized staff may see the sender of questions hidden from peers. Never promise absolute anonymity or preventable screenshots.
23. **Session details / Kikao chetu**: date/time/location, facilitator, agenda, preparation, capacity, RSVP/cancel, attendance state controlled by authorized staff, session follow-up resources. Show waitlist only if supported. Online meeting links, if present, require authorization.
24. **Discussion / Mazungumzo ya kikundi**: pinned facilitator message, paginated posts/replies, compose, delivery state, report, mute preferences. Clearly mark facilitator identity. No public member phone numbers. No peer direct messages in MVP. Posts do not auto-copy private AI conversations.
25. **Ask facilitator / Muulize mwezeshaji**: choose private question or question with identity hidden from peers; preview scope before sending. Sender remains available to authorized moderators. Pending, answered, and unavailable states. Urgent problems must not wait on this queue.
26. **Session follow-up / Baada ya kikao**: reviewed recap, suggested learning, optional feedback, next session, private help request. Only approved educational discussion is summarized; do not automatically transcribe sessions or extract personal disclosures.

Group lifecycle: interest → staff review → invitation → explicit acceptance → active membership → sessions/discussion/follow-up → transition to next cohort or leave. Staff can decline or suggest a different cohort; the UI explains the outcome without exposing clinical reasoning to peers. Leaving revokes future access according to policy while retained records follow documented retention rules.

### E. AI assistant, voice, and human help

27. **Assistant landing / Msaidizi**: unmistakable `Msaidizi wa AI`, `Andika ujumbe`, `Zungumza`, `Wasiliana na mhudumu`, suggestions such as next appointment, session preparation, and learning. Explain that AI is not a clinician and is not emergency support. AI use remains optional.
28. **Text conversation / Mazungumzo**: readable bubbles, text composer, source links for approved educational answers, server tool-result cards, generation/stop/retry states, delete/history settings. Booking suggestions open a review screen; the assistant never silently books, cancels, enrolls, or publishes a post. An unconfigured live AI service offers honest demo examples or unavailable state.
29. **Voice companion / Msaidizi wa sauti**: full-screen uncluttered surface, back control, AI label, soft mint/lavender orb, short status, prominent transcript, one primary control, stop/cancel, keyboard alternative, human handoff. Prefer push-to-talk for MVP. The center orb is illustrative, never the only status indicator.

Voice states and controls:

| State | Kiswahili label | Behavior |
| --- | --- | --- |
| Idle | Tayari kukusikiliza | `Anza kuzungumza`; request permission only now |
| Listening | Nakusikiliza | Visible active-mic indicator, `Nimemaliza`, cancel |
| Transcribing | Nageuza sauti kuwa maandishi | Progress, timeout/cancel |
| Review | Hakiki ujumbe wako | Editable transcript, rerecord, `Tuma ujumbe` |
| Thinking | Naandaa jibu | Stop, no implied ongoing recording |
| Response ready | Jibu lako liko tayari | Read text; explicit `Sikiliza jibu` |
| Speaking | Nasoma jibu | Stop/pause and transcript; no microphone activation |
| Complete | Una swali lingine? | New question or close |
| Failed/denied/offline | Imeshindikana kuendelea | Specific explanation, retry/text alternative |

Stop recording and playback on backgrounding, navigation away, interruption, or revoked permission. Clear temporary audio on cancel and after intended processing. Do not auto-play sensitive answers on a shared device. For MVP, transcript review comes before transmission to the conversational model; explain that server speech-to-text itself requires sending audio if that architecture is used. Never claim audio stays on-device unless that is actually true. Model STT, conversation, and TTS as separate replaceable adapters. No secret keys in mobile code. A mock voice mode must explicitly say it does not record or transmit audio.

30. **Human handoff / Wasiliana na mhudumu**: reason/channel, configured hours, preview/edit of optional conversation summary, consent to share, submit. Track requested/assigned/responded/closed from real server state. Display turnaround only if operationally configured. No fictitious `Mhudumu yuko njiani` or guaranteed callback.
31. **Urgent help / Msaada wa haraka**: accessible from assistant and care flows, brief clinician-approved urgent-care instructions and verified contact options. Do not invent an emergency number or portray Wajamama as a 24/7 emergency service. Guidance must not tell someone to wait for AI or a callback. Clinical triage logic remains disabled until validated by the care team.

### F. Learning, notifications, and settings

32. **Learning / Jifunze**: bold title, pill categories such as Ujauzito, Baada ya kujifungua, Afya ya mtoto, Lishe; large stacked pastel cards with title, content type, duration, reviewed-author details if real, and saved state. Follow reference 04 with readable spacing rather than overlapping text. Search and saved-content filter.
33. **Learning detail / Soma au sikiliza**: summary, short sections, optional audio with transcript and explicit play, reviewer/date/version when verified, save, share only publicly shareable content, related session. Downloads only for approved public content and show downloaded/stale state.
34. **Notifications / Taarifa**: upcoming visit/session reminders and responses with permission-aware deep links. Generic lock-screen copy by default. Read state, empty state, settings. A revoked membership or expired link cannot bypass access checks.
35. **Profile / Wasifu wangu**: preferred name, language, contact, dependents, care preferences, privacy controls, help, sign out. Reauthenticate sensitive account changes.
36. **Privacy and accessibility / Faragha na mipangilio**: AI consent/history choices, notification previews, shared-device mode, audio preferences, font/system accessibility guidance, data export/deletion request and accurate processing state. Explain any records retained for approved clinical/legal purposes without inventing retention periods. Consent withdrawal disables future optional processing; no false promise that remote data has been deleted immediately.

## Professional code organization

Keep one application repository. Do not introduce a monorepo without a concrete need. Suggested layout (adapt routes to the installed router):

```text
src/
  app/                     # Route files and layouts only
    _layout.tsx
    (auth)/
    (onboarding)/
    (tabs)/                # home, appointments, assistant, pamoja, learn
    booking/               # service, preferences, time, review, result
    appointments/[id].tsx
    groups/[id]/
    sessions/[id].tsx
    assistant/voice.tsx
    assistant/chat.tsx
    learning/[id].tsx
    profile/
    notifications.tsx
    urgent-help.tsx
  features/
    auth/
    onboarding/
    home/
    care-journey/
    dependents/
    appointments/
    groups/
    assistant/
    learning/
    notifications/
    profile/
  components/
    ui/                    # Button, Text, Input, Card, Chip, Sheet, Screen
    patterns/              # AppointmentCard, StateView, Avatar, AudioControl
  theme/                   # Semantic tokens, typography, spacing, theme access
  i18n/                    # sw/en messages, formatting, translation helpers
  lib/                     # Supabase client, query client, safe logging, env
  providers/               # Session, query, localization, theme
  services/                # Cross-feature notification/audio adapters
  mocks/                   # Synthetic fixtures and demo repository adapters
  types/                   # Generated DB types and truly shared domain types
assets/
supabase/
  migrations/
  functions/               # Privileged operations, AI gateway, notification work
  tests/
  seed.sql                 # Synthetic development-only data
tests/                     # Cross-feature integration/E2E flows
docs/
  architecture.md
  screen-inventory.md
  data-access.md
  operational-readiness.md
```

Within each feature, use screens/, components/, hooks/, api/, schemas/ and types only where needed. Avoid empty boilerplate folders, huge screen files, generic utils dumping grounds, cyclic feature imports, or speculative dependency injection frameworks. Define typed repositories/adapters where switching demo/live data or audio providers actually requires it.

Recommended choices, subject to existing dependencies: strict TypeScript; TanStack Query for server state; React Hook Form plus Zod for forms; i18next/react-i18next for localization; React Native StyleSheet with semantic tokens for styling. Keep an existing coherent styling system if present. Use local React state for component UI and context for session/theme/language. Add a separate global-state library only for demonstrated needs. Do not duplicate query-cache data into a global store.

Use compatible Expo packages for native capabilities and check the current SDK docs. Do not hardcode outdated audio APIs. Verify development-build requirements for chosen audio/notifications libraries; do not promise every feature works in Expo Go. Handle secure session persistence deliberately with supported adapters and token-size limits; never put health records into a plaintext convenience cache. Clear account-scoped cache, subscriptions, temporary files, and drafts on sign-out or account switch. Configure query retry intentionally; do not blindly retry non-idempotent mutations. Validate external responses and runtime environment variables.

## Supabase architecture and appointment guarantees

Create local migrations, generated types, minimal seed fixtures, and typed access functions. Do not apply migrations to production. Public/publishable project keys may be in Expo public config; service-role/provider secrets must stay server-side. Add .env.example with placeholders and document required settings. Production mode must fail clearly if configuration is missing; it must never silently fall back to fictional success.

Suggested domain tables: profiles, patients, patient_access, consent_events, care_profiles, services, providers, locations, resources, provider_services, availability_rules, availability_exceptions, appointments, resource_reservations, appointment_events, cohorts, cohort_memberships, group_sessions, session_registrations, posts, post_reports, facilitator_questions, learning_content, saved_content, assistant_conversations/messages (only where consented), handoff_requests, notification_preferences, notification_outbox, device_tokens, audit_events. Avoid collecting clinical data not needed for the MVP.

Auth users and patients are distinct: a guardian can have authorized access to a dependent; a dependent need not have a login. Derive roles and care-team assignments server-side, never from user-editable profile metadata. Private clinical/profile data is separate from group-visible content. Scope staff access to assigned duties and patients. Members cannot change their own roles, approve membership, read other patients, enumerate private questions, or set booking status. Private Storage buckets and authorized signed access for attachments; do not persist public health-document URLs. Add indexes for policies and common queries.

Enable and test RLS on every exposed table. Include allow and deny tests for anonymous visitors, two unrelated patients, an authorized guardian, group peers, facilitators, and staff. Carefully authorize SECURITY DEFINER RPCs, pin search_path, limit EXECUTE privileges, validate ownership and parameters, and prevent direct client writes that bypass invariants.

Availability = configured service/provider/resource working rules minus leave, exceptions, occupied/held intervals and buffers, constrained by booking lead time and horizon. The server is authoritative. Reserve providers, rooms, and equipment where required. Use PostgreSQL time ranges and resource overlap exclusion constraints (e.g. btree_gist where appropriate) plus transactions; an availability check followed by an unprotected insert is insufficient.

Expose typed operations such as list_availability, hold_slot, confirm_booking, reschedule_booking, cancel_booking, register_session, and cancel_session_registration. Exact names can follow project conventions. Hold TTL is configurable (example: ten minutes). Expiry must be handled transactionally when allocating or confirming as well as by background cleanup; a timestamp alone does not release an exclusion constraint. Lock/transition stale holds correctly. Confirm must reject expired holds. Include idempotency keys scoped to the actor and operation, with request consistency checks, and immutable event history.

Rescheduling obtains the new resources and releases old ones in one transaction so failure preserves the original booking. Cancellation is idempotent and policy checked. Group sessions reserve a provider/resource once; participant registrations consume seat capacity atomically and cannot double-register one member. Concurrency tests must prove two simultaneous requests cannot double-book the last resource or seat.

Use an outbox for reminders/handoffs with retry, deduplication, status and safe logs. Reminder workers check current appointment status and preferences before sending; cancelled/rescheduled visits must not generate stale reminders. Realtime may refresh UI but never establishes authorization or booking correctness.

## AI boundaries, privacy, and operating model

Create a server-side AI gateway and provider interfaces rather than embedding an AI SDK secret in the app. Scope context to the authenticated user and current authorized purpose; send the minimum necessary data. Use only approved, versioned learning content for health education, show sources, and admit missing information. A retrieved page or group post cannot grant tools new permissions. Treat all tool arguments as untrusted; server checks and user confirmation remain mandatory.

Do not create diagnostic, prescription, fetal-health, or emergency triage claims. Do not infer pregnancy status or sensitive characteristics from casual text to silently enroll someone. No autonomous posting to groups. No model training on patient conversations by assumption. Document provider processing/retention, transcript retention, deletion propagation, and consent before enabling live AI. Raw audio should have short-lived processing only by default; any durable storage requires a justified explicit design. Avoid logging prompt bodies, transcripts, auth tokens, or personal identifiers to analytics/crash services.

For group care, AI can prepare questions, explain approved learning, remind consenting members of sessions, and draft educational recaps for facilitator review. It cannot replace a facilitator or automatically disclose individual check-ins. An operational staff queue is required for real handoffs, cohort review, moderation, appointment administration, and content approval. In this mobile task, implement the data contracts and a documented staff workflow; do not expand into a separate admin web app unless requested. Live release is blocked until staff actually have a supported way to operate these queues.

Anonymous aggregate measures may include enrollment-to-attendance conversion, repeat session attendance, appointment completion, learning use, and handoff response time. Define denominators and consent; suppress small cohort aggregates where identification is possible. Do not equate engagement with clinical outcome improvement or collect health text in analytics. No punitive streaks or public rankings.

## Implementation order and acceptance

1. Audit the repository and report the installed environment. Establish tokens, i18n, providers, navigation, fixture/live adapters, and reusable primitives. Create the high-fidelity Home, Miadi, Pamoja, Jifunze, and Voice screens first to establish visual consistency, then continue through all listed routes without stopping at a static mockup.
2. Complete onboarding, journey, service selection, appointment review/detail/rescheduling, group invitation/discussion/session follow-up, learning detail, profile, and help flows. Demo data must share one coherent state: booking changes update home and appointment lists; an RSVP updates session state; saved learning appears under saved items.
3. Add Supabase migrations, policies, booking transactions, generated types and integration functions. Live code is opt-in/configured; missing external SMS/AI/notification providers are documented and exposed honestly in UI.
4. Verify TypeScript, lint, Expo dependency health, critical component behavior, and database concurrency/access isolation. Add focused tests for OTP recovery, booking races, expired holds, atomic rescheduling, duplicate request handling, guardian access, membership revocation, consent withdrawal, audio cleanup, and account-switch cache clearing. Do not add tests that merely duplicate implementation.
5. Run available iOS/Android checks and inspect screenshots at a small Android width and larger phone width, enlarged fonts, long Kiswahili text, keyboard open, offline mode, empty data, and errors. Check contrast, screen reader labels/focus, reduced motion, bottom-nav clearance and scrolling. If simulator or backend services are unavailable, state which checks were not run; never claim device verification from static compilation.
6. Provide a concise completion report with implemented screens, commands/check results, configuration instructions, screenshots if available, and exact remaining live-service/clinical/operational gates. Update docs with current decisions and a continuation checklist if execution limits interrupt work. Do not label the app production-ready merely because it compiles.

Definition of done: a coherent native application with all core user routes above, no dead CTAs, a polished reference-inspired design, default Kiswahili, accessible layouts, honest demo/live boundaries, secure backend contracts, tested booking correctness, and a README another developer can follow. Clinical wording and local-language validation remain explicit release gates.

## Official technical references

Consult these for current APIs, rather than pinning dependencies based on this brief:

- https://docs.expo.dev/router/basics/notation/
- https://docs.expo.dev/router/reference/src-directory/
- https://docs.expo.dev/more/expo-cli/
- https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/
- https://supabase.com/docs/guides/auth/quickstarts/react-native
- https://supabase.com/docs/guides/database/postgres/row-level-security

These references informed routing/dependency validation and authentication/access control. The proposed folder boundaries, palette, screen inventory, and product workflows are project design decisions rather than requirements imposed by those frameworks.
