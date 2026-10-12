/**
 * Preferences store — language, onboarding flags, and consent records.
 * Language + onboarding progress survive sign-out; consents reset on sign-out.
 */
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Language } from '@/i18n';
import type { Consent } from '@/types/domain';
import { zustandStorage } from './storage';

const VALID_PURPOSES = new Set<Consent['purpose']>([
   'terms',
   'ai',
   'previews',
   'group',
]);

export type PrefsState = {
   language: Language;
   languageChosen: boolean;
   introComplete: boolean;
   showTabLabels: boolean;
   consents: Consent[];
   /** Derived: true when ai consent is granted */
   ai: boolean;
   /** Derived: true when previews consent is granted */
   previews: boolean;
};

type PrefsActions = {
   setLanguage: (language: Language) => void;
   completeIntro: () => void;
   setShowTabLabels: (show: boolean) => void;
   /** Record a consent event and update derived ai/previews flags */
   addConsent: (event: Consent) => void;
   /**
    * Partial sign-out reset: clears consents but preserves language and
    * onboarding completion so the user isn't forced through intro again.
    */
   resetConsents: () => void;
};

const initial = (): PrefsState => ({
   language: 'sw',
   languageChosen: false,
   introComplete: false,
   showTabLabels: false,
   consents: [],
   ai: false,
   previews: false,
});

export const usePrefsStore = create<PrefsState & PrefsActions>()(
   persist(
      (set, get) => ({
         ...initial(),

         setLanguage: (language) => set({ language, languageChosen: true }),
         completeIntro: () => set({ introComplete: true }),
         setShowTabLabels: (showTabLabels) => set({ showTabLabels }),

         addConsent: (event) => {
            const previous = get().consents.filter(
               (c) => c.purpose !== event.purpose,
            );
            set({
               consents: [...previous, event],
               ...(event.purpose === 'ai' ? { ai: event.granted } : {}),
               ...(event.purpose === 'previews'
                  ? { previews: event.granted }
                  : {}),
            });
         },

         resetConsents: () =>
            set({
               consents: [],
               ai: false,
               previews: false,
            }),
      }),
      {
         name: 'wajamama.prefs.v1',
         storage: createJSONStorage(() => zustandStorage),
         onRehydrateStorage: () => (state) => {
            if (!state) return;
            // Validate consents to guard against corrupt / outdated data
            state.consents = state.consents.filter(
               (c): c is Consent =>
                  !!c &&
                  c.version === '1' &&
                  VALID_PURPOSES.has(c.purpose) &&
                  typeof c.granted === 'boolean' &&
                  typeof c.at === 'string',
            );
            // Re-derive flags after validation
            state.ai = state.consents.some(
               (c) => c.purpose === 'ai' && c.granted,
            );
            state.previews = state.consents.some(
               (c) => c.purpose === 'previews' && c.granted,
            );
         },
      },
   ),
);
