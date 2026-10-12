import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { fontFamilies, fontSizes, lineHeights } from '@/theme/tokens';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        { color: theme[themeColor ?? 'text'] },
        type === 'default' && styles.default,
        type === 'title' && styles.title,
        type === 'small' && styles.small,
        type === 'smallBold' && styles.smallBold,
        type === 'subtitle' && styles.subtitle,
        type === 'link' && styles.link,
        type === 'linkPrimary' && [styles.linkPrimary, { color: theme.primary }],
        type === 'code' && styles.code,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  small: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm,
  },
  smallBold: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm,
  },
  default: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.md,
    lineHeight: lineHeights.md,
  },
  title: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes['2xl'],
    lineHeight: lineHeights['2xl'],
  },
  subtitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.xl,
    lineHeight: lineHeights.xl,
  },
  link: {
    fontFamily: fontFamilies.medium,
    lineHeight: lineHeights.sm,
    fontSize: fontSizes.sm,
  },
  linkPrimary: {
    fontFamily: fontFamilies.medium,
    lineHeight: lineHeights.sm,
    fontSize: fontSizes.sm,
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: 700 }) ?? 500,
    fontSize: 12,
  },
});
