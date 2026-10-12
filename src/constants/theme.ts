/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

import { fontFamilies, material } from '@/theme/tokens';

export const Colors = {
 light: { text:material.light.onSurface, background:material.light.background, backgroundElement:material.light.surfaceContainer, backgroundSelected:material.light.primaryContainer, textSecondary:material.light.onSurfaceVariant, primary:material.light.primary },
 dark: { text:material.dark.onSurface, background:material.dark.background, backgroundElement:material.dark.surfaceContainer, backgroundSelected:material.dark.primaryContainer, textSecondary:material.dark.onSurfaceVariant, primary:material.dark.primary },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: fontFamilies.regular,
    serif: fontFamilies.regular,
    rounded: fontFamilies.regular,
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: fontFamilies.regular,
    serif: fontFamilies.regular,
    rounded: fontFamilies.regular,
    mono: 'monospace',
  },
  web: {
    sans: fontFamilies.regular,
    serif: fontFamilies.regular,
    rounded: fontFamilies.regular,
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
