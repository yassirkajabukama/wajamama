# Wajamama Codex handoff

This package includes a self-contained implementation prompt and the four design reference images. It summarizes the relevant earlier conversation; it is not a verbatim transcript and does not grant access to the original chat.

## Use in your existing Expo repository

1. Extract this folder into `docs/wajamama-handoff/` inside your existing project.
2. Open that repository in Codex so it has the actual source tree and package.json.
3. Paste the starter prompt below. If your Codex environment cannot view repository images, also attach the four JPG files to its conversation.

```text
Implement the Wajamama app in this existing Expo React Native project.
Read docs/wajamama-handoff/CODEX-PROMPT.md in full and inspect all four images in docs/wajamama-handoff/references/ before editing.
That document is the product, screen, architecture, privacy, and workflow handoff from my earlier conversation. Follow it together with repository instructions.
Audit the installed Expo SDK and existing structure first, preserve my work, and then implement the complete MVP incrementally. Do not stop after a plan or static screens. Keep a progress checklist and clearly distinguish verified live integrations from development fixtures.
```

## Included images

- 01-service-grid.jpg: rounded service tiles and navigation.
- 02-wellbeing-appointments.jpg: greeting, check-in, appointment panel and learning grid.
- 03-journey-voice.jpg: circular focal point and assistant entry affordance.
- 04-learning-cards.jpg: editorial learning cards and category chips.

The prompt covers 36 screen specifications and their states. Some can be implemented as related steps or sheets rather than separate routes. It does not include an implementation of the application: the actual project was not available in the planning conversation.
