import {
   BottomSheetWrapper,
   SHEET_CONTENT_PADDING,
} from '@/components/bottomsheets/wrapper';
import { ActionGroup, ActionRow } from '@/components/ui/ActionGroup';
import {
   Access,
   Button,
   Card,
   Chip,
   Field,
   Icon,
   Row,
   Screen,
   Txt,
   go,
} from '@/components/ui/kit';
import { useApp } from '@/providers/AppProvider';
import { brand, fontFamilies, material, radii, spacing } from '@/theme/tokens';
import { useAppTheme, useCardPalette } from '@/theme/use-theme-colors';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import {
   Add01Icon,
   Attachment01Icon,
   AudioWave01Icon,
   Baby01Icon,
   Calendar03Icon,
   Delete02Icon,
   HeartCheckIcon,
   Image01Icon,
   Leaf01Icon,
   MessageEdit01Icon,
   Mic01Icon,
   SentIcon,
   Settings01Icon,
   VolumeHighIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { router } from 'expo-router';
import type { ComponentProps } from 'react';
import { useEffect, useRef, useState } from 'react';
import {
   KeyboardAvoidingView,
   Platform,
   Pressable,
   ScrollView,
   StyleSheet,
   TextInput,
   View,
} from 'react-native';
import Animated, {
   Easing,
   useAnimatedStyle,
   useSharedValue,
   withDelay,
   withRepeat,
   withSequence,
   withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ── Pulsing orb ──────────────────────────────────────────────────────────────

function AssistantOrb() {
   const s1 = useSharedValue(1);
   const s2 = useSharedValue(1);
   const s3 = useSharedValue(1);
   const ease = Easing.inOut(Easing.sin);

   useEffect(() => {
      s1.value = withRepeat(
         withSequence(
            withTiming(1.12, { duration: 2200, easing: ease }),
            withTiming(1, { duration: 2200, easing: ease }),
         ),
         -1,
      );
      s2.value = withDelay(
         400,
         withRepeat(
            withSequence(
               withTiming(1.18, { duration: 2400, easing: ease }),
               withTiming(1, { duration: 2400, easing: ease }),
            ),
            -1,
         ),
      );
      s3.value = withDelay(
         800,
         withRepeat(
            withSequence(
               withTiming(1.26, { duration: 2600, easing: ease }),
               withTiming(1, { duration: 2600, easing: ease }),
            ),
            -1,
         ),
      );
   }, []);

   const ring1 = useAnimatedStyle(() => ({ transform: [{ scale: s1.value }] }));
   const ring2 = useAnimatedStyle(() => ({ transform: [{ scale: s2.value }] }));
   const ring3 = useAnimatedStyle(() => ({ transform: [{ scale: s3.value }] }));

   return (
      <View style={styles.orbContainer}>
         {/* Outermost ring */}
         <Animated.View style={[styles.orbRing, styles.orbRing3, ring3]} />
         {/* Middle ring */}
         <Animated.View style={[styles.orbRing, styles.orbRing2, ring2]} />
         {/* Inner ring */}
         <Animated.View style={[styles.orbRing, styles.orbRing1, ring1]} />
         {/* Core */}
         <View style={styles.orbCore}>
            <HugeiconsIcon
               icon={Mic01Icon}
               size={36}
               color={brand.twilight}
               strokeWidth={1.5}
            />
         </View>
      </View>
   );
}

// ── Settings bottom sheet ─────────────────────────────────────────────────────

function AssistantSettingsSheet({
   sheetRef,
}: {
   sheetRef: React.RefObject<BottomSheetModal | null>;
}) {
   const { t } = useApp();
   const insets = useSafeAreaInsets();
   const nav = (href: string) => {
      sheetRef.current?.dismiss();
      go(href);
   };

   return (
      <BottomSheetWrapper ref={sheetRef}>
         <BottomSheetScrollView
            contentContainerStyle={[
               styles.sheetContent,
               {
                  paddingBottom: Math.max(insets.bottom, SHEET_CONTENT_PADDING),
               },
            ]}
         >
            <Txt kind='heading'>
               {t('Mipangilio ya Msaidizi', 'Assistant settings')}
            </Txt>

            <ActionGroup>
               <ActionRow
                  label={t('Andika ujumbe', 'Type a message')}
                  detail={t(
                     'Anza mazungumzo ya maandishi na msaidizi wako.',
                     'Start a text conversation with your assistant.',
                  )}
                  icon='chatbubble-outline'
                  onPress={() => nav('/assistant/chat')}
               />
               <ActionRow
                  label={t('Zungumza', 'Use voice')}
                  detail={t(
                     'Zungumza na msaidizi wako kwa sauti yako.',
                     'Talk to your assistant using your voice.',
                  )}
                  icon='mic-outline'
                  onPress={() => nav('/assistant/voice')}
               />
               <ActionRow
                  label={t('Wasiliana na mhudumu', 'Contact a care provider')}
                  detail={t(
                     'Omba msaada wa moja kwa moja kutoka kwa mtaalamu.',
                     'Request direct support from a care professional.',
                  )}
                  icon='person-outline'
                  onPress={() => nav('/assistant/handoff')}
               />
               <ActionRow
                  label={t('Idhini ya AI', 'AI consent')}
                  detail={t(
                     'Simamia jinsi AI inavyotumia data yako ya mazungumzo.',
                     'Manage how AI uses your conversation data.',
                  )}
                  icon='shield-outline'
                  onPress={() => nav('/profile/privacy')}
               />
               <ActionRow
                  label={t('Msaada wa haraka', 'Urgent help')}
                  detail={t(
                     'Pata msaada wa haraka kwa hali za dharura za afya.',
                     'Get immediate help for urgent health situations.',
                  )}
                  icon='medkit-outline'
                  onPress={() => nav('/urgent-help')}
               />
            </ActionGroup>
         </BottomSheetScrollView>
      </BottomSheetWrapper>
   );
}

// ── Landing ───────────────────────────────────────────────────────────────────

export default function AssistantLanding() {
   const { t } = useApp();
   const theme = useAppTheme();
   const insets = useSafeAreaInsets();
   const sheetRef = useRef<BottomSheetModal>(null);

   return (
      <View
         style={[styles.screen, { backgroundColor: theme.colors.background }]}
      >
         {/* Header */}
         <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
            <Txt kind='label' color={material.light.onSurfaceVariant}>
               {t('Msaidizi', 'Assistant')}
            </Txt>
            <Pressable
               accessibilityRole='button'
               accessibilityLabel={t('Mipangilio', 'Settings')}
               onPress={() => sheetRef.current?.present()}
               style={({ pressed }) => [
                  styles.settingsBtn,
                  {
                     backgroundColor: theme.colors.surfaceContainerLow,
                     opacity: pressed ? 0.7 : 1,
                  },
               ]}
            >
               <HugeiconsIcon
                  icon={Settings01Icon}
                  size={20}
                  color={theme.colors.onSurfaceVariant}
                  strokeWidth={1.5}
               />
            </Pressable>
         </View>

         {/* Orb */}
         <View style={styles.orbSection}>
            <AssistantOrb />
         </View>

         {/* Identity */}
         <View style={styles.identity}>
            <Txt kind='headline' align='center'>
               {t('Msaidizi wako', 'Your assistant')}
            </Txt>
            <Txt
               kind='body'
               color={material.light.onSurfaceVariant}
               align='center'
            >
               {t(
                  'Utulivu · Msaidizi wa afya ya kike',
                  "Calm · Women's health assistant",
               )}
            </Txt>
         </View>

         {/* CTA */}
         <View style={[styles.cta, { paddingBottom: insets.bottom + 24 }]}>
            <Button
               label={t('Anza mazungumzo', 'Begin Conversation')}
               onPress={() => go('/assistant/chat')}
            />
            <Button
               variant='secondary'
               label={t('Zungumza kwa sauti', 'Use voice')}
               onPress={() => go('/assistant/voice')}
            />
         </View>

         <AssistantSettingsSheet sheetRef={sheetRef} />
      </View>
   );
}

// ── Chat ─────────────────────────────────────────────────────────────────────

type Message = { role: 'user' | 'assistant'; text: string };

type Prompt = {
   sw: string;
   en: string;
   subSw: string;
   subEn: string;
   icon: ComponentProps<typeof HugeiconsIcon>['icon'];
};

const SUGGESTED_PROMPTS: Prompt[] = [
   {
      sw: 'Jiandae kwa miadi',
      en: 'Prepare for my appointment',
      subSw: 'Maswali ya kuuliza daktari wako',
      subEn: 'Questions to ask your doctor',
      icon: Calendar03Icon,
   },
   {
      sw: 'Afya baada ya kujifungua',
      en: 'Postpartum health',
      subSw: 'Mwili wako baada ya kuzaa',
      subEn: 'Your body after giving birth',
      icon: HeartCheckIcon,
   },
   {
      sw: 'Afya ya mtoto wangu',
      en: "My baby's health",
      subSw: 'Ukuaji na maendeleo ya mtoto',
      subEn: "Baby's growth and development",
      icon: Baby01Icon,
   },
   {
      sw: 'Ushauri wa lishe',
      en: 'Nutrition advice',
      subSw: 'Chakula bora kwa mama mjamzito',
      subEn: 'Healthy eating for expectant mothers',
      icon: Leaf01Icon,
   },
];

function TypingIndicator() {
   const d1 = useSharedValue(0);
   const d2 = useSharedValue(0);
   const d3 = useSharedValue(0);
   const ease = Easing.inOut(Easing.sin);

   useEffect(() => {
      const pulse = (sv: typeof d1, delay: number) => {
         sv.value = withDelay(
            delay,
            withRepeat(
               withSequence(
                  withTiming(-4, { duration: 350, easing: ease }),
                  withTiming(0, { duration: 350, easing: ease }),
               ),
               -1,
            ),
         );
      };
      pulse(d1, 0);
      pulse(d2, 140);
      pulse(d3, 280);
   }, []);

   const s1 = useAnimatedStyle(() => ({
      transform: [{ translateY: d1.value }],
   }));
   const s2 = useAnimatedStyle(() => ({
      transform: [{ translateY: d2.value }],
   }));
   const s3 = useAnimatedStyle(() => ({
      transform: [{ translateY: d3.value }],
   }));

   return (
      <View style={chatStyles.typingRow}>
         <Animated.View style={[chatStyles.typingDot, s1]} />
         <Animated.View style={[chatStyles.typingDot, s2]} />
         <Animated.View style={[chatStyles.typingDot, s3]} />
      </View>
   );
}

function ChatActionBtn({
   icon,
   bg,
   color,
   label,
   onPress,
}: {
   icon: ComponentProps<typeof HugeiconsIcon>['icon'];
   bg: string;
   color: string;
   label: string;
   onPress: () => void;
}) {
   return (
      <Pressable
         accessibilityRole='button'
         accessibilityLabel={label}
         onPress={onPress}
         style={({ pressed }) => [
            chatStyles.actionBtn,
            { backgroundColor: bg, opacity: pressed ? 0.75 : 1 },
         ]}
      >
         <HugeiconsIcon icon={icon} size={20} color={color} strokeWidth={1.5} />
      </Pressable>
   );
}

export function Chat() {
   const theme = useAppTheme();
   const colors = theme.colors;
   const palette = useCardPalette();
   const { state, t, offline } = useApp();
   const [input, setInput] = useState('');
   const [messages, setMessages] = useState<Message[]>([]);
   const [thinking, setThinking] = useState(false);
   const listRef = useRef<any>(null);
   const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
   const insets = useSafeAreaInsets();

   useEffect(
      () => () => {
         if (timerRef.current) clearTimeout(timerRef.current);
      },
      [],
   );

   const submit = (text: string = input.trim()) => {
      if (!text || offline) return;
      setMessages((m) => [...m, { role: 'user', text }]);
      setInput('');
      setThinking(true);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
      timerRef.current = setTimeout(() => {
         setThinking(false);
         setMessages((m) => [
            ...m,
            {
               role: 'assistant',
               text: t(
                  'Nashukuru kwa swali lako. Ninaweza kukusaidia kujiandaa kwa miadi yako, kuelewa hatua za afya, au kupata njia ya huduma inayofaa. Kwa wasiwasi wa haraka wa kiafya, tafadhali wasiliana na mhudumu moja kwa moja.',
                  'Thank you for reaching out. I can help you prepare for appointments, understand health steps, or find the right care pathway. For urgent health concerns, please contact a care provider directly.',
               ),
            },
         ]);
         setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
      }, 1200);
   };

   const isEmpty = messages.length === 0;

   return (
      <Access>
         <View
            style={[chatStyles.screen, { backgroundColor: colors.background }]}
         >
            {/* Header */}
            <View
               style={[chatStyles.chatHeader, { paddingTop: insets.top + 8 }]}
            >
               <Pressable
                  accessibilityRole='button'
                  accessibilityLabel={t('Rudi', 'Back')}
                  onPress={() => router.back()}
                  style={({ pressed }) => [
                     chatStyles.headerBtn,
                     { opacity: pressed ? 0.6 : 1 },
                  ]}
               >
                  <Icon
                     name={
                        Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back'
                     }
                     size={24}
                     color={colors.onSurface}
                  />
               </Pressable>
               <View style={chatStyles.headerTitle}>
                  <View
                     style={[
                        chatStyles.headerAvatar,
                        { backgroundColor: colors.primaryContainer },
                     ]}
                  >
                     <HugeiconsIcon
                        icon={Mic01Icon}
                        size={16}
                        color={colors.primary}
                        strokeWidth={1.5}
                     />
                  </View>
                  <View>
                     <Txt kind='label'>{t('Msaidizi', 'Assistant')}</Txt>
                     <Txt kind='caption' color={colors.onSurfaceVariant}>
                        {thinking
                           ? t('Anaandika…', 'Typing…')
                           : t('Mtandaoni', 'Online')}
                     </Txt>
                  </View>
               </View>
               <Pressable
                  accessibilityRole='button'
                  accessibilityLabel={t(
                     'Futa mazungumzo',
                     'Clear conversation',
                  )}
                  onPress={() => setMessages([])}
                  style={({ pressed }) => [
                     chatStyles.headerBtn,
                     { opacity: pressed ? 0.6 : 1 },
                  ]}
               >
                  <HugeiconsIcon
                     icon={Delete02Icon}
                     size={20}
                     color={colors.onSurfaceVariant}
                     strokeWidth={1.5}
                  />
               </Pressable>
            </View>

            {/* Messages */}
            <ScrollView
               ref={listRef}
               style={{ flex: 1 }}
               contentContainerStyle={[
                  chatStyles.messageList,
                  { paddingBottom: 16 },
               ]}
               keyboardShouldPersistTaps='handled'
               showsVerticalScrollIndicator={false}
            >
               {isEmpty && (
                  <View style={chatStyles.emptyState}>
                     <View
                        style={[
                           chatStyles.emptyOrb,
                           { backgroundColor: colors.primaryContainer },
                        ]}
                     >
                        <HugeiconsIcon
                           icon={Mic01Icon}
                           size={32}
                           color={colors.primary}
                           strokeWidth={1.5}
                        />
                     </View>
                     <Txt kind='heading' align='center'>
                        {state.name
                           ? t(`Habari, ${state.name}`, `Hello, ${state.name}`)
                           : t('Habari, mama', 'Hello, mama')}
                     </Txt>
                     <Txt
                        kind='body'
                        color={colors.onSurfaceVariant}
                        align='center'
                     >
                        {t(
                           'Niko hapa kukusaidia. Gusa mada hapa chini ili kuanza.',
                           "I'm here to help. Tap a topic below to get started.",
                        )}
                     </Txt>
                     <View style={chatStyles.promptGrid}>
                        {SUGGESTED_PROMPTS.map((p, i) => (
                           <Pressable
                              key={p.en}
                              onPress={() => submit(t(p.sw, p.en))}
                              style={({ pressed }) => [
                                 chatStyles.promptCard,
                                 {
                                    backgroundColor:
                                       palette[i % palette.length],
                                    borderRadius:
                                       theme.components.card.borderRadius,
                                    opacity: pressed ? 0.8 : 1,
                                 },
                              ]}
                           >
                              <HugeiconsIcon
                                 icon={p.icon}
                                 size={30}
                                 color={colors.onSurface}
                                 strokeWidth={1.5}
                              />
                              <Txt kind='label'>{t(p.sw, p.en)}</Txt>
                              <Txt kind='small' color={colors.onSurfaceVariant}>
                                 {t(p.subSw, p.subEn)}
                              </Txt>
                           </Pressable>
                        ))}
                     </View>
                  </View>
               )}

               {messages.map((m, i) => (
                  <View
                     key={i}
                     style={[
                        chatStyles.bubbleRow,
                        m.role === 'user'
                           ? chatStyles.bubbleRowUser
                           : chatStyles.bubbleRowAssistant,
                     ]}
                  >
                     {m.role === 'assistant' && (
                        <View
                           style={[
                              chatStyles.avatarSmall,
                              { backgroundColor: colors.primaryContainer },
                           ]}
                        >
                           <HugeiconsIcon
                              icon={Mic01Icon}
                              size={12}
                              color={colors.primary}
                              strokeWidth={1.5}
                           />
                        </View>
                     )}
                     <View
                        style={[
                           chatStyles.bubble,
                           m.role === 'user'
                              ? {
                                   backgroundColor: brand.twilight,
                                   borderBottomRightRadius: 4,
                                }
                              : {
                                   backgroundColor: colors.surfaceContainerLow,
                                   borderBottomLeftRadius: 4,
                                },
                        ]}
                     >
                        <Txt
                           kind='body'
                           color={
                              m.role === 'user'
                                 ? material.light.onPrimary
                                 : colors.onSurface
                           }
                        >
                           {m.text}
                        </Txt>
                     </View>
                  </View>
               ))}

               {thinking && (
                  <View
                     style={[
                        chatStyles.bubbleRow,
                        chatStyles.bubbleRowAssistant,
                     ]}
                  >
                     <View
                        style={[
                           chatStyles.avatarSmall,
                           { backgroundColor: colors.primaryContainer },
                        ]}
                     >
                        <HugeiconsIcon
                           icon={Mic01Icon}
                           size={12}
                           color={colors.primary}
                           strokeWidth={1.5}
                        />
                     </View>
                     <View
                        style={[
                           chatStyles.bubble,
                           {
                              backgroundColor: colors.surfaceContainerLow,
                              borderBottomLeftRadius: 4,
                              paddingVertical: 16,
                           },
                        ]}
                     >
                        <TypingIndicator />
                     </View>
                  </View>
               )}
            </ScrollView>

            {/* Input card */}
            <KeyboardAvoidingView
               behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
               <View
                  style={[
                     chatStyles.inputWrap,
                     {
                        backgroundColor: colors.background,
                        paddingBottom: insets.bottom + 12,
                     },
                  ]}
               >
                  <View
                     style={[
                        chatStyles.inputCard,
                        {
                           backgroundColor: colors.surfaceContainerLow,
                        },
                     ]}
                  >
                     {/* Text area */}
                     <TextInput
                        style={[
                           chatStyles.textInput,
                           {
                              color: colors.onSurface,
                              fontFamily: fontFamilies.regular,
                           },
                        ]}
                        placeholder={t('Uliza chochote…', 'Ask anything…')}
                        placeholderTextColor={colors.onSurfaceVariant}
                        value={input}
                        onChangeText={setInput}
                        multiline
                        maxLength={1000}
                     />
                     {/* Action row */}
                     <View style={chatStyles.inputActions}>
                        {/* Left: attach actions */}
                        <View style={chatStyles.inputActionsLeft}>
                           <ChatActionBtn
                              icon={Add01Icon}
                              bg={colors.surfaceContainerHigh}
                              color={colors.onSurfaceVariant}
                              label='Add'
                              onPress={() => {}}
                           />
                           <ChatActionBtn
                              icon={Attachment01Icon}
                              bg={colors.surfaceContainerHigh}
                              color={colors.onSurfaceVariant}
                              label='Attach'
                              onPress={() => {}}
                           />
                           <ChatActionBtn
                              icon={Image01Icon}
                              bg={colors.surfaceContainerHigh}
                              color={colors.onSurfaceVariant}
                              label='Image'
                              onPress={() => {}}
                           />
                        </View>
                        {/* Right: voice / send */}
                        <View style={chatStyles.inputActionsRight}>
                           {input.trim() ? (
                              <ChatActionBtn
                                 icon={SentIcon}
                                 bg={brand.twilight}
                                 color={material.light.onPrimary}
                                 label={t('Tuma', 'Send')}
                                 onPress={() => submit()}
                              />
                           ) : (
                              <>
                                 <ChatActionBtn
                                    icon={Mic01Icon}
                                    bg={colors.surfaceContainerHigh}
                                    color={colors.onSurfaceVariant}
                                    label={t('Sauti', 'Voice')}
                                    onPress={() => go('/assistant/voice')}
                                 />
                                 <ChatActionBtn
                                    icon={AudioWave01Icon}
                                    bg={brand.twilight}
                                    color={material.light.onPrimary}
                                    label={t('Rekodi', 'Record')}
                                    onPress={() => go('/assistant/voice')}
                                 />
                              </>
                           )}
                        </View>
                     </View>
                  </View>
               </View>
            </KeyboardAvoidingView>
         </View>
      </Access>
   );
}

// ── Voice ─────────────────────────────────────────────────────────────────────

type VoicePhase = 'idle' | 'listening' | 'thinking' | 'speaking';

export function Voice() {
   const theme = useAppTheme();
   const colors = theme.colors;
   const { t } = useApp();
   const insets = useSafeAreaInsets();
   const [phase, setPhase] = useState<VoicePhase>('idle');

   // Orb pulse
   const s1 = useSharedValue(1);
   const s2 = useSharedValue(1);
   const s3 = useSharedValue(1);

   useEffect(() => {
      const ease = Easing.inOut(Easing.sin);
      const active = phase === 'listening' || phase === 'speaking';
      const dur = phase === 'listening' ? 600 : 900;
      if (active) {
         s1.value = withRepeat(
            withSequence(
               withTiming(1.1, { duration: dur, easing: ease }),
               withTiming(1, { duration: dur, easing: ease }),
            ),
            -1,
         );
         s2.value = withDelay(
            200,
            withRepeat(
               withSequence(
                  withTiming(1.18, { duration: dur + 100, easing: ease }),
                  withTiming(1, { duration: dur + 100, easing: ease }),
               ),
               -1,
            ),
         );
         s3.value = withDelay(
            400,
            withRepeat(
               withSequence(
                  withTiming(1.28, { duration: dur + 200, easing: ease }),
                  withTiming(1, { duration: dur + 200, easing: ease }),
               ),
               -1,
            ),
         );
      } else {
         s1.value = withTiming(1, { duration: 400 });
         s2.value = withTiming(1, { duration: 400 });
         s3.value = withTiming(1, { duration: 400 });
      }
   }, [phase]);

   const r1 = useAnimatedStyle(() => ({ transform: [{ scale: s1.value }] }));
   const r2 = useAnimatedStyle(() => ({ transform: [{ scale: s2.value }] }));
   const r3 = useAnimatedStyle(() => ({ transform: [{ scale: s3.value }] }));

   const phaseLabel: Record<VoicePhase, [string, string]> = {
      idle: ['Gusa ili kuanza', 'Tap to begin'],
      listening: ['Nakusikiliza…', 'Listening…'],
      thinking: ['Nafikiri…', 'Thinking…'],
      speaking: ['Najibu…', 'Speaking…'],
   };

   const phaseSubtitle: Record<VoicePhase, [string, string]> = {
      idle: [
         'Msaidizi wako yuko tayari kukusikia.',
         'Your assistant is ready to hear you.',
      ],
      listening: [
         'Zungumza swali lako kwa utulivu.',
         'Speak your question clearly.',
      ],
      thinking: [
         'Subiri kidogo, jibu linakuja.',
         'Just a moment, preparing your response.',
      ],
      speaking: ['Sikiliza jibu lako.', 'Listen to your response.'],
   };

   const cycle = () => {
      setPhase((p) => {
         if (p === 'idle') return 'listening';
         if (p === 'listening') return 'thinking';
         if (p === 'thinking') return 'speaking';
         return 'idle';
      });
   };

   const coreColor =
      phase === 'idle' ? colors.primaryContainer : brand.twilight;
   const iconColor =
      phase === 'idle' ? colors.primary : material.light.onPrimary;

   return (
      <Access>
         <View
            style={[voiceStyles.screen, { backgroundColor: colors.background }]}
         >
            {/* Header */}
            <View style={[voiceStyles.header, { paddingTop: insets.top + 8 }]}>
               <Pressable
                  accessibilityRole='button'
                  accessibilityLabel={t('Rudi', 'Back')}
                  onPress={() => router.back()}
                  style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
               >
                  <Icon
                     name={
                        Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back'
                     }
                     size={24}
                     color={colors.onSurface}
                  />
               </Pressable>
               <Txt kind='label'>
                  {t('Msaidizi wa Sauti', 'Voice Assistant')}
               </Txt>
               <Pressable
                  accessibilityRole='button'
                  accessibilityLabel={t(
                     'Badilisha hadi maandishi',
                     'Switch to text',
                  )}
                  onPress={() => go('/assistant/chat')}
                  style={({ pressed }) => [
                     voiceStyles.switchBtn,
                     {
                        backgroundColor: colors.surfaceContainerLow,
                        opacity: pressed ? 0.7 : 1,
                     },
                  ]}
               >
                  <HugeiconsIcon
                     icon={MessageEdit01Icon}
                     size={18}
                     color={colors.onSurfaceVariant}
                     strokeWidth={1.5}
                  />
               </Pressable>
            </View>

            {/* Orb */}
            <View style={voiceStyles.orbSection}>
               <View style={voiceStyles.orbWrap}>
                  <Animated.View
                     style={[
                        voiceStyles.vRing,
                        voiceStyles.vRing3,
                        r3,
                        { backgroundColor: `${brand.amethyst}15` },
                     ]}
                  />
                  <Animated.View
                     style={[
                        voiceStyles.vRing,
                        voiceStyles.vRing2,
                        r2,
                        { backgroundColor: `${brand.amethyst}25` },
                     ]}
                  />
                  <Animated.View
                     style={[
                        voiceStyles.vRing,
                        voiceStyles.vRing1,
                        r1,
                        { backgroundColor: `${brand.amethyst}38` },
                     ]}
                  />
                  <Pressable
                     accessibilityRole='button'
                     accessibilityLabel={t('Gusa kuzungumza', 'Tap to speak')}
                     onPress={cycle}
                     style={({ pressed }) => [
                        voiceStyles.vCore,
                        {
                           backgroundColor: coreColor,
                           opacity: pressed ? 0.85 : 1,
                        },
                     ]}
                  >
                     <HugeiconsIcon
                        icon={phase === 'speaking' ? VolumeHighIcon : Mic01Icon}
                        size={40}
                        color={iconColor}
                        strokeWidth={1.5}
                     />
                  </Pressable>
               </View>
            </View>

            {/* Status */}
            <View style={voiceStyles.statusSection}>
               <Txt kind='headline' align='center'>
                  {t(...phaseLabel[phase])}
               </Txt>
               <Txt kind='body' color={colors.onSurfaceVariant} align='center'>
                  {t(...phaseSubtitle[phase])}
               </Txt>
            </View>

            {/* Actions */}
            <View
               style={[
                  voiceStyles.actions,
                  { paddingBottom: insets.bottom + 24 },
               ]}
            >
               {phase !== 'idle' && (
                  <Button
                     variant='secondary'
                     label={t('Simamisha', 'Stop')}
                     onPress={() => setPhase('idle')}
                  />
               )}
               <Button
                  variant='secondary'
                  label={t('Wasiliana na mhudumu', 'Contact a care provider')}
                  onPress={() => go('/assistant/handoff')}
               />
            </View>
         </View>
      </Access>
   );
}

// ── Handoff ───────────────────────────────────────────────────────────────────

export function Handoff() {
   const { state, update, t, offline } = useApp();
   const colors = useAppTheme().colors;
   const [reason, setReason] = useState('');
   const [channel, setChannel] = useState('phone');

   return (
      <Access>
         <Screen
            back
            title={t('Wasiliana na Mhudumu', 'Contact a Care Provider')}
            subtitle={t(
               'Tutatumia ujumbe wako kwa timu ya huduma.',
               "We'll forward your message to the care team.",
            )}
         >
            {state.handoff ? (
               <Card tone={colors.primaryContainer}>
                  <View style={{ gap: 8 }}>
                     <Txt kind='heading'>
                        {t('Ombi Limewasilishwa', 'Request Sent')}
                     </Txt>
                     <Txt color={colors.onSurfaceVariant}>
                        {t(
                           'Timu yetu ya huduma itakuwasiliana nawe hivi karibuni kupitia njia uliyochagua.',
                           'Our care team will reach out to you shortly through your chosen channel.',
                        )}
                     </Txt>
                  </View>
                  <Button
                     variant='secondary'
                     label={t('Tuma ombi jipya', 'Send a new request')}
                     onPress={() => update({ handoff: undefined })}
                  />
               </Card>
            ) : (
               <>
                  <Field
                     variant='outlined'
                     label={t('Nini kinakusumbua?', "What's on your mind?")}
                     value={reason}
                     onChangeText={setReason}
                     multiline
                     placeholder={t(
                        'Eleza wasiwasi wako au swali lako…',
                        'Describe your concern or question…',
                     )}
                  />
                  <View style={{ gap: 8 }}>
                     <Txt kind='label' color={colors.onSurfaceVariant}>
                        {t('Njia ya mawasiliano', 'Preferred contact method')}
                     </Txt>
                     <Row>
                        <Chip
                           label={t('Simu', 'Phone call')}
                           selected={channel === 'phone'}
                           onPress={() => setChannel('phone')}
                        />
                        <Chip
                           label={t('Ujumbe', 'Message')}
                           selected={channel === 'app'}
                           onPress={() => setChannel('app')}
                        />
                     </Row>
                  </View>
                  <Button
                     disabled={!reason.trim() || offline}
                     label={t('Tuma ombi', 'Send request')}
                     onPress={() =>
                        update({
                           handoff: {
                              reason: reason.trim(),
                              channel,
                              status: 'requested',
                           },
                        })
                     }
                  />
               </>
            )}
            <Button
               variant='secondary'
               label={t('Msaada wa haraka', 'Urgent help')}
               onPress={() => go('/urgent-help')}
            />
         </Screen>
      </Access>
   );
}

// ── Urgent Help ───────────────────────────────────────────────────────────────

export function UrgentHelp() {
   const colors = useAppTheme().colors;
   const { t } = useApp();

   return (
      <Screen back title={t('Msaada wa Haraka', 'Urgent Help')}>
         <Card tone={colors.errorContainer}>
            <Txt kind='heading' color={colors.onErrorContainer}>
               {t(
                  'Ikiwa una hali ya dharura, tafuta huduma sasa hivi.',
                  'If this is an emergency, seek care immediately.',
               )}
            </Txt>
            <Txt color={colors.onErrorContainer}>
               {t(
                  'Nenda kwenye kituo cha afya kilicho karibu nawe au piga simu ya dharura ya eneo lako.',
                  'Go to the nearest health facility or call your local emergency number.',
               )}
            </Txt>
         </Card>
         <Card tone={colors.surfaceContainerLow}>
            <Txt kind='heading'>
               {t('Njia nyingine za msaada', 'Other ways to get help')}
            </Txt>
            <Txt color={colors.onSurfaceVariant}>
               {t(
                  'Timu yetu ya huduma iko tayari kukusaidia kwa maswali ya kawaida ya afya.',
                  'Our care team is available to help with general health questions.',
               )}
            </Txt>
            <Button
               label={t('Wasiliana na mhudumu', 'Contact a care provider')}
               onPress={() => go('/assistant/handoff')}
            />
            <Button
               variant='secondary'
               label={t('Fungua ukurasa rasmi', 'Open official page')}
               onPress={() => go('/official-help')}
            />
         </Card>
      </Screen>
   );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const ORB_SIZE = 220;
const RING1_SIZE = ORB_SIZE;
const RING2_SIZE = ORB_SIZE + 40;
const RING3_SIZE = ORB_SIZE + 80;

const styles = StyleSheet.create({
   screen: { flex: 1 },

   header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 24,
      paddingBottom: 12,
   },
   settingsBtn: {
      width: 40,
      height: 40,
      borderRadius: radii.pill,
      alignItems: 'center',
      justifyContent: 'center',
   },

   orbSection: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
   },
   orbContainer: {
      width: RING3_SIZE,
      height: RING3_SIZE,
      alignItems: 'center',
      justifyContent: 'center',
   },
   orbRing: {
      position: 'absolute',
      borderRadius: radii.pill,
   },
   orbRing3: {
      width: RING3_SIZE,
      height: RING3_SIZE,
      backgroundColor: `${brand.amethyst}18`,
   },
   orbRing2: {
      width: RING2_SIZE,
      height: RING2_SIZE,
      backgroundColor: `${brand.amethyst}28`,
   },
   orbRing1: {
      width: RING1_SIZE,
      height: RING1_SIZE,
      backgroundColor: `${brand.amethyst}40`,
   },
   orbCore: {
      width: 88,
      height: 88,
      borderRadius: radii.pill,
      backgroundColor: material.light.primaryContainer,
      alignItems: 'center',
      justifyContent: 'center',
   },

   identity: {
      alignItems: 'center',
      paddingHorizontal: 32,
      gap: spacing.sm,
      paddingBottom: spacing['2xl'],
   },

   cta: {
      paddingHorizontal: 24,
      gap: spacing.md,
   },

   sheetContent: {
      padding: SHEET_CONTENT_PADDING,
      gap: 12,
   },
});

// ── Chat styles ───────────────────────────────────────────────────────────────

const chatStyles = StyleSheet.create({
   screen: { flex: 1 },

   chatHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingBottom: 12,
      gap: 12,
   },
   headerBtn: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radii.pill,
   },
   headerTitle: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
   },
   headerAvatar: {
      width: 36,
      height: 36,
      borderRadius: radii.pill,
      alignItems: 'center',
      justifyContent: 'center',
   },

   messageList: {
      paddingHorizontal: 16,
      paddingTop: 16,
      gap: 12,
   },

   emptyState: {
      alignItems: 'center',
      gap: 16,
      paddingTop: 32,
      paddingHorizontal: 8,
   },
   emptyOrb: {
      width: 72,
      height: 72,
      borderRadius: radii.pill,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 4,
   },
   promptGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      paddingTop: 4,
      width: '100%',
   },
   promptCard: {
      width: '47%',
      minHeight: 130,
      padding: 16,
      gap: 8,
      flexGrow: 1,
   },

   bubbleRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 8,
   },
   bubbleRowUser: { justifyContent: 'flex-end' },
   bubbleRowAssistant: { justifyContent: 'flex-start' },
   avatarSmall: {
      width: 24,
      height: 24,
      borderRadius: radii.pill,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 2,
   },
   bubble: {
      maxWidth: '78%',
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 18,
   },

   typingRow: {
      flexDirection: 'row',
      gap: 6,
      alignItems: 'center',
   },
   typingDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: brand.amethyst,
   },

   inputWrap: {
      paddingHorizontal: 16,
      paddingTop: 10,
   },
   inputCard: {
      borderRadius: radii['2xl'],
      paddingHorizontal: 16,
      paddingTop: 14,
      paddingBottom: 10,
      gap: 10,
   },
   textInput: {
      minHeight: 40,
      maxHeight: 120,
      fontSize: 15,
      lineHeight: 22,
      padding: 0,
   },
   inputActions: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
   },
   inputActionsLeft: {
      flexDirection: 'row',
      gap: 8,
   },
   inputActionsRight: {
      flexDirection: 'row',
      gap: 8,
   },
   actionBtn: {
      width: 40,
      height: 40,
      borderRadius: radii.pill,
      alignItems: 'center',
      justifyContent: 'center',
   },
});

// ── Voice styles ──────────────────────────────────────────────────────────────

const VORB_SIZE = 180;
const VRING1 = VORB_SIZE;
const VRING2 = VORB_SIZE + 50;
const VRING3 = VORB_SIZE + 100;

const voiceStyles = StyleSheet.create({
   screen: { flex: 1 },

   header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 24,
      paddingBottom: 12,
   },
   switchBtn: {
      width: 40,
      height: 40,
      borderRadius: radii.pill,
      alignItems: 'center',
      justifyContent: 'center',
   },

   orbSection: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
   },
   orbWrap: {
      width: VRING3,
      height: VRING3,
      alignItems: 'center',
      justifyContent: 'center',
   },
   vRing: {
      position: 'absolute',
      borderRadius: radii.pill,
   },
   vRing1: { width: VRING1, height: VRING1 },
   vRing2: { width: VRING2, height: VRING2 },
   vRing3: { width: VRING3, height: VRING3 },
   vCore: {
      width: 96,
      height: 96,
      borderRadius: radii.pill,
      alignItems: 'center',
      justifyContent: 'center',
   },

   statusSection: {
      alignItems: 'center',
      paddingHorizontal: 32,
      gap: spacing.sm,
      paddingBottom: spacing['2xl'],
   },

   actions: {
      paddingHorizontal: 24,
      gap: spacing.md,
   },
});
