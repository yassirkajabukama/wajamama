import { Platform } from 'react-native';
import palette from './palette.json';

export type ColorScheme = 'light' | 'dark';
export type AppPlatform = 'ios' | 'android' | 'web';

// ============== FONT CONFIGURATION ==============
export const fontFamilies = {
   regular: 'Geist-Regular',
   medium: 'Geist-Medium',
   semibold: 'Geist-SemiBold',
   bold: 'Geist-Bold',
   light: 'Geist-Light',
} as const;

export const fontSizes = {
   xs: 12,
   sm: 14,
   md: 16,
   lg: 18,
   xl: 20,
   '2xl': 24,
   '3xl': 32,
   '4xl': 40,
} as const;

export const lineHeights = {
   xs: 16,
   sm: 20,
   md: 24,
   lg: 28,
   xl: 32,
   '2xl': 36,
   '3xl': 44,
   '4xl': 52,
} as const;

export const letterSpacings = {
   xs: -0.5,
   sm: -0.25,
   md: 0,
   lg: 0.25,
   xl: 0.5,
} as const;

// ============== BORDER RADIUS ==============
// xs=4  sm=8  md=12  lg=16  xl=20  2xl=24  3xl=32  4xl=36  pill=9999
// Use `pill` for circular elements and pill-shaped buttons (height/2 effect).
// Use `4xl` for slide-up card top corners (modal card pattern).
export const radii = {
   xs: 4,
   sm: 8,
   md: 12,
   lg: 16,
   xl: 20,
   '2xl': 24,
   '3xl': 32,
   '4xl': 36,
   pill: 9999,
} as const;

// ============== SPACING ==============
export const spacing = {
   xs: 4,
   sm: 8,
   md: 12,
   lg: 16,
   xl: 20,
   '2xl': 24,
   '3xl': 32,
   '4xl': 48,
   '5xl': 64,
} as const;

// ============== TYPOGRAPHY ==============
export const typography = {
   caption: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.xs,
      lineHeight: lineHeights.xs,
      letterSpacing: letterSpacings.sm,
   },
   small: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.sm,
      lineHeight: lineHeights.sm,
      letterSpacing: letterSpacings.md,
   },
   body: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.lg,
      lineHeight: lineHeights.lg,
      letterSpacing: letterSpacings.md,
   },
   bodyLarge: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.xl,
      lineHeight: lineHeights.xl,
      letterSpacing: letterSpacings.md,
   },
   label: {
      fontFamily: fontFamilies.medium,
      fontSize: fontSizes.md,
      lineHeight: lineHeights.md,
      letterSpacing: letterSpacings.md,
   },
   heading: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.xl,
      lineHeight: 26,
      letterSpacing: letterSpacings.sm,
   },
   title: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes['2xl'],
      lineHeight: 30,
      letterSpacing: letterSpacings.sm,
   },
   headline: {
      fontFamily: fontFamilies.bold,
      fontSize: fontSizes['3xl'],
      lineHeight: 38,
      letterSpacing: letterSpacings.xs,
   },
   display: {
      fontFamily: fontFamilies.bold,
      fontSize: fontSizes['4xl'],
      lineHeight: 48,
      letterSpacing: letterSpacings.xs,
   },
} as const;

// ============== COLOR PALETTE ==============
export const brand = palette.brand;
export const material = palette.material;

// ============== PLATFORM-SPECIFIC ADJUSTMENTS ==============
export const platformAdjustments = {
   ios: {
      borderRadius: radii.lg,
      buttonHeight: 50,
      inputHeight: 50,
      iconSize: 24,
      spacing: spacing.lg,
   },
   android: {
      borderRadius: radii.md,
      buttonHeight: 56,
      inputHeight: 56,
      iconSize: 24,
      spacing: spacing.md,
   },
   web: {
      borderRadius: radii.md,
      buttonHeight: 48,
      inputHeight: 48,
      iconSize: 20,
      spacing: spacing.md,
   },
} as const;

// ============== COMPONENT THEMES ==============
export interface ComponentTheme {
   button: {
      minHeight: number;
      borderRadius: number;
      horizontalPadding: number;
      verticalPadding: number;
      fontSize: number;
      fontWeight: string;
      letterSpacing: number;
      primary: {
         background: string;
         foreground: string;
         pressed: string;
      };
      secondary: {
         background: string;
         foreground: string;
         border: string;
         pressed: string;
      };
      ghost: {
         background: string;
         foreground: string;
         pressed: string;
      };
   };
   input: {
      minHeight: number;
      borderRadius: number;
      horizontalPadding: number;
      verticalPadding: number;
      fontSize: number;
      fontWeight: string;
      letterSpacing: number;
      text: string;
      placeholder: string;
      filled: string;
      filledFocused: string;
      outlined: string;
      outline: string;
      focusedOutline: string;
      error: string;
      errorText: string;
   };
   checkbox: {
      size: number;
      borderRadius: number;
      selected: string;
      onSelected: string;
      outline: string;
      pressed: string;
   };
   radio: {
      size: number;
      dotSize: number;
      outline: string;
      selected: string;
      pressed: string;
   };
   card: {
      background: string;
      borderRadius: number;
      padding: number;
      shadow: {
         color: string;
         offset: { width: number; height: number };
         opacity: number;
         radius: number;
      };
   };
   chip: {
      minHeight: number;
      borderRadius: number;
      horizontalPadding: number;
      verticalPadding: number;
      fontSize: number;
      fontWeight: string;
      letterSpacing: number;
   };
   switch: {
      width: number;
      height: number;
      borderRadius: number;
      thumbSize: number;
      trackActive: string;
      trackInactive: string;
      thumb: string;
   };
   selection: {
      size: number;
      borderRadius: number;
      outline: string;
      selected: string;
      onSelected: string;
   };
}

// ============== THEME GENERATOR ==============
export function createComprehensiveTheme(
   scheme: ColorScheme,
   platform: AppPlatform,
): {
   colors: typeof material.light;
   backgrounds: {
      primary: string;
      secondary: string;
      accent: string;
      muted: string;
      page: string;
      surface: string;
   };
   platform: AppPlatform;
   fontFamilies: typeof fontFamilies;
   fontSizes: typeof fontSizes;
   lineHeights: typeof lineHeights;
   letterSpacings: typeof letterSpacings;
   radii: typeof radii;
   spacing: typeof spacing;
   typography: typeof typography;
   components: ComponentTheme;
} {
   const colors = material[scheme];
   const platformSettings =
      platformAdjustments[platform] || platformAdjustments.web;

   // Background colors
   const backgrounds = {
      primary: colors.primary,
      secondary: colors.secondaryContainer,
      accent: colors.tertiaryContainer,
      muted: colors.surfaceContainerLow,
      page: colors.background,
      surface: colors.surface,
   };

   // Component-specific themes
   const components: ComponentTheme = {
      button: {
         minHeight: platformSettings.buttonHeight,
         borderRadius: radii.pill,
         horizontalPadding: platformSettings.spacing,
         verticalPadding: spacing.md,
         fontSize: fontSizes.md,
         fontWeight: fontFamilies.medium,
         letterSpacing: letterSpacings.md,
         primary: {
            background: colors.primary,
            foreground: colors.onPrimary,
            pressed: colors.primaryContainer,
         },
         secondary: {
            background: colors.surfaceContainerLow,
            foreground: colors.primary,
            border: colors.outlineVariant,
            pressed: colors.surfaceContainer,
         },
         ghost: {
            background: 'transparent',
            foreground: colors.primary,
            pressed: colors.surfaceContainerLow,
         },
      },
      input: {
         minHeight: platformSettings.inputHeight,
         borderRadius: platformSettings.borderRadius,
         horizontalPadding: platformSettings.spacing,
         verticalPadding: spacing.md,
         fontSize: fontSizes.md,
         fontWeight: fontFamilies.regular,
         letterSpacing: letterSpacings.md,
         text: colors.onSurface,
         placeholder: colors.onSurfaceVariant,
         filled: colors.surfaceContainerLow,
         filledFocused: colors.surfaceContainer,
         outlined: colors.surfaceContainerLowest,
         outline: colors.outlineVariant,
         focusedOutline: colors.primary,
         error: colors.error,
         errorText: colors.onErrorContainer,
      },
      checkbox: {
         size: 24,
         borderRadius: platform === 'ios' ? radii.xs : spacing.xs,
         selected: colors.primary,
         onSelected: colors.onPrimary,
         outline: colors.outline,
         pressed: colors.primaryContainer,
      },
      radio: {
         size: 24,
         dotSize: 12,
         outline: colors.outline,
         selected: colors.primary,
         pressed: colors.primaryContainer,
      },
      card: {
         background: colors.surfaceContainerLow,
         borderRadius: platform === 'ios' ? radii.lg : radii.xl,
         padding: spacing['2xl'],
         shadow: {
            color: colors.shadow,
            offset: { width: 0, height: 2 },
            opacity: 0.1,
            radius: 8,
         },
      },
      chip: {
         minHeight: 48,
         borderRadius: radii.pill,
         horizontalPadding: spacing.xl,
         verticalPadding: spacing.md,
         fontSize: fontSizes.sm,
         fontWeight: fontFamilies.medium,
         letterSpacing: letterSpacings.md,
      },
      switch: {
         width: 52,
         height: 32,
         borderRadius: 16,
         thumbSize: 28,
         trackActive: colors.primary,
         trackInactive: colors.outline,
         thumb: colors.onPrimary,
      },
      selection: {
         size: 30,
         borderRadius: radii.pill,
         outline: colors.primary,
         selected: colors.primary,
         onSelected: colors.onPrimary,
      },
   };

   return {
      colors,
      backgrounds,
      platform,
      fontFamilies,
      fontSizes,
      lineHeights,
      letterSpacings,
      radii,
      spacing,
      typography,
      components,
   };
}

// ============== THEME HOOK HELPERS ==============
export function getPlatform(): AppPlatform {
   return Platform.OS === 'ios'
      ? 'ios'
      : Platform.OS === 'android'
        ? 'android'
        : 'web';
}

export function getThemeForPlatform(
   scheme: ColorScheme,
   platform: AppPlatform,
) {
   return createComprehensiveTheme(scheme, platform);
}

// ============== APP COLORS (Legacy compatibility) ==============
export function appColors(scheme: ColorScheme) {
   const c = material[scheme];
   return {
      ...c,
      bg: c.background,
      ink: c.onBackground,
      muted: c.onSurfaceVariant,
      logoCanvas: material.light.surfaceContainerLowest,
      border: c.outlineVariant,
      danger: c.error,
      orange: brand.orange,
      amethyst: brand.amethyst,
      yellow: brand.sunset,
      lavender: c.primaryContainer,
      mint: c.secondaryContainer,
      blue: c.surfaceContainerHigh,
      peach: c.tertiaryContainer,
      rose: c.errorContainer,
      butter: c.tertiaryContainer,
      orchid: brand.amethyst,
      green: c.primary,
   };
}

export function cardPalette(scheme: ColorScheme) {
   const c = appColors(scheme);
   return [c.lavender, c.butter, c.mint, c.peach] as const;
}

// ============== IOS SEMANTIC COLORS ==============
export function iosColors(scheme: ColorScheme) {
   const c = material[scheme];
   return {
      tint: c.primary,
      label: c.onSurface,
      secondaryLabel: c.onSurfaceVariant,
      systemBackground: c.background,
      secondarySystemBackground: c.surfaceContainerLow,
      tertiarySystemBackground: c.surfaceContainerHigh,
      groupedBackground: c.surfaceContainer,
      secondaryGroupedBackground: c.surfaceContainerLow,
      separator: c.outlineVariant,
      fill: c.surfaceVariant,
      link: c.primary,
      destructive: c.error,
   };
}
