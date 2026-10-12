# Wajamama color system

The attached image supplies five swatches: orange `#FF9100`, sunset `#FFC880`, amethyst `#9D4EDD`, twilight `#5A189A`, and deep purple `#3C096C`. It has no behavioral instructions. Twilight is the primary action color in light mode; an accessible light-purple tone is the dark-mode primary. Orange is used as a warm accent and container color, not as small text on white.

`src/theme/palette.json` is the single editable color source. `src/theme/tokens.ts` exposes Material 3 light/dark color roles, iOS semantic aliases, and app-level names. `src/theme/use-theme-colors.ts` follows the system color scheme. Screens and controls use `useThemeColors`; `src/constants/theme.ts` derives the legacy starter mapping from the same roles. `app.config.ts` reads the palette for native launch and adaptive-icon backgrounds and Android task color. `app.json` keeps `userInterfaceStyle: automatic`.

Use `primary` with `onPrimary` for filled actions, `primaryContainer` with `onPrimaryContainer` for purple cards, and `tertiaryContainer` with `onTertiaryContainer` for warm notices. Use `background`/`onBackground`, `surface`/`onSurface`, and `outlineVariant` for layouts. `iosColors()` maps these roles to tint, labels, system backgrounds and separators for future native iOS controls. The app currently uses React Native controls styled with these roles; it does not claim Android wallpaper-based dynamic color.

The supporting neutral, error and dark-mode tones are derived design choices rather than additional swatches from the image. Theme tests assert the five exact swatches, primary selection, iOS aliases, and at least 4.5:1 contrast for core text/control pairs.
