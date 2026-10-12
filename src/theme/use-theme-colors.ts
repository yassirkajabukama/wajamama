import { Platform, PlatformColor, useColorScheme } from 'react-native';
import {
    appColors,
    cardPalette,
    createComprehensiveTheme,
    iosColors,
    material,
    type AppPlatform,
    type ColorScheme
} from './comprehensive-theme';

export function useAppColorScheme(): ColorScheme {
    return useColorScheme() === 'dark' ? 'dark' : 'light';
}

export function useAppPlatform(): AppPlatform {
    return Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'web';
}

export function useAppTheme() {
    return createComprehensiveTheme(useAppColorScheme(), useAppPlatform());
}

export function useThemeColors() {
    return appColors(useAppColorScheme());
}

export function useCardPalette() {
    return cardPalette(useAppColorScheme());
}

export function useMaterialTheme() {
    return material[useAppColorScheme()];
}

export function useIosTheme() {
    const colors = iosColors(useAppColorScheme());
    return Platform.OS === 'ios'
        ? {
            ...colors,
            groupedBackground: PlatformColor('systemGroupedBackground'),
            secondaryGroupedBackground: PlatformColor('secondarySystemGroupedBackground'),
            separator: PlatformColor('separator'),
        }
        : colors;
}

export function usePlatformSpecificTheme() {
    const scheme = useAppColorScheme();
    const platform = useAppPlatform();
    return createComprehensiveTheme(scheme, platform);
}
