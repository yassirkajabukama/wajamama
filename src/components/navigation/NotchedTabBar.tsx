import { hugeTabIcons } from '@/components/navigation/huge-tab-icons';
import { fontFamilies } from '@/theme/comprehensive-theme';
import { brand } from '@/theme/tokens';
import { useMaterialTheme } from '@/theme/use-theme-colors';
import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs/types';
import { LinearGradient } from 'expo-linear-gradient';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Pressable, StyleSheet, Text, View, useWindowDimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

// ── Orb ──────────────────────────────────────────────────────────────────────

const ORB = 58;
const NOTCH_R = ORB / 2 + 10; // breathing room around orb
const NOTCH_D = 22;            // how deep the arc dips
const SMOOTH = 22;             // bezier smoothing

function VoiceOrb({ focused }: { focused: boolean }) {
   return (
      <View style={[styles.orbOuter, { opacity: focused ? 1 : 0.72 }]}>
         {/* Theme gradient: primaryContainer → amethyst → twilight */}
         <LinearGradient
            colors={['#F0DEFF', '#C084F5', '#9D4EDD', '#5A189A']}
            start={{ x: 0.15, y: 0 }}
            end={{ x: 0.85, y: 1 }}
            style={StyleSheet.absoluteFill}
         />
         {/* White highlight bloom top-left */}
         <LinearGradient
            colors={['rgba(255,255,255,0.72)', 'rgba(255,255,255,0)']}
            start={{ x: 0.05, y: 0 }}
            end={{ x: 0.65, y: 0.65 }}
            style={StyleSheet.absoluteFill}
         />
      </View>
   );
}

// ── Notched background ────────────────────────────────────────────────────────

function NotchedBackground({ width, height, bg }: { width: number; height: number; bg: string }) {
   const cx = width / 2;
   // SVG path: flat tab bar top with a smooth arc notch in the center
   const d = [
      `M 0 0`,
      `L ${cx - NOTCH_R - SMOOTH} 0`,
      `C ${cx - NOTCH_R} 0, ${cx - NOTCH_R} ${NOTCH_D}, ${cx} ${NOTCH_D}`,
      `C ${cx + NOTCH_R} ${NOTCH_D}, ${cx + NOTCH_R} 0, ${cx + NOTCH_R + SMOOTH} 0`,
      `L ${width} 0`,
      `L ${width} ${height}`,
      `L 0 ${height}`,
      `Z`,
   ].join(' ');

   return (
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
         <Path d={d} fill={bg} />
      </Svg>
   );
}

// ── Tab bar ───────────────────────────────────────────────────────────────────

export function NotchedTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
   const colors = useMaterialTheme();
   const insets = useSafeAreaInsets();
   const { width } = useWindowDimensions();

   const BAR_H = Platform.select({ ios: 62, android: 62, default: 62 });
   const TOTAL_H = BAR_H + insets.bottom;

   return (
      <View style={{ height: TOTAL_H }}>
         {/* Shadow layer */}
         <View style={[styles.shadow, { width, height: BAR_H, backgroundColor: colors.surfaceContainerLowest }]} />

         {/* Notched background */}
         <NotchedBackground width={width} height={BAR_H} bg={colors.surfaceContainerLowest} />

         {/* Tab row */}
         <View style={[styles.row, { height: BAR_H }]}>
            {state.routes.map((route: (typeof state.routes)[number], index: number) => {
               const focused = state.index === index;
               const isCenter = index === 2;
               const label = descriptors[route.key].options.title ?? route.name;
               const icon = hugeTabIcons[route.name];

               const onPress = () => {
                  const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                  if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
               };

               if (isCenter) {
                  return (
                     <View key={route.key} style={styles.centerSlot}>
                        <Pressable
                           accessibilityRole='button'
                           accessibilityLabel={label as string}
                           accessibilityState={{ selected: focused }}
                           onPress={onPress}
                           style={({ pressed }) => [styles.orbBtn, { opacity: pressed ? 0.85 : 1 }]}
                        >
                           <VoiceOrb focused={focused} />
                        </Pressable>
                        <Text style={[styles.label, { color: focused ? colors.primary : colors.onSurfaceVariant, marginTop: 2 }]}>
                           {label as string}
                        </Text>
                     </View>
                  );
               }

               return (
                  <Pressable
                     key={route.key}
                     accessibilityRole='button'
                     accessibilityLabel={label as string}
                     accessibilityState={{ selected: focused }}
                     onPress={onPress}
                     style={({ pressed }) => [styles.tab, { opacity: pressed ? 0.65 : 1 }]}
                  >
                     {icon && (
                        <HugeiconsIcon
                           icon={icon}
                           size={24}
                           color={focused ? colors.primary : colors.onSurfaceVariant}
                           strokeWidth={focused ? 2 : 1.5}
                        />
                     )}
                     <Text style={[styles.label, { color: focused ? colors.primary : colors.onSurfaceVariant }]}>
                        {label as string}
                     </Text>
                  </Pressable>
               );
            })}
         </View>

         {/* Safe area fill */}
         <View style={{ height: insets.bottom, backgroundColor: colors.surfaceContainerLowest }} />
      </View>
   );
}

const styles = StyleSheet.create({
   shadow: {
      position: 'absolute',
      top: 0,
      left: 0,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 8,
   },
   row: {
      flexDirection: 'row',
      alignItems: 'flex-end',
   },
   tab: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingBottom: 10,
      gap: 3,
   },
   centerSlot: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingBottom: 8,
   },
   orbBtn: {
      marginBottom: 2,
   },
   orbOuter: {
      width: ORB,
      height: ORB,
      borderRadius: ORB / 2,
      overflow: 'hidden',
      // lift the orb to sit in the notch
      marginTop: -(NOTCH_D + ORB / 2 - 4),
      shadowColor: brand.twilight,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.45,
      shadowRadius: 12,
      elevation: 10,
   },
   label: {
      fontFamily: fontFamilies.medium,
      fontSize: 11,
   },
});
