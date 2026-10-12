import type { HeroIcon } from '@/components/patterns/AuthHero';
import { AuthHero } from '@/components/patterns/AuthHero';
import { Button, Txt } from '@/components/ui/kit';
import { DEMO_CODE, demoOtpStatus, resendSeconds } from '@/mocks/demo-auth';
import { useApp } from '@/providers/AppProvider';
import { brand, material, radii } from '@/theme/tokens';
import {
   Baby01Icon,
   FavouriteIcon,
   FlowerIcon,
   HeartCheckIcon,
   Leaf01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Redirect, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
   KeyboardAvoidingView,
   Platform,
   Pressable,
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
   { key: 'leaf',      icon: Leaf01Icon,   top: 0.12, left: 0.08, size: 30, rotate: '-12deg', delay: 80  },
   { key: 'flower',    icon: FlowerIcon,   top: 0.10, left: 0.60, size: 34, rotate: '8deg',   delay: 150 },
   { key: 'baby',      icon: Baby01Icon,   top: 0.32, left: 0.72, size: 42, rotate: '12deg',  delay: 220 },
   { key: 'favourite', icon: FavouriteIcon, top: 0.44, left: 0.06, size: 28, rotate: '-6deg', delay: 290 },
   { key: 'heart',     icon: HeartCheckIcon, top: 0.20, left: 0.30, size: 32, rotate: '0deg', delay: 360 },
];

export default function OtpScreen() {
   const { entry, state, update, t, offline, ready } = useApp();
   const [code, setCode] = useState('');
   const [now, setNow] = useState(0);
   const [error, setError] = useState('');
   const insets = useSafeAreaInsets();

   useEffect(() => {
      const id = setInterval(() => setNow(Date.now()), 1000);
      return () => clearInterval(id);
   }, []);

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
   if (!state.sentAt) return <Redirect href='/login' />;

   const verify = () => {
      const status = demoOtpStatus(code, state.sentAt, Date.now(), offline);
      if (status !== 'valid') {
         setError(
            status === 'offline'
               ? t(
                    'Uko nje ya mtandao. Jaribu tena ukirudi.',
                    'You are offline. Retry after reconnecting.',
                 )
               : status === 'expired'
                 ? t(
                      'Msimbo umeisha. Omba mpya.',
                      'Code expired. Request a new one.',
                   )
                 : t(
                      'Msimbo si sahihi. Jaribu tena.',
                      'Incorrect code. Try again.',
                   ),
         );
         return;
      }
      update({ signedIn: true, welcomeSeen: false, sentAt: 0 });
      router.replace('/welcome');
   };

   const remaining = now === 0 ? 30 : resendSeconds(state.sentAt, now);
   const phone = state.phone
      ? `+${state.selectedCountry.phone_code} ${state.phone}`
      : t('namba yako', 'your number');

   return (
      <View style={styles.screen}>
         <StatusBar style='light' />

         {/* ── Hero ──────────────────────────────────────────────────── */}
         <AuthHero
            bgColor={brand.amethyst}
            circleColor={brand.twilight}
            title={t('Karibu nyumbani,\nmama', 'Welcome home,\nmama')}
            subtitle={t(
               'Hatua moja tu kukamilisha uthibitisho wako.',
               'Just one step to complete your verification.',
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
                     <Txt kind='title'>
                        {t('Weka msimbo wako', 'Enter your code')}
                     </Txt>
                     <Txt kind='body' color={material.light.onSurfaceVariant}>
                        {t(
                           `Tumekutumia msimbo kwa ${phone}. Kwa mfano huu msimbo ni `,
                           `We sent a code to ${phone}. For this demo the code is `,
                        )}
                        <Text
                           style={{
                              fontFamily: 'Poppins-Bold',
                              color: brand.twilight,
                           }}
                        >
                           {DEMO_CODE}
                        </Text>
                        {t(' — hakuna SMS inayotumwa.', ' — no SMS is sent.')}
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

                  {/* OTP input */}
                  <View style={styles.fieldGroup}>
                     <Text
                        style={[
                           styles.label,
                           { color: material.light.onSurface },
                        ]}
                     >
                        {t('Msimbo wa tarakimu 6', '6-digit code')}
                     </Text>
                     <OtpInput
                        value={code}
                        onChange={(value) => {
                           setCode(value);
                           if (error) setError('');
                        }}
                     />
                  </View>

                  <Button
                     label={t('Thibitisha', 'Verify')}
                     onPress={verify}
                  />

                  {/* Resend + change number */}
                  <View style={styles.actions}>
                     <Pressable
                        disabled={remaining > 0}
                        onPress={() => {
                           const sentAt = Date.now();
                           update({ sentAt });
                           setNow(sentAt);
                           setCode('');
                           setError('');
                        }}
                        style={({ pressed }) => ({
                           opacity: pressed ? 0.6 : 1,
                        })}
                     >
                        <Text
                           style={[
                              styles.actionText,
                              {
                                 color:
                                    remaining > 0
                                       ? material.light.onSurfaceVariant
                                       : brand.amethyst,
                              },
                           ]}
                        >
                           {remaining > 0
                              ? `${t('Tuma tena baada ya', 'Resend in')} ${remaining}s`
                              : t('Tuma msimbo mpya', 'Resend code')}
                        </Text>
                     </Pressable>

                     <Text style={{ color: material.light.outlineVariant }}>
                        ·
                     </Text>

                     <Pressable
                        onPress={() => {
                           update({ sentAt: 0 });
                           setCode('');
                           setError('');
                           router.replace('/login');
                        }}
                        style={({ pressed }) => ({
                           opacity: pressed ? 0.6 : 1,
                        })}
                     >
                        <Text
                           style={[
                              styles.actionText,
                              { color: brand.amethyst },
                           ]}
                        >
                           {t('Badilisha namba', 'Change number')}
                        </Text>
                     </Pressable>
                  </View>

                  <View style={{ flex: 1 }} />

                  <Text
                     style={[
                        styles.disclaimer,
                        { color: material.light.onSurfaceVariant },
                     ]}
                  >
                     {t(
                        'Msimbo wako ni wa siri. Usimwambie mtu yeyote.',
                        'Your code is private. Never share it with anyone.',
                     )}
                  </Text>
               </Animated.View>
            </ScrollView>
         </KeyboardAvoidingView>
      </View>
   );
}

// ── Segmented OTP boxes ──────────────────────────────────────────────────────
function OtpInput({
   value,
   onChange,
}: {
   value: string;
   onChange: (v: string) => void;
}) {
   const [focused, setFocused] = useState(false);

   return (
      <View style={styles.otpRow}>
         {Array.from({ length: 6 }).map((_, i) => {
            const char = value[i] ?? '';
            const isActive = focused && i === Math.min(value.length, 5);
            return (
               <View
                  key={i}
                  style={[
                     styles.otpBox,
                     {
                        borderColor: isActive
                           ? brand.amethyst
                           : char
                             ? brand.twilight
                             : material.light.outlineVariant,
                        backgroundColor: char
                           ? material.light.surfaceContainer
                           : material.light.surfaceContainerLow,
                        borderWidth: isActive ? 2 : 1,
                     },
                  ]}
               >
                  <Text
                     style={[
                        styles.otpChar,
                        { color: material.light.onSurface },
                     ]}
                  >
                     {char}
                  </Text>
               </View>
            );
         })}
         {/* Invisible full-width TextInput overlaid — handles keyboard + paste */}
         <TextInput
            style={styles.otpHidden}
            value={value}
            onChangeText={(v) => onChange(v.replace(/\D/g, '').slice(0, 6))}
            keyboardType='number-pad'
            textContentType='oneTimeCode'
            autoComplete='sms-otp'
            maxLength={6}
            caretHidden
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
         />
      </View>
   );
}

const styles = StyleSheet.create({
   screen: { flex: 1, backgroundColor: brand.amethyst },

   card: {
      flex: 1,
      backgroundColor: material.light.background,
      borderTopLeftRadius: radii['2xl'],
      borderTopRightRadius: radii['2xl'],
      marginTop: 0,
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

   errorBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      padding: 12,
      borderRadius: radii.md,
      backgroundColor: material.light.errorContainer,
   },
   errorText: { flex: 1, fontSize: 14, fontFamily: 'Poppins-Regular' },

   fieldGroup: { gap: 10 },
   label: { fontSize: 14, fontFamily: 'Poppins-Medium' },

   otpRow: { flexDirection: 'row', gap: 10 },
   otpBox: {
      flex: 1,
      height: 56,
      borderRadius: radii.md,
      alignItems: 'center',
      justifyContent: 'center',
   },
   otpChar: { fontSize: 22, fontFamily: 'Poppins-Bold' },
   otpHidden: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0,
   },

   actions: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
   },
   actionText: { fontSize: 14, fontFamily: 'Poppins-Medium' },

   disclaimer: {
      fontSize: 12,
      textAlign: 'center',
      lineHeight: 18,
      fontFamily: 'Poppins-Regular',
   },
});
