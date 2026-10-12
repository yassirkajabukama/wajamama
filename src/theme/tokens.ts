import {
    appColors,
    cardPalette,
    createComprehensiveTheme,
    fontFamilies,
    fontSizes,
    iosColors,
    lineHeights,
    radii,
    spacing,
    typography,
    type AppPlatform,
    type ColorScheme,
} from './comprehensive-theme';
import themeSource from './palette.json';

/** Five supplied swatches and semantic Material 3 roles live in palette.json. */
export const brand = themeSource.brand;
export const material = themeSource.material;

// Re-export from comprehensive theme for backward compatibility
export {
    appColors,
    cardPalette, createComprehensiveTheme as createTheme, fontFamilies,
    fontSizes, iosColors, lineHeights,
    radii,
    spacing,
    typography, type AppPlatform, type ColorScheme
};

