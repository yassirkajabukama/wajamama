import type { HeroIcon } from '@/components/patterns/AuthHero';
import { AuthHero } from '@/components/patterns/AuthHero';
import { ActionGroup, ActionRow } from '@/components/ui/ActionGroup';
import { Button, Field, Txt } from '@/components/ui/kit';
import { useApp } from '@/providers/AppProvider';
import { brand, material, radii } from '@/theme/tokens';
import {
   Baby01Icon,
   FavouriteIcon,
   FlowerIcon,
   HeartCheckIcon,
   Leaf01Icon,
   UserIcon,
} from '@hugeicons/core-free-icons';
import { Redirect, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import {
   KeyboardAvoidingView,
   Platform,
   ScrollView,
   StyleSheet,
   View,
} from 'react-native';
import Animated, {
   Easing,
   useAnimatedStyle,
   useSharedValue,
   withDelay,
   withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ICONS: HeroIcon[] = [
   {
      key: 'heart',
      icon: HeartCheckIcon,
      top: 0.14,
      left: 0.06,
      size: 36,
      rotate: '-12deg',
      delay: 80,
   },
   {
      key: 'baby',
      icon: Baby01Icon,
      top: 0.28,
      left: 0.72,
      size: 44,
      rotate: '10deg',
      delay: 160,
   },
   {
      key: 'flower',
      icon: FlowerIcon,
      top: 0.5,
      left: 0.1,
      size: 30,
      rotate: '-8deg',
      delay: 220,
   },
   {
      key: 'leaf',
      icon: Leaf01Icon,
      top: 0.48,
      left: 0.78,
      size: 28,
      rotate: '18deg',
      delay: 280,
   },
   {
      key: 'favourite',
      icon: FavouriteIcon,
      top: 0.12,
      left: 0.55,
      size: 26,
      rotate: '0deg',
      delay: 340,
   },
];

export default function WelcomeScreen() {
   const { state, update, t, ready } = useApp();
   const insets = useSafeAreaInsets();

   const cardY = useSharedValue(60);
   const cardOpacity = useSharedValue(0);
   useEffect(() => {
      const ease = Easing.out(Easing.cubic);
      cardY.value = withDelay(
         200,
         withTiming(0, { duration: 520, easing: ease }),
      );
      cardOpacity.value = withDelay(
         200,
         withTiming(1, { duration: 520, easing: ease }),
      );
   }, []);
   const cardStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: cardY.value }],
      opacity: cardOpacity.value,
   }));

   if (!ready) return null;
   if (!state.signedIn) return <Redirect href='/login' />;

   return (
      <KeyboardAvoidingView
         style={styles.screen}
         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
         <StatusBar style='light' />

         {/* ── Hero ──────────────────────────────────────────────────── */}
         <AuthHero
            bgColor={brand.twilight}
            circleColor={brand.amethyst}
            title={t('Karibu Wajamama,\nmama', 'Welcome to\nWajamama')}
            subtitle={t(
               'Huduma kwa mama, mtoto na familia yako.',
               'Care for you, your baby, and your family.',
            )}
            icons={ICONS}
         />

         {/* ── Form card ─────────────────────────────────────────────── */}
         <ScrollView
            keyboardShouldPersistTaps='handled'
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            style={{ flex: 1, backgroundColor: 'transparent' }}
         >
            <Animated.View
               style={[
                  styles.card,
                  cardStyle,
                  { paddingBottom: insets.bottom + 32 },
               ]}
            >
               <View style={styles.cardHeader}>
                  <Txt kind='title'>
                     {state.name
                        ? t(
                             'Umefika, ' + state.name + '!',
                             "You're in, " + state.name + '!',
                          )
                        : t('Umefika!', "You're in!")}
                  </Txt>
                  <Txt kind='body' color={material.light.onSurfaceVariant}>
                     {t(
                        'Tuambie jina unalotaka tukulikie, kisha tutakupeleka mahali pako.',
                        "Tell us what to call you, then we'll take you to your space.",
                     )}
                  </Txt>
               </View>

               <Field
                  label={t(
                     'Jina unalopendelea (hiari)',
                     'Preferred name (optional)',
                  )}
                  variant='outlined'
                  suffixIcon={UserIcon}
                  value={state.name}
                  onChangeText={(name) => update({ name })}
                  maxLength={50}
               />

               <Button
                  label={t('Hebu tuanze', "Let's get started")}
                  onPress={() => {
                     update({ welcomeSeen: true });
                     router.replace('/service-selection');
                  }}
               />

               <ActionGroup title={t('MSAADA', 'HELP')}>
                  <ActionRow
                     label={t('Msaada wa haraka', 'Urgent help')}
                     detail={t(
                        'Tafuta huduma ya moja kwa moja.',
                        'Seek direct care.',
                     )}
                     icon='medkit-outline'
                     href='/urgent-help'
                  />
               </ActionGroup>
            </Animated.View>
         </ScrollView>
      </KeyboardAvoidingView>
   );
}

const styles = StyleSheet.create({
   screen: { flex: 1, backgroundColor: brand.twilight },

   card: {
      flex: 1,
      backgroundColor: material.light.background,
      borderTopLeftRadius: radii['4xl'],
      borderTopRightRadius: radii['4xl'],
      paddingHorizontal: 24,
      paddingTop: 32,
      gap: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 8,
   },

   cardHeader: { gap: 6 },
});
