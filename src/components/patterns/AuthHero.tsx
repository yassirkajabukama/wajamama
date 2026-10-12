import { Txt } from '@/components/ui/kit';
import { material } from '@/theme/tokens';
import { HugeiconsIcon } from '@hugeicons/react-native';
import type { ComponentProps } from 'react';
import { useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type IconType = ComponentProps<typeof HugeiconsIcon>['icon'];

export type HeroIcon = {
  key: string;
  icon: IconType;
  /** Fraction of hero height (0–1) */
  top: number;
  /** Fraction of screen width (0–1) */
  left: number;
  size: number;
  rotate: string;
  delay: number;
};

type AuthHeroProps = {
  /** Main background color of the hero */
  bgColor: string;
  /** Color of the large offset decorative circle */
  circleColor: string;
  /** Headline text (pre-translated) */
  title: string;
  /** Subtitle / body text (pre-translated) */
  subtitle: string;
  /** Floating icon descriptors */
  icons: readonly HeroIcon[];
  /** Large faint background icon representing the care category */
  bgIcon?: IconType;
  /** Color for the floating icons (default rgba(255,255,255,0.92)) */
  iconColor?: string;
  /** Fraction of screen height to use (default 0.44) */
  heightFraction?: number;
  /** Skip adding safe-area top inset (use when parent SafeAreaView already handles it) */
  skipTopInset?: boolean;
};

function FloatingIcon({
  icon,
  size,
  rotate,
  delay,
  color,
  style,
}: {
  icon: IconType;
  size: number;
  rotate: string;
  delay: number;
  color: string;
  style: object;
}) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.4);

  useEffect(() => {
    const ease = Easing.out(Easing.cubic);
    opacity.value = withDelay(delay, withTiming(1, { duration: 500, easing: ease }));
    scale.value = withDelay(delay, withTiming(1, { duration: 500, easing: ease }));
  }, []);

  const anim = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.floatingIcon, style, anim]}>
      {/* rotate applied as static style — strings can't be captured in Reanimated 4 worklets */}
      <View style={{ transform: [{ rotate }] }}>
        <HugeiconsIcon icon={icon} size={size} color={color} strokeWidth={1.5} />
      </View>
    </Animated.View>
  );
}

export function AuthHero({ bgColor, circleColor, title, subtitle, icons, bgIcon, iconColor = 'rgba(255,255,255,0.92)', heightFraction = 0.44, skipTopInset = false }: AuthHeroProps) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const heroHeight = height * heightFraction;
  const circleSize = width * 1.1;

  return (
    <View style={[styles.hero, { height: heroHeight, backgroundColor: bgColor }]}>
      {/* Large offset circle */}
      <View
        style={{
          position: 'absolute',
          width: circleSize,
          height: circleSize,
          borderRadius: circleSize / 2,
          backgroundColor: circleColor,
          top: -circleSize * 0.38,
          left: -circleSize * 0.08,
        }}
      />
      {/* Large faint category icon */}
      {bgIcon && (
        <View style={styles.heroBgIcon} pointerEvents='none'>
          <HugeiconsIcon icon={bgIcon} size={200} color='rgba(0,0,0,0.10)' strokeWidth={1} />
        </View>
      )}

      {icons.map((item) => (
        <FloatingIcon
          key={item.key}
          icon={item.icon}
          size={item.size}
          rotate={item.rotate}
          delay={item.delay}
          color={iconColor}
          style={{ top: heroHeight * item.top, left: width * item.left }}
        />
      ))}

      <View style={[styles.heroCopy, { paddingTop: skipTopInset ? 24 : insets.top + 24 }]}>
        <Txt kind="headline" color={material.light.onPrimary}>
          {title}
        </Txt>
        <Txt kind="body" color="rgba(255,255,255,0.65)">
          {subtitle}
        </Txt>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { overflow: 'hidden', justifyContent: 'flex-end' },
  heroCopy: { paddingHorizontal: 28, paddingBottom: 32, gap: 10 },
  floatingIcon: { position: 'absolute' },
  heroBgIcon: { position: 'absolute', bottom: -24, right: -24 },
});
