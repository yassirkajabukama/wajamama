import { CheckInNoteSheet } from '@/components/bottomsheets/CheckInNoteSheet';
import { VitalsSheet } from '@/components/bottomsheets/VitalsSheet';
import {
   Access,
   Icon,
   Screen,
   Txt,
   go,
} from '@/components/ui/kit';
import { useApp } from '@/providers/AppProvider';
import { brand, material, radii, fontFamilies } from '@/theme/tokens';
import { useThemeColors } from '@/theme/use-theme-colors';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import Alert02Icon from '@hugeicons/core-free-icons/Alert02Icon';
import BrainIcon from '@hugeicons/core-free-icons/BrainIcon';
import Cancel01Icon from '@hugeicons/core-free-icons/Cancel01Icon';
import ConfusedIcon from '@hugeicons/core-free-icons/ConfusedIcon';
import HappyIcon from '@hugeicons/core-free-icons/HappyIcon';
import HeartHandshakeIcon from '@hugeicons/core-free-icons/HeartHandshakeIcon';
import Leaf01Icon from '@hugeicons/core-free-icons/Leaf01Icon';
import NoteEditIcon from '@hugeicons/core-free-icons/NoteEditIcon';
import Sad01Icon from '@hugeicons/core-free-icons/Sad01Icon';
import SleepingIcon from '@hugeicons/core-free-icons/SleepingIcon';
import ArrowRight01Icon from '@hugeicons/core-free-icons/ArrowRight01Icon';
import StethoscopeIcon from '@hugeicons/core-free-icons/StethoscopeIcon';
import Sun03Icon from '@hugeicons/core-free-icons/Sun03Icon';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react-native';
import { router } from 'expo-router';
import { useRef, useState } from 'react';

import {
   ActivityIndicator,
   Pressable,
   StyleSheet,
   Text,
   View,
} from 'react-native';

// ── Feelings data ─────────────────────────────────────────────────────────────

const feelings = [
   { id: 'happy',      sw: 'Nina furaha',    en: 'Happy',       descSw: 'Ninahisi furaha moyoni.',         descEn: 'Feeling joy in little moments.', icon: HappyIcon,        bg: brand.sunset,   fg: brand.deep },
   { id: 'calm',       sw: 'Nimetulia',      en: 'Calm',        descSw: 'Ninahisi amani na utulivu.',      descEn: 'Feeling peaceful and at ease.',   icon: Leaf01Icon,       bg: brand.amethyst, fg: material.light.onPrimary },
   { id: 'hopeful',    sw: 'Nina matumaini', en: 'Hopeful',     descSw: 'Nina matumaini kwa yajayo.',      descEn: 'Looking ahead with hope.',        icon: Sun03Icon,        bg: brand.orange,   fg: brand.deep },
   { id: 'tired',      sw: 'Nimechoka',      en: 'Tired',       descSw: 'Nina nguvu kidogo; nahitaji kupumzika.', descEn: 'Low on energy, needing rest.', icon: SleepingIcon,   bg: brand.twilight, fg: material.light.onPrimary },
   { id: 'concerned',  sw: 'Nina wasiwasi',  en: 'Worried',     descSw: 'Kuna jambo linanipa wasiwasi.',   descEn: 'Something is on my mind.',        icon: HeartHandshakeIcon, bg: brand.amethyst, fg: material.light.onPrimary },
   { id: 'overwhelmed',sw: 'Nimelemewa',     en: 'Overwhelmed', descSw: 'Mambo mengi yamenizidia leo.',    descEn: 'A lot to handle today.',          icon: BrainIcon,        bg: brand.sunset,   fg: brand.deep },
   { id: 'sad',        sw: 'Nina huzuni',    en: 'Sad',         descSw: 'Ninahisi huzuni moyoni.',         descEn: 'Feeling low or tearful.',         icon: Sad01Icon,        bg: brand.twilight, fg: material.light.onPrimary },
   { id: 'uncertain',  sw: 'Sina uhakika',   en: 'Unsure',      descSw: 'Sina uhakika ninavyojisikia.',    descEn: 'Still finding words for how I feel.', icon: ConfusedIcon,  bg: brand.orange,   fg: brand.deep },
];

// ── Vitals trigger card ───────────────────────────────────────────────────────

function VitalsTriggerCard({
   onPress,
   t,
}: {
   onPress: () => void;
   t: (sw: string, en: string) => string;
}) {
   return (
      <Pressable
         accessibilityRole='button'
         accessibilityLabel={t('Pima hali yako ya kimwili', 'Measure your vitals')}
         onPress={onPress}
         style={({ pressed }) => [styles.vitalsCard, { opacity: pressed ? 0.85 : 1 }]}
      >
         {/* Decorative blobs */}
         <View style={styles.vitalsBlob1} />
         <View style={styles.vitalsBlob2} />

         {/* Icon badge */}
         <View style={styles.vitalsIconWrap}>
            <HugeiconsIcon icon={StethoscopeIcon} size={28} color={brand.deep} strokeWidth={1.5} />
         </View>

         {/* Text */}
         <View style={styles.vitalsBody}>
            <Text style={[styles.vitalsTitle, { color: brand.deep, fontFamily: fontFamilies.semibold }]}>
               {t('Pima hali yako ya kimwili', 'Measure your vitals')}
            </Text>
            <Text style={[styles.vitalsSub, { color: `${brand.deep}99`, fontFamily: fontFamilies.regular }]}>
               {t('BP, mapigo, uzito · dakika 1', 'BP, heart rate, weight · 1 min')}
            </Text>
         </View>

         {/* Caret */}
         <View style={styles.vitalsCaret}>
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} color={brand.deep} strokeWidth={2} />
         </View>
      </Pressable>
   );
}

// ── Header icon button ────────────────────────────────────────────────────────

function HdrBtn({
   icon,
   label,
   onPress,
   color,
}: {
   icon: IconSvgElement;
   label: string;
   onPress: () => void;
   color: string;
}) {
   return (
      <Pressable
         accessibilityRole='button'
         accessibilityLabel={label}
         onPress={onPress}
         hitSlop={8}
         style={({ pressed }) => [styles.hdrBtn, { opacity: pressed ? 0.5 : 1 }]}
      >
         <HugeiconsIcon icon={icon} size={24} color={color} strokeWidth={1.5} />
      </Pressable>
   );
}

// ── Check-in screen ───────────────────────────────────────────────────────────

export function CheckIn() {
   const { state, update, t } = useApp();
   const colors = useThemeColors();
   const [mood, setMood] = useState(state.checkin?.mood ?? '');
   const [note, setNote] = useState(state.checkin?.note ?? '');
   const [draftNote, setDraftNote] = useState(note);
   const [saving, setSaving] = useState(false);
   const [saved, setSaved] = useState(false);

   const noteSheet = useRef<BottomSheetModal>(null);
   const vitalsSheet = useRef<BottomSheetModal>(null);

   function selectMood(id: string) {
      setMood(id);
      update({ checkin: { mood: id, note } });
   }

   function commitNote(text: string) {
      const trimmed = text.trim();
      setNote(trimmed);
      update({ checkin: { mood, note: trimmed } });
      noteSheet.current?.dismiss();
   }

   function deleteCheckIn() {
      update({ checkin: undefined });
      setMood('');
      setNote('');
      setDraftNote('');
      setSaved(false);
   }

   function logCheckIn() {
      setSaving(true);
      // mock API call — replace with real check-in endpoint
      setTimeout(() => {
         setSaving(false);
         setSaved(true);
         setTimeout(() => router.back(), 900);
      }, 1600);
   }

   return (
      <Access>
         <Screen
            back
            headerRight={
               <View style={styles.hdrRight}>
                  {/* Note */}
                  <HdrBtn
                     icon={NoteEditIcon}
                     label={note ? t('Badilisha dokezo', 'Edit note') : t('Ongeza dokezo', 'Add a note')}
                     onPress={() => { setDraftNote(note); noteSheet.current?.present(); }}
                     color={note ? colors.primary : colors.onSurfaceVariant}
                  />
                  {/* Delete — only when a check-in exists */}
                  {state.checkin && (
                     <HdrBtn
                        icon={Cancel01Icon}
                        label={t('Futa hali yangu', 'Delete check-in')}
                        onPress={deleteCheckIn}
                        color={colors.error}
                     />
                  )}
                  {/* Urgent help */}
                  <HdrBtn
                     icon={Alert02Icon}
                     label={t('Nahitaji msaada wa moja kwa moja', 'I need direct help')}
                     onPress={() => go('/urgent-help')}
                     color={colors.onSurfaceVariant}
                  />
               </View>
            }
            title={t('Unajisikiaje?', 'How are you feeling?')}
            subtitle={t(
               'Chukua muda kwa ajili yako. Chagua hisia inayokuelezea leo.',
               'Take a moment for yourself. Choose the feeling that fits today.',
            )}
         >
            {/* Vitals trigger */}
            <VitalsTriggerCard t={t} onPress={() => vitalsSheet.current?.present()} />

            {/* Mood grid */}
            <View
               style={styles.grid}
               accessibilityRole='radiogroup'
               accessibilityLabel={t('Hisia zako leo', 'Your feelings today')}
            >
               {feelings.map((feeling) => {
                  const selected = mood === feeling.id;
                  return (
                     <Pressable
                        key={feeling.id}
                        accessibilityRole='radio'
                        accessibilityLabel={`${t(feeling.sw, feeling.en)}. ${t(feeling.descSw, feeling.descEn)}`}
                        accessibilityState={{ checked: selected }}
                        onPress={() => selectMood(feeling.id)}
                        style={({ pressed }) => [
                           styles.feeling,
                           { backgroundColor: feeling.bg, opacity: pressed ? 0.78 : 1 },
                        ]}
                     >
                        <View pointerEvents='none' accessible={false} style={styles.watermark}>
                           <HugeiconsIcon icon={feeling.icon} size={94} color={feeling.fg} strokeWidth={1.5} />
                        </View>
                        <View style={styles.selection}>
                           {selected && (
                              <Icon name='checkmark-circle' size={36} color={feeling.fg} />
                           )}
                        </View>
                        <View style={styles.feelingCopy}>
                           <Txt kind='heading' color={feeling.fg}>{t(feeling.sw, feeling.en)}</Txt>
                           <Txt kind='body' color={feeling.fg}>{t(feeling.descSw, feeling.descEn)}</Txt>
                        </View>
                     </Pressable>
                  );
               })}
            </View>

            {/* Log check-in */}
            <Pressable
               accessibilityRole='button'
               accessibilityLabel={
                  saved ? t('Imehifadhiwa', 'Saved')
                     : saving ? t('Inasajili...', 'Logging...')
                     : t('Hifadhi hali yangu', 'Log my check-in')
               }
               accessibilityState={{ disabled: !mood || saving || saved }}
               disabled={!mood || saving || saved}
               onPress={logCheckIn}
               style={({ pressed }) => [
                  styles.logBtn,
                  {
                     backgroundColor: saved ? colors.primaryContainer : colors.primary,
                     opacity: (!mood || saving || saved)
                        ? (mood ? 0.85 : 0.45)
                        : pressed ? 0.82 : 1,
                  },
               ]}
            >
               {saving ? (
                  <ActivityIndicator size='small' color='#fff' />
               ) : (
                  <Text style={[styles.logBtnLabel, { color: saved ? colors.primary : '#fff', fontFamily: fontFamilies.semibold }]}>
                     {saved
                        ? t('Imehifadhiwa ✓', 'Check-in logged ✓')
                        : t('Hifadhi hali yangu', 'Log my check-in')}
                  </Text>
               )}
            </Pressable>
         </Screen>

         <CheckInNoteSheet
            ref={noteSheet}
            value={draftNote}
            onChange={setDraftNote}
            onDone={() => commitNote(draftNote)}
            onCancel={() => noteSheet.current?.dismiss()}
         />
         <VitalsSheet ref={vitalsSheet} />
      </Access>
   );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
   // header
   hdrRight: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   hdrBtn: {
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radii.pill,
   },

   // vitals trigger card
   vitalsCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      padding: 18,
      borderRadius: radii['3xl'],
      backgroundColor: brand.sunset,
      overflow: 'hidden',
      minHeight: 88,
   },
   vitalsBlob1: {
      position: 'absolute',
      width: 130,
      height: 130,
      borderRadius: radii.pill,
      backgroundColor: 'rgba(255,255,255,0.18)',
      top: -45,
      right: -20,
   },
   vitalsBlob2: {
      position: 'absolute',
      width: 70,
      height: 70,
      borderRadius: radii.pill,
      backgroundColor: 'rgba(255,255,255,0.12)',
      bottom: -18,
      right: 55,
   },
   vitalsIconWrap: {
      width: 52,
      height: 52,
      borderRadius: radii.xl,
      backgroundColor: 'rgba(255,255,255,0.30)',
      alignItems: 'center',
      justifyContent: 'center',
   },
   vitalsBody: { flex: 1, gap: 3 },
   vitalsTitle: { fontSize: 15, lineHeight: 20 },
   vitalsSub: { fontSize: 13, lineHeight: 18 },
   vitalsCaret: {
      width: 30,
      height: 30,
      borderRadius: radii.pill,
      backgroundColor: 'rgba(255,255,255,0.25)',
      alignItems: 'center',
      justifyContent: 'center',
   },

   // mood grid
   grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
   feeling: {
      width: '46%',
      flexGrow: 1,
      flexShrink: 0,
      minHeight: 180,
      borderRadius: radii['3xl'],
      padding: 14,
      gap: 12,
      justifyContent: 'space-between',
   },
   watermark: { position: 'absolute', top: 10, right: 10, opacity: 0.19 },
   selection: { minHeight: 48 },
   feelingCopy: { width: '100%', flexShrink: 0, gap: 4 },

   // log button
   logBtn: {
      height: 56,
      borderRadius: radii.pill,
      alignItems: 'center',
      justifyContent: 'center',
   },
   logBtnLabel: { fontSize: 16 },
});
