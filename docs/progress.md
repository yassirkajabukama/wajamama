# Wajamama implementation checklist

## Audit and design
- [x] Read repository AGENTS.md and full `CODEX-PROMPT.md`; inspected all four handoff references before edits.
- [x] Audited Expo 57.0.24 / React Native 0.86.3 / Router 57.0.22, Bun lockfile, starter layout, config, no native directories or backend credentials. Preserved the supplied untracked handoff and Aptos files.
- [x] Consulted versioned Expo SDK 57, Router, Font, React Native accessibility and Supabase official docs.
- [x] Inspected the current Wajamama site, logo and public stylesheet. Integrated user-supplied Aptos typography and the newer five-swatch image as the app palette with deep-purple primary. The wordmark asset is retained but no longer displayed.

## Mobile demo
- [x] Purple, logo-free native splash, language selection, four onboarding slides, separate consent, phone sign-in, dedicated demo OTP, post-login welcome and service selection are sequenced by a single entry gate.
- [x] The language screen uses one centered translated title and centered description, standalone bottom language buttons above the default-language note, and the darkest brand-purple background in both themes.
- [x] The four onboarding steps are now a full-screen, swipeable paged carousel with a distinct brand background and darker Healthicons circle per slide. Back, next, skip/done, and progress dots stay available below the slides. The floating tab bar continues to use Hugeicons.
- [x] Home “Njia zako” shortcuts scroll horizontally as compact brand cards with large, faint Hugeicons inside each card, while retaining care selection, selected-service journey/child profile, and privacy destinations.
- [x] Home “Huduma nyingine” retains its original responsive grid layout, with brand-color cards, faded Hugeicons, concise bilingual service descriptions, and the existing booking links.
- [x] Home learning section’s “Zote” action is a borderless ghost pill with a theme-aware surface background.
- [x] Shared text inputs offer filled (default) and outlined variants; the sign-in explains phone-number use and has no separate country-code field.
- [x] Service selection uses one-column reusable cards with a top-right on/off selection circle. Consent presents explanatory text, one required checkbox and one continue action; optional AI/notification choices live in privacy settings.
- [x] Removed outer borders from service options and in-screen logos. The sample-service notice lives in profile; a demo banner is no longer repeated on every screen.
- [x] Reusable grouped action rows bring consistent iOS-style containers, separators, switches/checkmarks for local choices and chevrons for in-app destinations across profile, privacy, home shortcuts, learning, groups, assistant and help.
- [x] Five-route floating pill tab bar uses installed Reanimated 4 and Hugeicons vectors; it defaults to accessible icon-only tabs, with a device-persisted label toggle in profile settings. It adapts bottom insets, shadows/elevation, keyboard visibility and dark mode across iOS and Android.
- [x] Grouped action containers have no outer border and use native iOS grouped surface and separator colors in light/dark mode; filled inputs have no outline or underline.
- [x] Language, intro completion and versioned demo choices resume from device storage; sign-out clears demo consent and session state. Home widgets and booking entry follow the selected care area.
- [x] Shared tokens, bilingual Kiswahili/English copy, reusable controls, five labeled tabs and focused stacks.
- [x] Connected demo home, appointments, Pamoja, learning and assistant/voice surfaces.
- [x] Learn presents all articles without search, filters or bookmark actions; each list card has an accessible heart toggle for session-only favorites.
- [x] Onboarding, journey, child, check-in, privacy, notifications and help flows.
- [x] Demo booking holds, review, confirmation, cancellation and replacement with shared state.
- [x] Demo group interest, invitation, RSVP, discussion, facilitator questions and follow-up.
- [x] Explicit demo/live boundary and missing-live-configuration screen.

## Backend foundation and verification
- [x] Draft Supabase schema, RLS policies and transactional booking/group RPCs are present locally.
- [x] Thirteen focused entry, theme, demo booking and OTP tests pass; TypeScript, Expo lint, Expo Doctor (21/21), web export and native iOS/Android bundle exports pass. The onboarding carousel and home shortcuts changes also passed lint, typecheck, all 13 tests, and fresh iOS/Android/web exports with their icon assets.
- [ ] Apply migration only to isolated development database and verify SQL, RLS, concurrent slot/seat races, guardian/staff duties, revoked membership, expired holds and outbox behavior. No database service was available for this run.
- [ ] Wire authenticated mobile repositories, secure session lifecycle, SMS, AI/voice, notifications and operational staff queues; verify with real integrations.
- [ ] Run device visual checks at small Android/large iOS widths, enlarged text, keyboard, offline, screen reader and reduced motion. Browser preview timed out; starting a local preview server was rejected by automatic approval review; local iOS simulator tooling was absent.
- [ ] Complete clinical/Kiswahili review and approve service/appointment policies and content.

## Integration truth
No live integration was verified. Demo care data is synthetic and held in memory; it is cleared on sign-out or reload. Language, intro completion, tab-label display preference and versioned demo consent choices are stored on device (SecureStore on native; localStorage on web), with consent cleared on sign-out. The Supabase migration is unapplied. SMS, AI, voice, notifications and staff queues are development boundaries, not working clinic services. No deployment or production write occurred.
