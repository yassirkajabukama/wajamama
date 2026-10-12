import type { HeroIcon } from '@/components/patterns/AuthHero';
import { AuthHero } from '@/components/patterns/AuthHero';
import { CountrySelector } from '@/components/ui/CountrySelector';
import { Button, Txt } from '@/components/ui/kit';
import { useApp } from '@/providers/AppProvider';
import { brand, material, radii } from '@/theme/tokens';
import {
   Baby01Icon,
   FavouriteIcon,
   FlowerIcon,
   HeartCheckIcon,
   Leaf01Icon,
   SmartPhone01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Redirect, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
   KeyboardAvoidingView,
   Platform,
   ScrollView,
   StyleSheet,
   Text,
   TextInput,
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
      left: 0.1,
      size: 38,
      rotate: '-15deg',
      delay: 80,
   },
   {
      key: 'baby',
      icon: Baby01Icon,
      top: 0.28,
      left: 0.68,
      size: 46,
      rotate: '10deg',
      delay: 160,
   },
   {
      key: 'flower',
      icon: FlowerIcon,
      top: 0.48,
      left: 0.06,
      size: 32,
      rotate: '-8deg',
      delay: 220,
   },
   {
      key: 'leaf',
      icon: Leaf01Icon,
      top: 0.5,
      left: 0.76,
      size: 30,
      rotate: '20deg',
      delay: 280,
   },
   {
      key: 'favourite',
      icon: FavouriteIcon,
      top: 0.1,
      left: 0.52,
      size: 28,
      rotate: '0deg',
      delay: 340,
   },
];

export default function LoginScreen() {
   const { entry, state, update, t, offline, ready } = useApp();
   const [error, setError] = useState('');
   const [phoneFocused, setPhoneFocused] = useState(false);
   const insets = useSafeAreaInsets();

   // Card slides up on mount
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
   if (!entry.consents.some((c) => c.purpose === 'terms' && c.granted))
      return <Redirect href='/consent' />;
   if (state.signedIn) return <Redirect href='/welcome' />;
   if (state.sentAt) return <Redirect href='/otp' />;

   const send = () => {
      if (offline) {
         setError(
            t('Unganisha mtandao ili kuendelea.', 'Reconnect to continue.'),
         );
         return;
      }
      const phoneDigits = state.phone.replace(/\s/g, '');
      if (!/^\d{9,12}$/.test(phoneDigits)) {
         setError(
            t('Weka namba sahihi ya simu.', 'Enter a valid phone number.'),
         );
         return;
      }
      update({ sentAt: Date.now() });
      setError('');
      router.replace('/otp');
   };

   return (
      <View style={styles.screen}>
         <StatusBar style='light' />

         {/* ── Hero ──────────────────────────────────────────────────── */}
         <AuthHero
            bgColor={brand.twilight}
            circleColor={brand.amethyst}
            title={t(
               'Huduma ya afya yako\ninaanzia hapa',
               'Your health care\nstarts here',
            )}
            subtitle={t(
               'Kwa mama, mtoto na familia yako.',
               'For you, your baby, and your family.',
            )}
            icons={ICONS}
         />

         {/* ── Form card ─────────────────────────────────────────────── */}
         <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1, backgroundColor: 'transparent' }}
         >
            <ScrollView
               keyboardShouldPersistTaps='handled'
               contentContainerStyle={{ flexGrow: 1 }}
               showsVerticalScrollIndicator={false}
               style={{ backgroundColor: 'transparent' }}
            >
               <Animated.View
                  style={[
                     styles.card,
                     cardStyle,
                     { paddingBottom: insets.bottom + 32 },
                  ]}
               >
                  <View style={styles.cardHeader}>
                     <Txt kind='title'>{t('Karibu tena', 'Welcome back')}</Txt>
                     <Txt kind='body' color={material.light.onSurfaceVariant}>
                        {t(
                           'Weka namba yako ya simu ili tuendelee.',
                           'Enter your phone number to continue.',
                        )}
                     </Txt>
                  </View>

                  {!!error && (
                     <View style={styles.errorBanner}>
                        <HugeiconsIcon
                           icon={HeartCheckIcon}
                           size={16}
                           color={material.light.error}
                           strokeWidth={2}
                        />
                        <Text
                           style={[
                              styles.errorText,
                              { color: material.light.error },
                           ]}
                        >
                           {error}
                        </Text>
                     </View>
                  )}

                  {/* Phone input */}
                  <View style={styles.fieldGroup}>
                     <Text
                        style={[
                           styles.label,
                           { color: material.light.onSurface },
                        ]}
                     >
                        {t('Namba ya simu', 'Phone number')}
                     </Text>
                     {/* Single grouped container */}
                     <View
                        style={[
                           styles.phoneGroup,
                           {
                              borderColor: phoneFocused
                                 ? brand.twilight
                                 : material.light.outlineVariant,
                              borderWidth: phoneFocused ? 2 : 1,
                              backgroundColor:
                                 material.light.surfaceContainerLow,
                           },
                        ]}
                     >
                        <CountrySelector
                           selectedCountry={state.selectedCountry}
                           onSelect={(country) =>
                              update({ selectedCountry: country })
                           }
                           style={{
                              borderWidth: 0,
                              borderRadius: 0,
                              backgroundColor: 'transparent',
                              minHeight: 54,
                           }}
                        />
                        {/* Vertical separator */}
                        <View
                           style={[
                              styles.separator,
                              {
                                 backgroundColor: material.light.outlineVariant,
                              },
                           ]}
                        />
                        <Text
                           style={[
                              styles.dialCode,
                              { color: material.light.onSurfaceVariant },
                           ]}
                        >
                           +{state.selectedCountry.phone_code}
                        </Text>
                        <TextInput
                           style={[
                              styles.phoneInput,
                              { color: material.light.onSurface },
                           ]}
                           placeholder='712 345 678'
                           placeholderTextColor={
                              material.light.onSurfaceVariant
                           }
                           value={state.phone}
                           onChangeText={(phone) => {
                              update({ phone });
                              if (error) setError('');
                           }}
                           keyboardType='phone-pad'
                           autoComplete='tel'
                           textContentType='telephoneNumber'
                           onFocus={() => setPhoneFocused(true)}
                           onBlur={() => setPhoneFocused(false)}
                        />
                        <HugeiconsIcon
                           icon={SmartPhone01Icon}
                           size={18}
                           color={
                              phoneFocused
                                 ? brand.twilight
                                 : material.light.onSurfaceVariant
                           }
                           strokeWidth={1.5}
                        />
                     </View>
                  </View>

                  {/* CTA */}
                  <Button
                     label={t('Endelea', 'Continue')}
                     onPress={send}
                  />

                  {/* Spacer pushes disclaimer to the bottom */}
                  <View style={{ flex: 1 }} />

                  <Text
                     style={[
                        styles.disclaimer,
                        { color: material.light.onSurfaceVariant },
                     ]}
                  >
                     {t(
                        'Kwa kuendelea, unakubali Masharti ya Huduma na Sera ya Faragha ya Wajamama.',
                        "By continuing, you agree to Wajamama's Terms of Service and Privacy Policy.",
                     )}
                  </Text>
               </Animated.View>
            </ScrollView>
         </KeyboardAvoidingView>
      </View>
   );
}

const styles = StyleSheet.create({
   screen: { flex: 1, backgroundColor: brand.twilight },

   card: {
      flex: 1,
      backgroundColor: material.light.background,
      borderTopLeftRadius: radii['2xl'],
      borderTopRightRadius: radii['2xl'],
      marginTop: 0,
      paddingHorizontal: 24,
      paddingTop: 32,
      gap: 24,
      // subtle shadow so card lifts off the hero
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 8,
   },
   cardHeader: { gap: 6 },

   errorBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      padding: 12,
      borderRadius: radii.md,
      backgroundColor: material.light.errorContainer,
   },
   errorText: { flex: 1, fontSize: 14, fontFamily: 'Poppins-Regular' },

   fieldGroup: { gap: 8 },
   label: { fontSize: 14, fontFamily: 'Poppins-Medium' },
   phoneGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: radii.lg,
      minHeight: 56,
      overflow: 'hidden',
      paddingRight: 14,
      gap: 0,
   },
   separator: { width: 1, height: 28, marginHorizontal: 4 },
   dialCode: {
      fontSize: 16,
      paddingHorizontal: 6,
      fontFamily: 'Poppins-Regular',
   },
   phoneInput: {
      flex: 1,
      fontSize: 16,
      padding: 0,
      paddingLeft: 4,
      fontFamily: 'Poppins-Regular',
   },

   disclaimer: {
      fontSize: 12,
      textAlign: 'center',
      lineHeight: 18,
      fontFamily: 'Poppins-Regular',
   },
});
