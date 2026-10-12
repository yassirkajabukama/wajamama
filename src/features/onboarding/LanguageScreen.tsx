import { Button, Icon, Screen, Txt } from '@/components/ui/kit';
import type { Language } from '@/i18n';
import { useApp } from '@/providers/AppProvider';
import { brand, material, radii } from '@/theme/tokens';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const foreground = material.light.onPrimary;

export default function LanguageScreen() {
   const { language, setLanguage, t } = useApp();
   const choose = (value: Language) => {
      setLanguage(value);
      router.replace('/onboarding');
   };
   if (process.env.EXPO_PUBLIC_DATA_MODE === 'live')
      return <Screen>{null}</Screen>;
   return (
      <SafeAreaView
         edges={['top', 'bottom', 'left', 'right']}
         style={[styles.screen, { backgroundColor: brand.deep }]}
      >
         <StatusBar style='light' />
         <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.center}>
               <View style={styles.hero}>
                  <View
                     style={[
                        styles.iconCircle,
                        { backgroundColor: brand.twilight },
                     ]}
                  >
                     <Icon
                        name='language-outline'
                        size={68}
                        color={foreground}
                     />
                  </View>
               </View>
               <View style={styles.heading}>
                  <Txt kind='title' color={foreground} align='center'>
                     {t('Chagua lugha yako', 'Choose your language')}
                  </Txt>
                  <Txt color={foreground} align='center'>
                     {t(
                        'Tunaweza kuzungumza kwa Kiswahili au Kiingereza. Unaweza kubadilisha lugha baadaye kwenye wasifu.',
                        'We can speak in Kiswahili or English. You can change the language later in your profile.',
                     )}
                  </Txt>
               </View>
            </View>
            <View style={styles.bottom}>
               <Button
                  label='Endelea kwa Kiswahili'
                  onPress={() => choose('sw')}
               />
               <Button
                  label='Continue in English'
                  onPress={() => choose('en')}
               />
               <View style={styles.note}>
                  <Txt
                     kind='small'
                     color='rgba(255,255,255,0.45)'
                     align='center'
                  >
                     {t(
                        'Kiswahili ndiyo lugha ya mwanzo.',
                        'Kiswahili is the default language.',
                     )}
                  </Txt>
               </View>
            </View>
         </ScrollView>
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   screen: { flex: 1 },
   content: {
      flexGrow: 1,
      width: '100%',
      maxWidth: 760,
      alignSelf: 'center',
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 28,
   },
   center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 28 },
   heading: { gap: 16, alignItems: 'center' },
   hero: { justifyContent: 'center', alignItems: 'center' },
   iconCircle: {
      height: 144,
      width: 144,
      borderRadius: radii.pill,
      justifyContent: 'center',
      alignItems: 'center',
   },
   bottom: { marginTop: 32, gap: 14 },
   note: { alignItems: 'center', paddingTop: 4 },
});
