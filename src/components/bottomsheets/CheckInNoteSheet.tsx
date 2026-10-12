import { BottomSheetWrapper, SHEET_CONTENT_PADDING } from './wrapper';
import { Button, Txt } from '@/components/ui/kit';
import { useApp } from '@/providers/AppProvider';
import { fontFamilies, radii } from '@/theme/tokens';
import { useThemeColors } from '@/theme/use-theme-colors';
import {
   BottomSheetModal,
   BottomSheetScrollView,
   BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import { forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
   value: string;
   onChange: (value: string) => void;
   onDone: () => void;
   onCancel: () => void;
};

export const CheckInNoteSheet = forwardRef<BottomSheetModal, Props>(
   function CheckInNoteSheet({ value, onChange, onDone, onCancel }, ref) {
      const { t } = useApp();
      const colors = useThemeColors();
      const insets = useSafeAreaInsets();
      return (
         <BottomSheetWrapper
            ref={ref}
            keyboardBehavior='interactive'
            keyboardBlurBehavior='restore'
            enableBlurKeyboardOnGesture
            android_keyboardInputMode='adjustResize'
            topInset={insets.top}
         >
            <BottomSheetScrollView
               keyboardShouldPersistTaps='handled'
               contentContainerStyle={[
                  styles.content,
                  { paddingBottom: Math.max(insets.bottom, SHEET_CONTENT_PADDING) },
               ]}
            >
               <Txt kind='heading'>
                  {t(
                     'Nafasi kwa mawazo yako',
                     'A little space for your thoughts',
                  )}
               </Txt>
               <Txt color={colors.muted}>
                  {t(
                     'Ni nini kilicho akilini mwako leo? Dokezo hili ni la hiari.',
                     'What’s on your mind today? This note is optional.',
                  )}
               </Txt>
               <BottomSheetTextInput
                  accessibilityLabel={t('Dokezo lako', 'Your note')}
                  placeholder={t(
                     'Leo ninajisikia hivi kwa sababu…',
                     'Today I’m feeling this way because…',
                  )}
                  placeholderTextColor={colors.muted}
                  value={value}
                  onChangeText={onChange}
                  multiline
                  maxLength={1000}
                  style={[
                     styles.input,
                     {
                        color: colors.onSurface,
                        backgroundColor: colors.background,
                        borderColor: colors.outline,
                     },
                  ]}
               />
               <Txt kind='small' color={colors.muted} align='right'>
                  {value.length}/1000
               </Txt>
               <Txt kind='small' color={colors.muted}>
                  {t(
                     'Gusa Tayari, kisha hifadhi hali yako kwenye ukurasa uliotangulia.',
                     'Tap Done, then save your check-in on the previous screen.',
                  )}
               </Txt>
               <Button label={t('Tayari', 'Done')} onPress={onDone} />
               <Button
                  secondary
                  label={t('Ghairi', 'Cancel')}
                  onPress={onCancel}
               />
            </BottomSheetScrollView>
         </BottomSheetWrapper>
      );
   },
);

const styles = StyleSheet.create({
   content: { padding: SHEET_CONTENT_PADDING, gap: 16 },
   input: {
      minHeight: 144,
      maxHeight: 220,
      borderWidth: 1,
      borderRadius: radii.md,
      padding: 16,
      textAlignVertical: 'top',
      fontFamily: fontFamilies.regular,
      fontSize: 16,
      lineHeight: 24,
   },
});
