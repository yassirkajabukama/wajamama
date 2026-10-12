import { Screen, Txt } from '@/components/ui/kit';
import { useApp } from '@/providers/AppProvider';
import { brand, material, radii } from '@/theme/tokens';
import {
  Appointment01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  FavouriteIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Redirect, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const light = material.light.onPrimary;

const slides = [
  {
    icon: FavouriteIcon,
    background: brand.sunset,
    circleAlign: 'left' as const,
    buttonColor: brand.orange,
    buttonIconColor: brand.deep,
    foreground: brand.deep,
    iconColor: brand.deep,
    statusBar: 'dark' as const,
    swTitle: 'Huduma inayokusikiliza kwa kina',
    enTitle: 'Care that truly listens to you',
    swBody:
      'Tunafahamu kila mama ni na hadithi yake ya kipekee. Nafasi salama na ya kujiamini ambapo unaweza kuuliza maswali, kujifunza kuhusu afya yako, na kupanga hatua zako za afya kwa utulivu na kwa msaada wa kitaalamu.',
    enBody:
      'We understand every mother has her unique story. A safe, empowering space where you can ask questions, learn about your health, and plan your health journey with confidence and professional support.',
  },
  {
    icon: Appointment01Icon,
    background: brand.amethyst,
    circleAlign: 'right' as const,
    buttonColor: brand.twilight,
    buttonIconColor: light,
    foreground: light,
    iconColor: light,
    statusBar: 'light' as const,
    swTitle: 'Panga ziara zako za kiafya kwa urahisi',
    enTitle: 'Plan your health visits with ease',
    swBody:
      'Chunguza huduma mbalimbali za kiafya zinazopatikana, uwiano miadi yako kwa wataalamu, na uweke maelezo yote ya ziara sehemu moja. Hakikisha unapata huduma unayohitaji wakati unapohitaji, bila usumbufu.',
    enBody:
      'Explore various available health services, schedule appointments with professionals, and keep all your visit details in one place. Ensure you get the care you need when you need it, without hassle.',
  },
  {
    icon: UserGroupIcon,
    background: brand.orange,
    circleAlign: 'left' as const,
    buttonColor: light,
    buttonIconColor: brand.orange,
    foreground: light,
    iconColor: light,
    statusBar: 'dark' as const,
    swTitle: 'Tembea pamoja na jamii ya Wajamama',
    enTitle: 'Walk together with the Wajamama community',
    swBody:
      'Jifunze pamoja na wengine wanaopitia vituo sawa na vyako katika nafasi yenye mipaka ya heshima na chaguo za faragha. Pata msaada, ushauri, na uhakika kutoka kwa jamii inayokuelewa.',
    enBody:
      'Learn alongside others going through similar experiences in a respectful space with clear boundaries and privacy choices. Get support, advice, and reassurance from a community that understands you.',
  },
  {
    icon: ShieldCheckIcon,
    background: brand.twilight,
    circleAlign: 'right' as const,
    buttonColor: brand.deep,
    buttonIconColor: light,
    foreground: light,
    iconColor: light,
    statusBar: 'light' as const,
    swTitle: 'Wewe unaamua kuhusu afya yako',
    enTitle: 'You are in control of your health',
    swBody:
      'Chagua huduma na chaguo zinazokufaa bora. Msaidizi wetu na arifa za kina ni hiari - una uhuru wa kubadilisha mipangilio yako wakati wowote. Faragha yako ni muhimu sana kwetu.',
    enBody:
      'Choose the care and options that work best for you. Our assistant and detailed notifications are optional - you have the freedom to change your settings anytime. Your privacy is incredibly important to us.',
  },
] as const;

// ─── Slide ───────────────────────────────────────────────────────────────────

function OnboardingSlide({
  item,
  slideIndex,
  width,
  height,
  scrollX,
  isActive,
  t,
}: {
  item: (typeof slides)[number];
  slideIndex: number;
  width: number;
  height: number;
  scrollX: ReturnType<typeof useSharedValue<number>>;
  isActive: boolean;
  t: (sw: string, en: string) => string;
}) {
  const circleSize = Math.min(width * 0.76, height * 0.44, 340);
  const artworkHeight = height * 0.56;
  const iconSize = circleSize * 0.44;

  const s0 = (slideIndex - 1) * width;
  const s1 = slideIndex * width;
  const s2 = (slideIndex + 1) * width;

  // ── Circle: scroll-driven parallax (continuous, feels physical)
  const circleParallax = useDerivedValue(() =>
    interpolate(scrollX.value, [s0, s1, s2], [width * 0.35, 0, -width * 0.35], Extrapolation.CLAMP)
  );
  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: circleParallax.value }],
  }));

  // ── Icon: discrete entry/exit via withTiming
  const iconOpacity = useSharedValue(isActive ? 1 : 0);
  const iconScale = useSharedValue(isActive ? 1 : 0.55);
  const iconRotate = useSharedValue(isActive ? 0 : -15);

  // ── Title: slides up on entry, slides down on exit
  const titleOpacity = useSharedValue(isActive ? 1 : 0);
  const titleY = useSharedValue(isActive ? 0 : 40);

  // ── Body: slightly delayed after title
  const bodyOpacity = useSharedValue(isActive ? 1 : 0);
  const bodyY = useSharedValue(isActive ? 0 : 56);

  useEffect(() => {
    const enter = isActive;
    const dur = enter ? 420 : 260;
    const ease = Easing.out(Easing.cubic);

    iconOpacity.value = withTiming(enter ? 1 : 0, { duration: dur, easing: ease });
    iconScale.value = withTiming(enter ? 1 : 0.55, { duration: dur, easing: ease });
    iconRotate.value = withTiming(enter ? 0 : 15, { duration: dur, easing: ease });

    titleOpacity.value = withDelay(enter ? 60 : 0, withTiming(enter ? 1 : 0, { duration: dur, easing: ease }));
    titleY.value = withDelay(enter ? 60 : 0, withTiming(enter ? 0 : -32, { duration: dur, easing: ease }));

    bodyOpacity.value = withDelay(enter ? 130 : 0, withTiming(enter ? 1 : 0, { duration: dur, easing: ease }));
    bodyY.value = withDelay(enter ? 130 : 0, withTiming(enter ? 0 : -32, { duration: dur, easing: ease }));
  }, [isActive]);

  const iconStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ scale: iconScale.value }, { rotate: `${iconRotate.value}deg` }],
  }));
  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));
  const bodyStyle = useAnimatedStyle(() => ({
    opacity: bodyOpacity.value,
    transform: [{ translateY: bodyY.value }],
  }));

  const circleShift = circleSize * 0.32;
  const circleLeft =
    item.circleAlign === 'left'
      ? width / 2 - circleSize / 2 - circleShift
      : width / 2 - circleSize / 2 + circleShift;

  return (
    <View style={{ width, flex: 1, backgroundColor: item.background }}>
      {/* Artwork area */}
      <View style={{ height: artworkHeight }}>
        {/* Circle — parallax layer */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: -circleSize * 0.12,
              left: circleLeft,
              width: circleSize,
              height: circleSize,
              borderRadius: circleSize / 2,
              backgroundColor: 'rgba(0,0,0,0.10)',
              overflow: 'hidden',
            },
            circleStyle,
          ]}
        />
        {/* Icon — scale + rotate layer, centred over artwork */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { alignItems: 'center', justifyContent: 'center' },
            iconStyle,
          ]}
        >
          <HugeiconsIcon
            icon={item.icon}
            size={iconSize}
            color={item.iconColor}
            strokeWidth={1.5}
          />
        </Animated.View>
      </View>

      {/* Copy — title and body animate independently */}
      <View style={styles.copy}>
        <Animated.View style={titleStyle}>
          <Txt kind="headline" color={item.foreground}>
            {t(item.swTitle, item.enTitle)}
          </Txt>
        </Animated.View>
        <Animated.View style={bodyStyle}>
          <Txt kind="bodyLarge" color={item.foreground}>
            {t(item.swBody, item.enBody)}
          </Txt>
        </Animated.View>
      </View>
    </View>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function OnboardingScreen() {
  const { entry, completeIntro, t, ready } = useApp();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const carousel = useRef<Animated.ScrollView>(null) as any;
  const [index, setIndex] = useState(0);
  const scrollX = useSharedValue(0);

  const handleMomentumEnd = useCallback(
    (x: number) => {
      const next = Math.round(x / width);
      setIndex(Math.max(0, Math.min(slides.length - 1, next)));
    },
    [width],
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
    onMomentumEnd: (event) => {
      runOnJS(handleMomentumEnd)(event.contentOffset.x);
    },
  });

  if (!ready) return null;
  if (!entry.languageChosen) return <Redirect href="/language" />;
  if (process.env.EXPO_PUBLIC_DATA_MODE === 'live') return <Screen>{null}</Screen>;

  const slide = slides[index];
  const finish = () => {
    completeIntro();
    router.replace('/consent');
  };
  const goTo = (target: number) => {
    setIndex(target);
    carousel.current?.scrollTo({ x: target * width, animated: true });
  };
  const back = () => (index === 0 ? router.replace('/language') : goTo(index - 1));
  const next = () => (index === slides.length - 1 ? finish() : goTo(index + 1));

  const skipTop = insets.top + 14;
  const controlsBottom = insets.bottom + 28;

  return (
    <View style={styles.screen}>
      <StatusBar style={slide.statusBar} />

      <Animated.ScrollView
        ref={carousel}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        style={styles.carousel}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {slides.map((item, slideIndex) => (
          <OnboardingSlide
            key={item.enTitle}
            item={item}
            slideIndex={slideIndex}
            width={width}
            height={height}
            scrollX={scrollX}
            isActive={slideIndex === index}
            t={t}
          />
        ))}
      </Animated.ScrollView>

      {/* Skip — top right */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          index === slides.length - 1 ? t('Maliza', 'Done') : t('Ruka utangulizi', 'Skip introduction')
        }
        onPress={finish}
        style={({ pressed }) => [
          styles.skipButton,
          { top: skipTop, backgroundColor: 'rgba(0,0,0,0.12)', opacity: pressed ? 0.65 : 1 },
        ]}
      >
        <Txt kind="small" color={slide.foreground}>
          {index === slides.length - 1 ? t('Maliza', 'Done') : t('Ruka', 'Skip')}
        </Txt>
      </Pressable>

      {/* Dots + arrows — bottom */}
      <View style={[styles.footer, { bottom: controlsBottom }]}>
        <View style={styles.dots} accessibilityLabel={`${index + 1} / ${slides.length}`}>
          {slides.map((item, dotIndex) => (
            <View
              key={item.enTitle}
              style={[
                styles.dot,
                {
                  width: dotIndex === index ? 26 : 8,
                  backgroundColor: slide.foreground,
                  opacity: dotIndex === index ? 1 : 0.4,
                },
              ]}
            />
          ))}
        </View>
        <View style={styles.controls}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              index === 0 ? t('Rudi kwenye lugha', 'Back to language') : t('Hatua iliyopita', 'Previous slide')
            }
            onPress={back}
            style={({ pressed }) => [
              styles.arrowButton,
              { backgroundColor: slide.buttonColor, opacity: pressed ? 0.75 : 1 },
            ]}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={22} color={slide.buttonIconColor} strokeWidth={2} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              index === slides.length - 1
                ? t('Endelea kwenye faragha', 'Continue to privacy')
                : t('Hatua inayofuata', 'Next slide')
            }
            onPress={next}
            style={({ pressed }) => [
              styles.arrowButton,
              { backgroundColor: slide.buttonColor, opacity: pressed ? 0.75 : 1 },
            ]}
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={22} color={slide.buttonIconColor} strokeWidth={2} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  carousel: { flex: 1 },
  copy: {
    flex: 1,
    paddingHorizontal: 28,
    paddingBottom: 200,
    gap: 18,
    justifyContent: 'flex-end',
  },
  skipButton: {
    position: 'absolute',
    right: 28,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.xl,
  },
  footer: {
    position: 'absolute',
    left: 28,
    right: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dots: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { height: 8, borderRadius: radii.xs },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  arrowButton: {
    width: 54,
    height: 54,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
