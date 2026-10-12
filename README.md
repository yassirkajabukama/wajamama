# Wajamama mobile MVP — development demo

Expo SDK 57 / React Native 0.86 / TypeScript / Expo Router / Bun. The app is a connected **demo** of maternal, child and group care journeys. It does not book a real clinic visit, send SMS, record voice, contact staff or use a live AI provider.

```bash
bun install
bunx expo start
bunx expo lint
bunx tsc --noEmit
bun test
```

Use the visible demo sign-in flow with a fictional phone number and on-screen demo code `246810`. Data remains in memory for this app session. Signing out resets all demo data. The five primary tabs are Mwanzo, Miadi, Msaidizi, Pamoja and Jifunze. Set language on Welcome or Profile. Privacy settings include offline and error-state preview toggles.

`.env.example` documents the optional Supabase configuration boundary. Live data is **not wired to UI**; `src/lib/live.ts` fails closed when unconfigured. Setting `EXPO_PUBLIC_DATA_MODE=live` blocks demo screens with an explicit unavailable message until the live workflow is approved and wired. `supabase/migrations` contains unapplied development SQL, not a verified deployed backend. Read [architecture](docs/architecture.md), [screen inventory](docs/screen-inventory.md), [operational gates](docs/operational-readiness.md), and [progress](docs/progress.md) before attempting a rollout.

This implementation preserves the handoff files at the repository root and in `wajamama-handoff/`. The product handoff names `docs/wajamama-handoff/`, but the supplied files are located at `CODEX-PROMPT.md` and `wajamama-handoff/references/`.

Visual identity uses the user-supplied five-swatch palette with deep purple primary and Aptos files in `assets/aptos/`. The logo is not shown in app screens or the splash. Edit colors only in `src/theme/palette.json`; see [theme roles](docs/theme.md).
