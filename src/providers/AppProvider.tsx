/**
 * AppProvider — thin context bridge between Zustand stores and screens.
 *
 * All persistent state now lives in Zustand (MMKV on native, localStorage
 * on web).  This provider composes the stores into the familiar `useApp()`
 * shape so existing screens need zero changes.
 *
 * Store layout
 * ─────────────────────────────────────────────────────────────────────────
 *  useSessionStore  phone · selectedCountry · sentAt · signedIn · welcomeSeen
 *  useProfileStore  name · path (care service)
 *  usePrefsStore    language · introComplete · showTabLabels · consents · ai · previews
 *  useAppDataStore  appointments · membership · likedLessons · etc.
 */
import type { Country } from '@/components/ui/CountrySelector';
import type { Language } from '@/i18n';
import { translate } from '@/i18n';
import { nextEntryRoute } from '@/lib/entry-flow';
import { DemoBookingEngine } from '@/mocks/booking-engine';
import {
   useAppDataStore,
   usePrefsStore,
   useProfileStore,
   useSessionStore,
} from '@/store';
import type { Appointment, Consent, Membership, Post } from '@/types/domain';
import React, {
   createContext,
   useContext,
   useMemo,
   useRef,
   useState,
} from 'react';

// ── Public DemoState type (unchanged — all screens reference this) ─────────────

export type DemoState = {
   signedIn: boolean;
   welcomeSeen: boolean;
   phone: string;
   sentAt: number;
   name: string;
   path: string;
   ai: boolean;
   previews: boolean;
   sharedDevice: boolean;
   appointments: Appointment[];
   likedLessons: string[];
   membership: Membership;
   rsvp: boolean;
   posts: Post[];
   questions: { body: string; private: boolean }[];
   checkin?: { mood: string; note: string };
   handoff?: { reason: string; channel: string; status: 'requested' };
   dependents: string[];
   consents: Consent[];
   read: boolean;
   muted: boolean;
   selectedCountry: Country;
};

// ── Keys that belong to each store ───────────────────────────────────────────

const SESSION_KEYS = new Set<keyof DemoState>([
   'phone',
   'selectedCountry',
   'sentAt',
   'signedIn',
   'welcomeSeen',
]);

const PROFILE_KEYS = new Set<keyof DemoState>(['name', 'path']);

// ai / previews / consents are managed via consent() → addConsent()
// but we still accept direct patches for backwards compat
const PREFS_KEYS = new Set<keyof DemoState>(['ai', 'previews', 'consents']);

// ── Core hook ─────────────────────────────────────────────────────────────────

function useAppState() {
   // ── Store subscriptions ──────────────────────────────────────────────────
   const session = useSessionStore();
   const profile = useProfileStore();
   const prefs = usePrefsStore();
   const appData = useAppDataStore();

   // ── Non-persisted runtime state ──────────────────────────────────────────
   const [offline, setOffline] = useState(false);
   const [simulateError, setSimulateError] = useState(false);
   const [engine] = useState(() => new DemoBookingEngine());

   // ── Translation ──────────────────────────────────────────────────────────
   const language = prefs.language;
   const t = useMemo(
      () => (sw: string, en: string) => translate(language, sw, en),
      [language],
   );

   // ── Composed DemoState (read-only snapshot) ──────────────────────────────
   const state: DemoState = useMemo(
      () => ({
         // session
         phone: session.phone,
         selectedCountry: session.selectedCountry,
         sentAt: session.sentAt,
         signedIn: session.signedIn,
         welcomeSeen: session.welcomeSeen,
         // profile
         name: profile.name,
         path: profile.path,
         // prefs (derived)
         ai: prefs.ai,
         previews: prefs.previews,
         consents: prefs.consents,
         // app data
         sharedDevice: appData.sharedDevice,
         appointments: appData.appointments,
         likedLessons: appData.likedLessons,
         membership: appData.membership,
         rsvp: appData.rsvp,
         posts: appData.posts,
         questions: appData.questions,
         checkin: appData.checkin,
         handoff: appData.handoff,
         dependents: appData.dependents,
         read: appData.read,
         muted: appData.muted,
      }),
      [session, profile, prefs, appData],
   );

   // ── update() — routes patch fields to the correct store ──────────────────
   const update = (patch: Partial<DemoState>) => {
      const sessionPatch: Record<string, unknown> = {};
      const profilePatch: Record<string, unknown> = {};
      const appDataPatch: Record<string, unknown> = {};

      for (const [k, v] of Object.entries(patch) as [keyof DemoState, unknown][]) {
         if (SESSION_KEYS.has(k)) sessionPatch[k] = v;
         else if (PROFILE_KEYS.has(k)) profilePatch[k] = v;
         else if (!PREFS_KEYS.has(k)) appDataPatch[k] = v;
      }

      if (Object.keys(sessionPatch).length)
         useSessionStore.setState(sessionPatch as never);
      if (Object.keys(profilePatch).length)
         useProfileStore.setState(profilePatch as never);
      if (Object.keys(appDataPatch).length)
         useAppDataStore.setState(appDataPatch as never);
   };

   // setState kept for backwards compat (update() is preferred)
   const setState = (
      next: DemoState | ((prev: DemoState) => DemoState),
   ) => {
      const value = typeof next === 'function' ? next(state) : next;
      update(value);
   };

   // ── Consent recording ─────────────────────────────────────────────────────
   const consent = (purpose: Consent['purpose'], granted: boolean) => {
      prefs.addConsent({
         purpose,
         granted,
         version: '1',
         at: new Date().toISOString(),
      });
   };

   // ── Preferences helpers ───────────────────────────────────────────────────
   const setLanguage = (value: Language) => prefs.setLanguage(value);
   const completeIntro = () => prefs.completeIntro();
   const setShowTabLabels = (show: boolean) => prefs.setShowTabLabels(show);

   // ── Sync appointments from engine ─────────────────────────────────────────
   const sync = () => appData.patch({ appointments: engine.list() });

   // ── Sign-out: wipe all user data, preserve language + intro ──────────────
   const signOut = () => {
      engine.clear();
      useSessionStore.getState().reset();
      useProfileStore.getState().reset();
      useAppDataStore.getState().reset();
      usePrefsStore.getState().resetConsents();
      setOffline(false);
      setSimulateError(false);
   };

   // ── Entry (backwards compat shape expected by consent / onboarding) ───────
   const entry = useMemo(
      () => ({
         language: prefs.language,
         languageChosen: prefs.languageChosen,
         introComplete: prefs.introComplete,
         showTabLabels: prefs.showTabLabels,
         consents: prefs.consents,
      }),
      [prefs],
   );

   // ── Entry route ───────────────────────────────────────────────────────────
   const termsGranted = prefs.consents.some(
      (c) => c.purpose === 'terms' && c.granted && c.version === '1',
   );
   const entryRoute = nextEntryRoute({
      languageChosen: prefs.languageChosen,
      introComplete: prefs.introComplete,
      termsGranted,
      signedIn: session.signedIn,
      otpPending: !!session.sentAt,
      welcomeSeen: session.welcomeSeen,
      service: profile.path,
   });

   return {
      // With MMKV (sync) stores are hydrated before first render — always ready.
      // The useState lazy initialiser guarantees this check runs synchronously.
      ready: true,
      entryRoute,
      entry,
      state,
      setState,
      update,
      language,
      setLanguage,
      completeIntro,
      setShowTabLabels,
      t,
      engine,
      sync,
      consent,
      signOut,
      offline,
      setOffline,
      simulateError,
      setSimulateError,
   };
}

// ── Context ───────────────────────────────────────────────────────────────────

const Context = createContext<ReturnType<typeof useAppState> | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
   const value = useAppState();
   return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useApp() {
   const value = useContext(Context);
   if (!value) throw new Error('useApp must be used inside <AppProvider>');
   return value;
}
