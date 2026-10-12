# Live release gates

- Configure a separate Supabase development project and apply migrations there. Generate actual database types with Supabase CLI, compare them to the hand-authored mobile contracts, and run PostgreSQL RLS/race tests for unrelated patients, verified guardian, facilitator, staff, simultaneous final slot and seat, expired holds, idempotency and replacement failure. Do not apply these migrations to production as-is.
- Approve service catalog, durations, prices, locations, availability, lead time, cancellation policy and staff scheduling workflows. The app has no verified clinic operations and has not tested server booking confirmations.
- Provision phone SMS delivery, abuse controls and session persistence; add reauthentication for sensitive account changes. Build and test an authorized staff workflow for interest requests, invitations, moderation, questions, handoffs and learning approval.
- Approve clinical Kiswahili/English copy, urgent-help routing and each educational resource. Do not publish the bundled sample articles as reviewed medical advice.
- Decide AI provider processing, context minimization, retention/deletion and audio lifecycle; implement server gateway and consent enforcement. Voice is currently a no-recording UI example.
- Implement notification outbox worker, deep-link access checks, device permissions and safe templates. No real notification is sent today.
- Run on small Android and larger iOS devices with large fonts, keyboard, offline, error and screen reader modes. No simulator or device run is claimed in this document.

The browser preview timed out; a later local preview server start was rejected by automatic approval review. `xcrun simctl` was unavailable, so no device screenshot or screen-reader result is claimed. The attempted Docker Desktop start for database testing was rejected by automatic approval review, so SQL migration and RLS/race tests remain unrun here. Expo Doctor passed 21/21 and web/iOS/Android bundle exports passed; these are compile checks only.
