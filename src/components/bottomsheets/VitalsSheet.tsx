import { BottomSheetWrapper, SHEET_CONTENT_PADDING } from './wrapper';
import { Button, Field, Txt } from '@/components/ui/kit';
import { useApp } from '@/providers/AppProvider';
import { fontFamilies, radii } from '@/theme/tokens';
import { useThemeColors } from '@/theme/use-theme-colors';
import Activity01Icon from '@hugeicons/core-free-icons/Activity01Icon';
import BloodPressureIcon from '@hugeicons/core-free-icons/BloodPressureIcon';
import HeartPulseIcon from '@hugeicons/core-free-icons/HeartPulseIcon';
import ScaleIcon from '@hugeicons/core-free-icons/ScaleIcon';
import TemperatureIcon from '@hugeicons/core-free-icons/TemperatureIcon';
import { HugeiconsIcon } from '@hugeicons/react-native';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { forwardRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type VitalKey = 'sys' | 'dia' | 'hr' | 'weight' | 'temp';
type Vitals = Record<VitalKey, string>;

export const VitalsSheet = forwardRef<BottomSheetModal>(function VitalsSheet(_props, ref) {
   const { t } = useApp();
   const colors = useThemeColors();
   const insets = useSafeAreaInsets();
   const [v, setV] = useState<Vitals>({ sys: '', dia: '', hr: '', weight: '', temp: '' });
   const [loading, setLoading] = useState(false);
   const [done, setDone] = useState(false);

   const set = (key: VitalKey) => (val: string) => setV((prev) => ({ ...prev, [key]: val }));
   const hasAny = Object.values(v).some((x) => x.trim() !== '');

   function submit() {
      setLoading(true);
      // mock API call — replace with real vitals endpoint
      setTimeout(() => {
         setLoading(false);
         setDone(true);
         setTimeout(() => (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss(), 1000);
      }, 1500);
   }

   return (
      <BottomSheetWrapper ref={ref}>
         <BottomSheetScrollView
            keyboardShouldPersistTaps='handled'
            contentContainerStyle={[
               styles.content,
               { paddingBottom: Math.max(insets.bottom, SHEET_CONTENT_PADDING) },
            ]}
         >
            <Txt kind='heading'>
               {t('Pima hali yako ya kimwili', 'Record your vitals')}
            </Txt>
            <Txt color={colors.muted}>
               {t(
                  'Rekodi kwa dakika moja. Thamani hizi zinasaidia timu yako ya huduma.',
                  'Takes one minute. These values help your care team.',
               )}
            </Txt>

            {/* Blood pressure */}
            <View style={styles.row}>
               <View style={styles.col}>
                  <Field
                     label={t('Shinikizo juu (mmHg)', 'Systolic BP')}
                     placeholder='120'
                     value={v.sys}
                     onChangeText={set('sys')}
                     keyboardType='number-pad'
                     maxLength={3}
                     editable={!done}
                     variant='outlined'
                     suffixIcon={BloodPressureIcon}
                  />
               </View>
               <View style={styles.col}>
                  <Field
                     label={t('Shinikizo chini (mmHg)', 'Diastolic BP')}
                     placeholder='80'
                     value={v.dia}
                     onChangeText={set('dia')}
                     keyboardType='number-pad'
                     maxLength={3}
                     editable={!done}
                     variant='outlined'
                     suffixIcon={BloodPressureIcon}
                  />
               </View>
            </View>

            {/* Heart rate + weight */}
            <View style={styles.row}>
               <View style={styles.col}>
                  <Field
                     label={t('Mapigo ya moyo (bpm)', 'Heart rate (bpm)')}
                     placeholder='72'
                     value={v.hr}
                     onChangeText={set('hr')}
                     keyboardType='number-pad'
                     maxLength={3}
                     editable={!done}
                     variant='outlined'
                     suffixIcon={HeartPulseIcon}
                  />
               </View>
               <View style={styles.col}>
                  <Field
                     label={t('Uzito (kg)', 'Weight (kg)')}
                     placeholder='65'
                     value={v.weight}
                     onChangeText={set('weight')}
                     keyboardType='decimal-pad'
                     maxLength={5}
                     editable={!done}
                     variant='outlined'
                     suffixIcon={ScaleIcon}
                  />
               </View>
            </View>

            {/* Temperature — half width */}
            <View style={styles.row}>
               <View style={styles.col}>
                  <Field
                     label={t('Joto la mwili (°C)', 'Body temperature (°C)')}
                     placeholder='37.0'
                     value={v.temp}
                     onChangeText={set('temp')}
                     keyboardType='decimal-pad'
                     maxLength={4}
                     editable={!done}
                     variant='outlined'
                     suffixIcon={TemperatureIcon}
                  />
               </View>
               {/* spacer keeps temperature field at half width */}
               <View style={styles.col} />
            </View>

            {/* Submit */}
            <Pressable
               accessibilityRole='button'
               accessibilityLabel={done ? t('Imerekodiwa', 'Recorded') : t('Rekodi hali', 'Submit vitals')}
               accessibilityState={{ disabled: !hasAny || loading || done }}
               disabled={!hasAny || loading || done}
               onPress={submit}
               style={({ pressed }) => [
                  styles.submitBtn,
                  {
                     backgroundColor: done ? colors.primaryContainer : colors.primary,
                     opacity: (!hasAny || loading || done) ? (hasAny ? 0.85 : 0.45) : pressed ? 0.82 : 1,
                  },
               ]}
            >
               {loading ? (
                  <ActivityIndicator size='small' color='#fff' />
               ) : (
                  <>
                     <HugeiconsIcon
                        icon={Activity01Icon}
                        size={18}
                        color={done ? colors.primary : '#fff'}
                        strokeWidth={1.5}
                     />
                     <Text style={[styles.submitLabel, { color: done ? colors.primary : '#fff', fontFamily: fontFamilies.semibold }]}>
                        {done ? t('Imerekodiwa ✓', 'Recorded ✓') : t('Rekodi hali', 'Submit vitals')}
                     </Text>
                  </>
               )}
            </Pressable>

            <Button
               secondary
               label={t('Funga', 'Close')}
               onPress={() => (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()}
            />
         </BottomSheetScrollView>
      </BottomSheetWrapper>
   );
});

const styles = StyleSheet.create({
   content: { padding: SHEET_CONTENT_PADDING, gap: 16 },
   row: { flexDirection: 'row', gap: 12 },
   col: { flex: 1 },
   submitBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      height: 52,
      borderRadius: radii.pill,
   },
   submitLabel: { fontSize: 15 },
});
