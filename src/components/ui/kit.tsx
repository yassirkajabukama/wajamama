import { useApp } from '@/providers/AppProvider';
import {
   fontFamilies,
   fontSizes,
   lineHeights,
   radii,
   spacing,
   typography,
} from '@/theme/comprehensive-theme';
import { useAppTheme, useThemeColors } from '@/theme/use-theme-colors';
import { Ionicons } from '@expo/vector-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import type { ComponentProps } from 'react';
import { router, type Href } from 'expo-router';
import React from 'react';
import {
   ActivityIndicator,
   KeyboardAvoidingView,
   Platform,
   Pressable,
   ScrollView,
   StyleSheet,
   Text,
   TextInput,
   View,
   useWindowDimensions,
   type ColorValue,
   type TextInputProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const go = (path: string) => router.push(path as Href);
type TextKind =
   | 'caption'
   | 'small'
   | 'body'
   | 'bodyLarge'
   | 'label'
   | 'heading'
   | 'title'
   | 'headline'
   | 'display';
const typeStyles = StyleSheet.create(typography);

// Backward compatibility mapping
const legacyTypeStyles: Record<string, any> = {
   title: typeStyles.title,
   heading: typeStyles.heading,
   small: typeStyles.small,
};
export function Txt({
   children,
   kind = 'body',
   color,
   align,
   lines,
}: {
   children: React.ReactNode;
   kind?: TextKind;
   color?: string;
   align?: 'left' | 'center' | 'right';
   lines?: number;
}) {
   const c = useThemeColors();
   const textStyle =
      typeStyles[kind] || legacyTypeStyles[kind] || typeStyles.body;
   return (
      <Text
         numberOfLines={lines}
         ellipsizeMode='tail'
         style={[textStyle, { color: color ?? c.onSurface, textAlign: align }]}
      >
         {children}
      </Text>
   );
}
export function Icon({
   name,
   size = 24,
   color,
}: {
   name: React.ComponentProps<typeof Ionicons>['name'];
   size?: number;
   color?: ColorValue;
}) {
   const c = useThemeColors();
   return (
      <Ionicons
         accessible={false}
         name={name}
         size={size}
         color={color ?? c.primary}
      />
   );
}
export function Button({
   label,
   onPress,
   secondary = false,
   variant,
   compact = false,
   disabled = false,
   icon,
}: {
   label: string;
   onPress: () => void;
   secondary?: boolean;
   variant?: 'primary' | 'secondary' | 'ghost';
   compact?: boolean;
   disabled?: boolean;
   icon?: React.ComponentProps<typeof Ionicons>['name'];
}) {
   const theme = useAppTheme();
   const tokens = theme.components.button;
   const choice = variant ?? (secondary ? 'secondary' : 'primary');
   const tone = tokens[choice];
   const pressedBackgroundColor =
      choice === 'secondary' ? tone.background : tone.pressed;
   return (
      <Pressable
         accessibilityRole='button'
         accessibilityLabel={label}
         accessibilityState={{ disabled }}
         disabled={disabled}
         onPress={onPress}
         style={({ pressed }) => [
            styles.button,
            {
               minHeight: compact ? 44 : tokens.minHeight,
               borderRadius: tokens.borderRadius,
               paddingHorizontal: compact
                  ? spacing.lg
                  : tokens.horizontalPadding,
               paddingVertical: compact ? spacing.md : tokens.verticalPadding,
               backgroundColor: pressed
                  ? pressedBackgroundColor
                  : tone.background,
               borderColor:
                  choice === 'secondary'
                     ? tokens.secondary.border
                     : 'transparent',
               borderWidth: choice === 'secondary' ? 1 : 0,
               opacity: disabled ? 0.45 : pressed ? 0.75 : 1,
            },
         ]}
      >
         {icon && <Icon name={icon} color={tone.foreground} />}
         <Text
            style={[
               typeStyles.label,
               { color: tone.foreground, flexShrink: 1, textAlign: 'center' },
            ]}
         >
            {label}
         </Text>
      </Pressable>
   );
}
export function Chip({
   label,
   selected,
   onPress,
}: {
   label: string;
   selected?: boolean;
   onPress: () => void;
}) {
   const theme = useAppTheme();
   const c = theme.colors;
   const tokens = theme.components.chip;
   return (
      <Pressable
         accessibilityRole='button'
         accessibilityState={{ selected: !!selected }}
         onPress={onPress}
         style={[
            styles.chip,
            {
               minHeight: tokens.minHeight,
               borderRadius: tokens.borderRadius,
               paddingHorizontal: tokens.horizontalPadding,
               paddingVertical: tokens.verticalPadding,
               backgroundColor: selected ? c.primary : theme.backgrounds.muted,
            },
         ]}
      >
         <Text
            style={[
               typeStyles.small,
               {
                  color: selected ? c.onPrimary : c.onSurface,
                  fontSize: tokens.fontSize,
                  fontFamily: tokens.fontWeight,
                  letterSpacing: tokens.letterSpacing,
               },
            ]}
         >
            {label}
         </Text>
      </Pressable>
   );
}
export function Card({
   children,
   tone,
   onPress,
}: {
   children: React.ReactNode;
   tone?: string;
   onPress?: () => void;
}) {
   const tokens = useAppTheme().components.card;
   const backgroundColor = tone ?? tokens.background;
   const style = [
      styles.card,
      {
         backgroundColor,
         borderRadius: tokens.borderRadius,
         padding: tokens.padding,
      },
   ];
   return onPress ? (
      <Pressable
         accessibilityRole='button'
         onPress={onPress}
         style={({ pressed }) => [...style, { opacity: pressed ? 0.8 : 1 }]}
      >
         {children}
      </Pressable>
   ) : (
      <View style={style}>{children}</View>
   );
}
export function Row({ children }: { children: React.ReactNode }) {
   return <View style={styles.row}>{children}</View>;
}
export function Grid({ children }: { children: React.ReactNode }) {
   const { width, fontScale } = useWindowDimensions();
   return (
      <View style={styles.grid}>
         {React.Children.map(children, (child) => (
            <View
               style={{
                  width: width < 350 || fontScale > 1.3 ? '100%' : '48%',
                  flexGrow: 1,
               }}
            >
               {child}
            </View>
         ))}
      </View>
   );
}
export function Field({
   label,
   variant = 'filled',
   suffixIcon,
   onFocus,
   onBlur,
   ...props
}: TextInputProps & {
   label: string;
   variant?: 'filled' | 'outlined';
   suffixIcon?: ComponentProps<typeof HugeiconsIcon>['icon'];
}) {
   const theme = useAppTheme();
   const c = theme.colors;
   const tokens = theme.components.input;
   const [focused, setFocused] = React.useState(false);
   const variantStyle =
      variant === 'outlined'
         ? {
              backgroundColor: tokens.outlined,
              borderWidth: focused ? 2 : 1,
              borderColor: focused ? tokens.focusedOutline : tokens.outline,
           }
         : {
              backgroundColor: focused ? tokens.filledFocused : tokens.filled,
              borderWidth: 0,
           };
   return (
      <View style={{ gap: spacing.sm }}>
         <Txt kind='label'>{label}</Txt>
         <View
            style={[
               styles.inputRow,
               {
                  minHeight: tokens.minHeight,
                  borderRadius: tokens.borderRadius,
                  paddingHorizontal: tokens.horizontalPadding,
               },
               variantStyle,
            ]}
         >
            <TextInput
               accessibilityLabel={label}
               placeholderTextColor={tokens.placeholder}
               selectionColor={c.primary}
               underlineColorAndroid='transparent'
               {...props}
               onFocus={(event) => {
                  setFocused(true);
                  onFocus?.(event);
               }}
               onBlur={(event) => {
                  setFocused(false);
                  onBlur?.(event);
               }}
               style={[
                  styles.input,
                  {
                     flex: 1,
                     paddingVertical: tokens.verticalPadding,
                     color: tokens.text,
                  },
                  props.multiline && { minHeight: 112, textAlignVertical: 'top' },
                  props.style,
               ]}
            />
            {suffixIcon && (
               <HugeiconsIcon
                  icon={suffixIcon}
                  size={20}
                  color={focused ? c.primary : tokens.placeholder}
                  strokeWidth={1.5}
               />
            )}
         </View>
      </View>
   );
}
export function Toggle({
   label,
   value,
   onChange,
}: {
   label: string;
   value: boolean;
   onChange: (v: boolean) => void;
}) {
   const tokens = useAppTheme().components.checkbox;
   return (
      <Pressable
         accessibilityRole='checkbox'
         accessibilityLabel={label}
         accessibilityState={{ checked: value }}
         onPress={() => onChange(!value)}
         style={styles.toggle}
      >
         <View
            style={{
               width: tokens.size,
               height: tokens.size,
               borderRadius: tokens.borderRadius,
               backgroundColor: value ? tokens.selected : 'transparent',
               borderColor: value ? tokens.selected : tokens.outline,
               borderWidth: value ? 0 : 2,
               alignItems: 'center',
               justifyContent: 'center',
            }}
         >
            {value && (
               <Icon name='checkmark' size={18} color={tokens.onSelected} />
            )}
         </View>
         <View style={{ flex: 1 }}>
            <Txt>{label}</Txt>
         </View>
      </Pressable>
   );
}
export function Radio({
   label,
   selected,
   onPress,
}: {
   label: string;
   selected: boolean;
   onPress: () => void;
}) {
   const tokens = useAppTheme().components.radio;
   return (
      <Pressable
         accessibilityRole='radio'
         accessibilityLabel={label}
         accessibilityState={{ checked: selected }}
         onPress={onPress}
         style={styles.toggle}
      >
         <View
            style={{
               width: tokens.size,
               height: tokens.size,
               borderRadius: tokens.size / 2,
               borderWidth: 2,
               borderColor: selected ? tokens.selected : tokens.outline,
               alignItems: 'center',
               justifyContent: 'center',
            }}
         >
            {selected && (
               <View
                  style={{
                     width: tokens.dotSize,
                     height: tokens.dotSize,
                     borderRadius: tokens.dotSize / 2,
                     backgroundColor: tokens.selected,
                  }}
               />
            )}
         </View>
         <View style={{ flex: 1 }}>
            <Txt>{label}</Txt>
         </View>
      </Pressable>
   );
}
export function Notice({
   children,
   danger = false,
}: {
   children: React.ReactNode;
   danger?: boolean;
}) {
   const c = useThemeColors();
   return (
      <View
         accessibilityLiveRegion='polite'
         style={[
            styles.notice,
            {
               backgroundColor: danger ? c.errorContainer : c.tertiaryContainer,
            },
         ]}
      >
         <Txt
            kind='small'
            color={danger ? c.onErrorContainer : c.onTertiaryContainer}
         >
            {children}
         </Txt>
      </View>
   );
}
export function Screen({
   children,
   title,
   subtitle,
   headerLeft,
   headerRight,
   back = false,
   tab = false,
}: {
   children: React.ReactNode;
   title?: string;
   subtitle?: string;
   headerLeft?: React.ReactNode;
   headerRight?: React.ReactNode;
   back?: boolean;
   tab?: boolean;
}) {
   const { t, offline } = useApp();
   const c = useThemeColors();
   if (process.env.EXPO_PUBLIC_DATA_MODE === 'live')
      return (
         <SafeAreaView
            style={{
               flex: 1,
               backgroundColor: c.background,
               padding: 24,
               justifyContent: 'center',
               gap: 16,
            }}
         >
            <Txt kind='title'>
               {t('Huduma haiwezi kuanza', 'Service unavailable')}
            </Txt>
            <Txt>
               {process.env.EXPO_PUBLIC_SUPABASE_URL &&
               process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY
                  ? t(
                       'Muunganisho wa moja kwa moja bado haujaidhinishwa. Hakuna hatua ya mfano itakayoonekana kama huduma halisi.',
                       'The live workflow is not approved or connected. No demo action will be shown as real care.',
                    )
                  : t(
                       'Mipangilio ya Supabase haijakamilika. Weka anwani na ufunguo wa kuchapishwa kabla ya kuendelea.',
                       'Supabase configuration is missing. Set the URL and publishable key before proceeding.',
                    )}
            </Txt>
         </SafeAreaView>
      );
   return (
      <SafeAreaView
         edges={['top', 'left', 'right']}
         style={{ flex: 1, backgroundColor: c.background }}
      >
         <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
         >
            <ScrollView
               keyboardShouldPersistTaps='handled'
               contentContainerStyle={[
                  styles.screen,
                  tab && { paddingBottom: 160 },
               ]}
            >
               {(headerLeft || headerRight) ? (
                  <View
                     style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 16,
                     }}
                  >
                     <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        {back && (
                           <Pressable
                              accessibilityRole='button'
                              accessibilityLabel={t('Rudi', 'Back')}
                              onPress={() =>
                                 router.canGoBack()
                                    ? router.back()
                                    : router.replace('/')
                              }
                              style={{
                                 minHeight: 48,
                                 flexDirection: 'row',
                                 alignItems: 'center',
                                 gap: 8,
                              }}
                           >
                              <Icon name='arrow-back' />
                              <Txt>{t('Rudi', 'Back')}</Txt>
                           </Pressable>
                        )}
                        {headerLeft}
                     </View>
                     {headerRight}
                  </View>
               ) : (
                  back && (
                     <Pressable
                        accessibilityRole='button'
                        accessibilityLabel={t('Rudi', 'Back')}
                        onPress={() =>
                           router.canGoBack()
                              ? router.back()
                              : router.replace('/')
                        }
                        style={{
                           minHeight: 48,
                           flexDirection: 'row',
                           alignItems: 'center',
                           gap: 8,
                        }}
                     >
                        <Icon name='arrow-back' />
                        <Txt>{t('Rudi', 'Back')}</Txt>
                     </Pressable>
                  )
               )}
               {offline && (
                  <Notice>
                     {t(
                        'Hali ya nje ya mtandao. Mabadiliko yamesitishwa.',
                        'Offline simulation. Changes are paused.',
                     )}
                  </Notice>
               )}
               {title && <Txt kind='title'>{title}</Txt>}
               {subtitle && <Txt color={c.onSurfaceVariant}>{subtitle}</Txt>}
               {children}
            </ScrollView>
         </KeyboardAvoidingView>
      </SafeAreaView>
   );
}
export function Access({ children }: { children: React.ReactNode }) {
   const { state, t } = useApp();
   return state.signedIn ? (
      <>{children}</>
   ) : (
      <Screen title={t('Karibu tena', 'Welcome back')} back>
         <Notice>
            {t(
               'Ingia kwenye akaunti ya majaribio ili kuendelea.',
               'Sign in to a demo account to continue.',
            )}
         </Notice>
         <Button label={t('Ingia', 'Sign in')} onPress={() => go('/login')} />
      </Screen>
   );
}
export function DataBoundary({
   children,
   loading = false,
}: {
   children: React.ReactNode;
   loading?: boolean;
}) {
   const { simulateError, setSimulateError, t } = useApp();
   const c = useThemeColors();
   if (loading)
      return (
         <ActivityIndicator
            accessibilityLabel={t('Inapakia', 'Loading')}
            color={c.primary}
         />
      );
   if (simulateError)
      return (
         <Card>
            <Notice danger>
               {t(
                  'Hatukuweza kupakia. Jaribu tena.',
                  'Could not load. Please retry.',
               )}
            </Notice>
            <Button
               label={t('Jaribu tena', 'Retry')}
               onPress={() => setSimulateError(false)}
            />
         </Card>
      );
   return <>{children}</>;
}
const styles = StyleSheet.create({
   screen: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.xl,
      paddingBottom: 48,
      gap: spacing.xl,
      width: '100%',
      maxWidth: 760,
      alignSelf: 'center',
   },
   button: {
      paddingVertical: spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: spacing.sm,
   },
   card: { gap: spacing.md },
   row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      flexWrap: 'wrap',
   },
   grid: { flexDirection: 'row', gap: spacing.md, flexWrap: 'wrap' },
   chip: { paddingVertical: spacing.md, justifyContent: 'center' },
   inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      overflow: 'hidden',
   },
   input: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.md,
      lineHeight: lineHeights.md,
      letterSpacing: 0,
   },
   toggle: {
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.sm,
   },
   notice: { padding: spacing.lg, borderRadius: radii.md },
});
