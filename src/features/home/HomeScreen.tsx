import { AppointmentCard } from '@/components/patterns/AppointmentCard';
import { AuthHero, type HeroIcon } from '@/components/patterns/AuthHero';
import { DataBoundary, go, Icon, Txt } from '@/components/ui/kit';
import { lessons, services } from '@/mocks/catalog';
import { useApp } from '@/providers/AppProvider';
import { brand, material, radii, spacing } from '@/theme/tokens';
import { useThemeColors } from '@/theme/use-theme-colors';
import {
   Appointment01Icon,
   Baby01Icon,
   FavouriteIcon,
   FlowerIcon,
   HeartCheckIcon,
   Leaf01Icon,
   MessageMultiple02Icon,
   AiSparklesIcon,
   Alert02Icon,
   UserGroupIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react-native';
import {
   Pressable,
   ScrollView,
   StyleSheet,
   View,
   useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

// ── Greeting ──────────────────────────────────────────────────────────────────

function greeting(name: string, t: (sw: string, en: string) => string) {
   const hour = new Date().getHours();
   if (hour < 12) return t(`Habari za asubuhi${name ? `, ${name}` : ''}`, `Good morning${name ? `, ${name}` : ''}`);
   if (hour < 17) return t(`Habari za mchana${name ? `, ${name}` : ''}`, `Good afternoon${name ? `, ${name}` : ''}`);
   return t(`Habari za jioni${name ? `, ${name}` : ''}`, `Good evening${name ? `, ${name}` : ''}`);
}

// ── Home hero icons ───────────────────────────────────────────────────────────

const HOME_ICONS: HeroIcon[] = [
   { key: 'heart',    icon: HeartCheckIcon, top: 0.12, left: 0.08, size: 36, rotate: '-12deg', delay: 60  },
   { key: 'baby',     icon: Baby01Icon,     top: 0.22, left: 0.70, size: 44, rotate: '10deg',  delay: 140 },
   { key: 'flower',   icon: FlowerIcon,     top: 0.52, left: 0.05, size: 30, rotate: '-8deg',  delay: 200 },
   { key: 'leaf',     icon: Leaf01Icon,     top: 0.50, left: 0.78, size: 28, rotate: '18deg',  delay: 260 },
   { key: 'favourite',icon: FavouriteIcon,  top: 0.08, left: 0.55, size: 26, rotate: '0deg',   delay: 320 },
];

// ── Hero meta per care category ───────────────────────────────────────────────

const HERO_META: Record<string, { bg: string; circle: string; icon: IconSvgElement }> = {
   maternal:   { bg: brand.sunset,   circle: brand.orange,    icon: HeartCheckIcon },
   child:      { bg: brand.amethyst, circle: brand.twilight,  icon: UserGroupIcon },
   postpartum: { bg: brand.orange,   circle: brand.sunset,    icon: AiSparklesIcon },
   general:    { bg: brand.twilight, circle: brand.amethyst,  icon: MessageMultiple02Icon },
};

// ── Quick actions ─────────────────────────────────────────────────────────────

type QuickAction = {
   icon: IconSvgElement;
   label: [string, string];
   href: string;
   bg: string;
   fg: string;
};

const QUICK_ACTIONS: QuickAction[] = [
   { icon: Appointment01Icon, label: ['Miadi', 'Book visit'], href: '/booking?service=maternal', bg: brand.sunset, fg: brand.deep },
   { icon: MessageMultiple02Icon, label: ['Msaidizi', 'AI chat'], href: '/assistant/chat', bg: brand.amethyst, fg: material.light.onPrimary },
   { icon: HeartCheckIcon, label: ['Hali yangu', 'Check in'], href: '/check-in', bg: brand.orange, fg: brand.deep },
   { icon: Alert02Icon, label: ['Msaada wa haraka', 'Urgent help'], href: '/urgent-help', bg: brand.twilight, fg: material.light.onPrimary },
];

function QuickActionBtn({ action, t }: { action: QuickAction; t: (sw: string, en: string) => string }) {
   return (
      <Pressable
         accessibilityRole='button'
         accessibilityLabel={t(...action.label)}
         onPress={() => go(action.href)}
         style={({ pressed }) => [styles.quickBtn, { backgroundColor: action.bg, opacity: pressed ? 0.8 : 1 }]}
      >
         <View style={[styles.quickIcon, { backgroundColor: 'rgba(0,0,0,0.10)' }]}>
            <HugeiconsIcon icon={action.icon} size={22} color={action.fg} strokeWidth={1.5} />
         </View>
         <Txt kind='label' color={action.fg} align='center'>{t(...action.label)}</Txt>
      </Pressable>
   );
}

// ── Service card ─────────────────────────────────────────────────────────────

const SERVICE_META: Record<string, { bg: string; fg: string; icon: IconSvgElement }> = {
   maternal:   { bg: brand.sunset,   fg: brand.deep,                  icon: HeartCheckIcon },
   child:      { bg: brand.amethyst, fg: material.light.onPrimary,    icon: UserGroupIcon },
   postpartum: { bg: brand.orange,   fg: brand.deep,                  icon: AiSparklesIcon },
   general:    { bg: brand.twilight, fg: material.light.onPrimary,    icon: MessageMultiple02Icon },
};

function ServiceCard({
   title,
   description,
   id,
   t,
}: {
   title: string;
   description: string;
   id: string;
   t: (sw: string, en: string) => string;
}) {
   const meta = SERVICE_META[id] ?? SERVICE_META.general;
   return (
      <Pressable
         accessibilityRole='button'
         accessibilityLabel={title}
         onPress={() => go(`/booking?service=${id}`)}
         style={({ pressed }) => [styles.serviceCard, { opacity: pressed ? 0.85 : 1 }]}
      >
         <View style={[styles.serviceCardInner, { backgroundColor: meta.bg }]}>
            {/* watermark icon */}
            <View style={styles.serviceWatermark} pointerEvents='none'>
               <HugeiconsIcon icon={meta.icon} size={88} color={meta.fg} strokeWidth={1.2} />
            </View>
            <View style={styles.serviceBody}>
               <Txt kind='heading' color={meta.fg} lines={1}>{title}</Txt>
               <Txt kind='body' color={`${meta.fg}cc`} lines={2}>{description}</Txt>
            </View>
         </View>
      </Pressable>
   );
}

// ── Learn card ────────────────────────────────────────────────────────────────

function LearnCard({
   title,
   summary,
   id,
   index,
   t,
}: {
   title: string;
   summary: string;
   id: string;
   index: number;
   t: (sw: string, en: string) => string;
}) {
   const colors = useThemeColors();
   const palette = [colors.lavender, colors.butter, colors.mint, colors.peach];
   const bg = palette[index % palette.length];
   return (
      <Pressable
         accessibilityRole='button'
         accessibilityLabel={title}
         onPress={() => go(`/learning/${id}`)}
         style={({ pressed }) => [styles.learnCard, { backgroundColor: bg, opacity: pressed ? 0.85 : 1 }]}
      >
         <Txt kind='heading' color={colors.onSurface}>{title}</Txt>
         <Txt kind='body' color={colors.onSurfaceVariant}>{summary}</Txt>
      </Pressable>
   );
}

// ── Section header ────────────────────────────────────────────────────────────

function SectionHeader({ label, actionLabel, onAction }: { label: string; actionLabel?: string; onAction?: () => void }) {
   const colors = useThemeColors();
   return (
      <View style={styles.sectionHeader}>
         <Txt kind='heading' color={colors.onSurface}>{label}</Txt>
         {actionLabel && onAction && (
            <Pressable onPress={onAction} accessibilityRole='button'>
               <Txt kind='small' color={colors.primary}>{actionLabel}</Txt>
            </Pressable>
         )}
      </View>
   );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function HomeScreen() {
   const colors = useThemeColors();
   const { width } = useWindowDimensions();
   const insets = useSafeAreaInsets();
   const { state, t } = useApp();

   const selected = services.find((s) => s.category === state.path) ?? services[3];
   const otherServices = services.filter((s) => s.id !== selected.id);
   const selectedLesson = lessons.find((l) => l.category === selected.category) ?? lessons[0];
   const otherLessons = lessons.filter((l) => l.id !== selectedLesson.id).slice(0, 2);

   const next = state.appointments
      .filter((a) => a.status === 'confirmed')
      .sort((a, b) => a.start.localeCompare(b.start))[0];

   return (
      <SafeAreaView edges={['left', 'right']} style={[styles.screen, { backgroundColor: colors.background }]}>
         <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scroll}
         >
            {/* Hero — same AuthHero as login/OTP, colors driven by care category */}
            {(() => {
               const heroMeta = HERO_META[selected.category] ?? HERO_META.general;
               return (
                  <View>
                     <AuthHero
                        bgColor={heroMeta.bg}
                        circleColor={heroMeta.circle}
                        title={greeting(state.name, t)}
                        subtitle={`${t('HUDUMA YAKO', 'YOUR CARE')} · ${t(...selected.title)}`}
                        icons={HOME_ICONS}
                        heightFraction={0.36}
                     />
                     {/* Notification + profile buttons pinned to top-right */}
                     <View style={[styles.heroActions, { top: insets.top + 12 }]}>
                        <Pressable
                           accessibilityRole='button'
                           accessibilityLabel={t('Taarifa', 'Notifications')}
                           onPress={() => go('/notifications')}
                           style={({ pressed }) => [styles.heroBtn, { opacity: pressed ? 0.65 : 1 }]}
                        >
                           <Icon name='notifications-outline' size={20} color='rgba(255,255,255,0.9)' />
                        </Pressable>
                        <Pressable
                           accessibilityRole='button'
                           accessibilityLabel={t('Wasifu wangu', 'My profile')}
                           onPress={() => go('/profile')}
                           style={({ pressed }) => [styles.heroBtn, { opacity: pressed ? 0.65 : 1 }]}
                        >
                           <Icon name='person-outline' size={20} color='rgba(255,255,255,0.9)' />
                        </Pressable>
                     </View>
                  </View>
               );
            })()}

            {/* Quick actions */}
            <View style={styles.section}>
               <SectionHeader label={t('Hatua za haraka', 'Quick actions')} />
            </View>
            <ScrollView
               horizontal
               showsHorizontalScrollIndicator={false}
               contentContainerStyle={styles.quickTrack}
            >
               {QUICK_ACTIONS.map((a) => (
                  <QuickActionBtn key={a.href} action={a} t={t} />
               ))}
            </ScrollView>

            {/* Next appointment */}
            <DataBoundary>
               {next ? (
                  <View style={styles.section}>
                     <SectionHeader
                        label={t('Miadi inayokuja', 'Upcoming visit')}
                        actionLabel={t('Zote', 'See all')}
                        onAction={() => go('/appointments')}
                     />
                     <AppointmentCard appointment={next} />
                  </View>
               ) : (
                  <View style={styles.section}>
                     <SectionHeader label={t('Miadi inayokuja', 'Upcoming visit')} />
                     <Pressable
                        accessibilityRole='button'
                        onPress={() => go(`/booking?service=${selected.id}`)}
                        style={({ pressed }) => [
                           styles.bookingPrompt,
                           { backgroundColor: colors.surfaceContainerLow, borderColor: colors.outlineVariant, opacity: pressed ? 0.8 : 1 },
                        ]}
                     >
                        <View style={[styles.bookingIcon, { backgroundColor: colors.primaryContainer }]}>
                           <Icon name='calendar-outline' size={24} />
                        </View>
                        <View style={{ flex: 1, gap: 2 }}>
                           <Txt kind='heading'>{t('Weka miadi yako', 'Book your visit')}</Txt>
                           <Txt kind='body' color={colors.onSurfaceVariant}>
                              {t('Panga wakati wako na kliniki.', 'Schedule time with the clinic.')}
                           </Txt>
                        </View>
                        <Icon name='chevron-forward' size={20} color={colors.onSurfaceVariant} />
                     </Pressable>
                  </View>
               )}
            </DataBoundary>

            {/* Your care service */}
            <View style={styles.section}>
               <SectionHeader
                  label={t('Huduma yako', 'Your care')}
                  actionLabel={t('Badilisha', 'Change')}
                  onAction={() => go('/service-selection')}
               />
               <ServiceCard
                  id={selected.id}
                  title={t(...selected.title)}
                  description={t(...selected.description)}
                  t={t}
               />
            </View>

            {/* Other services */}
            <View style={styles.section}>
               <SectionHeader
                  label={t('Huduma nyingine', 'Other services')}
               />
               <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalTrack}
               >
                  {otherServices.map((s) => (
                     <View key={s.id} style={{ width: width * 0.82, height: 200 }}>
                        <ServiceCard
                           id={s.id}
                           title={t(...s.title)}
                           description={t(...s.description)}
                           t={t}
                        />
                     </View>
                  ))}
               </ScrollView>
            </View>

            {/* Check-in nudge (non-child) */}
            {state.path !== 'child' && (
               <View style={styles.section}>
                  <Pressable
                     accessibilityRole='button'
                     onPress={() => go('/check-in')}
                     style={({ pressed }) => [
                        styles.checkinCard,
                        { backgroundColor: brand.orange, opacity: pressed ? 0.85 : 1 },
                     ]}
                  >
                     {/* decorative blobs */}
                     <View style={styles.checkinBlob1} />
                     <View style={styles.checkinBlob2} />
                     {/* icon badge */}
                     <View style={styles.checkinIconWrap}>
                        <HugeiconsIcon icon={HeartCheckIcon} size={32} color={brand.deep} strokeWidth={1.5} />
                     </View>
                     {/* text */}
                     <View style={styles.checkinBody}>
                        <Txt kind='heading' color={brand.deep}>
                           {t('Unajisikiaje leo?', 'How are you feeling today?')}
                        </Txt>
                        <Txt kind='body' color={`${brand.deep}99`}>
                           {t('Hiari · dakika 1', 'Optional · 1 min')}
                        </Txt>
                     </View>
                     {/* caret */}
                     <View style={styles.checkinCaret}>
                        <Icon name='arrow-forward-outline' size={18} color={brand.deep} />
                     </View>
                  </Pressable>
               </View>
            )}

            {/* Learn */}
            <View style={styles.section}>
               <SectionHeader
                  label={t('Jifunze', 'Learn')}
                  actionLabel={t('Zote', 'See all')}
                  onAction={() => go('/learn')}
               />
               <LearnCard
                  id={selectedLesson.id}
                  title={t(...selectedLesson.title)}
                  summary={t(...selectedLesson.summary)}
                  index={0}
                  t={t}
               />
               <View style={styles.learnRow}>
                  {otherLessons.map((l, i) => (
                     <View key={l.id} style={{ flex: 1 }}>
                        <LearnCard
                           id={l.id}
                           title={t(...l.title)}
                           summary={t(...l.summary)}
                           index={i + 1}
                           t={t}
                        />
                     </View>
                  ))}
               </View>
            </View>

            {/* Journey / child shortcut */}
            <View style={styles.section}>
               <Pressable
                  accessibilityRole='button'
                  onPress={() => go(state.path === 'child' ? '/child' : '/journey')}
                  style={({ pressed }) => [
                     styles.journeyCard,
                     { backgroundColor: brand.deep, opacity: pressed ? 0.85 : 1 },
                  ]}
               >
                  <View style={styles.journeyDeco} />
                  <View style={{ flex: 1, gap: 6 }}>
                     <Txt kind='heading' color={material.light.onPrimary}>
                        {state.path === 'child'
                           ? t('Wasifu wa mtoto', 'Child profile')
                           : t('Safari yangu', 'My journey')}
                     </Txt>
                     <Txt kind='body' color='rgba(255,255,255,0.6)'>
                        {state.path === 'child'
                           ? t('Angalia maelezo ya mtoto wako.', "View your child's details.")
                           : t('Fuatilia maendeleo yako ya afya.', 'Track your health progress.')}
                     </Txt>
                  </View>
                  <Icon name='arrow-forward-outline' size={20} color='rgba(255,255,255,0.7)' />
               </Pressable>
            </View>
         </ScrollView>
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   screen: { flex: 1 },
   scroll: { paddingBottom: 32 },

   heroActions: {
      position: 'absolute',
      right: spacing.lg,
      flexDirection: 'row',
      gap: spacing.sm,
   },
   heroBtn: {
      width: 36,
      height: 36,
      borderRadius: radii.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.28)',
   },

   // Quick actions
   section: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing['2xl'],
      gap: spacing.md,
   },
   sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
   },
   quickTrack: {
      flexDirection: 'row',
      gap: spacing.sm,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
   },
   quickBtn: {
      width: 104,
      borderRadius: radii['2xl'],
      padding: spacing.md,
      alignItems: 'center',
      gap: spacing.sm,
      minHeight: 88,
      justifyContent: 'center',
   },
   quickIcon: {
      width: 40,
      height: 40,
      borderRadius: radii.pill,
      alignItems: 'center',
      justifyContent: 'center',
   },

   // Booking prompt
   bookingPrompt: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      padding: spacing.lg,
      borderRadius: radii['2xl'],
      borderWidth: 1,
   },
   bookingIcon: {
      width: 48,
      height: 48,
      borderRadius: radii.xl,
      alignItems: 'center',
      justifyContent: 'center',
   },

   // Service card
   serviceCard: {
      flex: 1,
      borderRadius: radii['3xl'],
      overflow: 'hidden',
   },
   serviceCardInner: {
      flex: 1,
      minHeight: 180,
      padding: spacing['2xl'],
      justifyContent: 'flex-end',
      gap: spacing.sm,
   },
   serviceWatermark: {
      position: 'absolute',
      top: spacing.md,
      right: spacing.md,
      opacity: 0.18,
   },
   serviceBody: { gap: 4 },

   // Horizontal scroll
   horizontalTrack: {
      gap: spacing.md,
      paddingRight: spacing.lg,
   },

   // Check-in
   checkinCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      padding: spacing.xl,
      borderRadius: radii['3xl'],
      overflow: 'hidden',
      minHeight: 96,
   },
   checkinBlob1: {
      position: 'absolute',
      width: 140,
      height: 140,
      borderRadius: radii.pill,
      backgroundColor: 'rgba(255,255,255,0.18)',
      top: -50,
      right: -30,
   },
   checkinBlob2: {
      position: 'absolute',
      width: 80,
      height: 80,
      borderRadius: radii.pill,
      backgroundColor: 'rgba(255,255,255,0.12)',
      bottom: -20,
      right: 60,
   },
   checkinIconWrap: {
      width: 56,
      height: 56,
      borderRadius: radii.xl,
      backgroundColor: 'rgba(255,255,255,0.30)',
      alignItems: 'center',
      justifyContent: 'center',
   },
   checkinBody: {
      flex: 1,
      gap: 3,
   },
   checkinCaret: {
      width: 32,
      height: 32,
      borderRadius: radii.pill,
      backgroundColor: 'rgba(255,255,255,0.25)',
      alignItems: 'center',
      justifyContent: 'center',
   },

   // Learn
   learnCard: {
      flex: 1,
      padding: spacing.lg,
      borderRadius: radii['2xl'],
      gap: spacing.sm,
   },
   learnRow: {
      flexDirection: 'row',
      gap: spacing.sm,
   },

   // Journey
   journeyCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      padding: spacing.xl,
      borderRadius: radii['3xl'],
      overflow: 'hidden',
   },
   journeyDeco: {
      position: 'absolute',
      width: 160,
      height: 160,
      borderRadius: radii.pill,
      backgroundColor: 'rgba(255,255,255,0.05)',
      top: -40,
      right: -40,
   },
});
