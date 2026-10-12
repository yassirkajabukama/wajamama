import { useApp } from '@/providers/AppProvider';
import { brand, material } from '@/theme/tokens';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const LOGO = require('../../assets/wajamama-brand.png');

// Minimum time the JS splash stays visible — ensures brand impression
// even on fast devices where storage reads complete instantly.
const MIN_HOLD_MS = 2800;

export default function SplashScreen() {
  const { ready, entryRoute } = useApp();
  const startTime = useRef(Date.now());
  const navigated = useRef(false);

  // ── Animation values ────────────────────────────────────────────────────
  const logoOpacity = useSharedValue(0);
  const logoY = useSharedValue(24);

  // Full-screen exit fade
  const screenOpacity = useSharedValue(1);

  // ── Entry sequence on mount ─────────────────────────────────────────────
  useEffect(() => {
    const ease = Easing.out(Easing.cubic);

    // Logo fades + rises in
    logoOpacity.value = withTiming(1, { duration: 520, easing: ease });
    logoY.value = withTiming(0, { duration: 520, easing: ease });
  }, []);

  // ── Exit: wait for ready + min hold, then fade out and navigate ─────────
  useEffect(() => {
    if (!ready) return;

    const navigate = () => {
      if (navigated.current) return;
      navigated.current = true;
      router.replace(entryRoute);
    };

    const elapsed = Date.now() - startTime.current;
    const remaining = Math.max(0, MIN_HOLD_MS - elapsed);

    const exitDelay = setTimeout(() => {
      screenOpacity.value = withSequence(
        withTiming(1, { duration: 0 }),            // hold
        withDelay(80, withTiming(0, {              // fade to black
          duration: 380,
          easing: Easing.in(Easing.cubic),
        })),
      );
      // Navigate just after the fade starts (screen is going dark anyway)
      setTimeout(() => runOnJS(navigate)(), 320);
    }, remaining);

    return () => clearTimeout(exitDelay);
  }, [ready, entryRoute]);

  // ── Animated styles ─────────────────────────────────────────────────────
  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ translateY: logoY.value }],
  }));
  const screenStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));

  return (
    <Animated.View style={[styles.screen, screenStyle]}>
      {/* Logo */}
      <Animated.View style={[styles.logoWrap, logoStyle]}>
        <Image
          source={LOGO}
          resizeMode="contain"
          style={styles.logo}
          accessibilityLabel="Wajamama — Family and Women's Health"
          accessibilityRole="image"
        />
      </Animated.View>

      {/* Bottom accent bar */}
      <View style={styles.bottomBar} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: material.light.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrap: {
    alignItems: 'center',
    gap: 0,
  },
  logo: {
    width: 280,
    height: 280 * (136 / 750), // maintain source aspect ratio (750×136)
  },
  // Thin brand-coloured bar at the very bottom — grounds the screen
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: brand.orange,
  },
});
