/**
 * Session store — auth state that must survive app restarts.
 * Persisted via MMKV (native) / localStorage (web).
 */
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Country } from '@/components/ui/CountrySelector';
import { countries } from '@/lib/countries';
import { zustandStorage } from './storage';

const defaultCountry = (): Country =>
   countries.find((c) => c.name === 'Tanzania') ?? countries[0];

export type SessionState = {
   phone: string;
   selectedCountry: Country;
   sentAt: number;
   signedIn: boolean;
   welcomeSeen: boolean;
};

type SessionActions = {
   patch: (partial: Partial<SessionState>) => void;
   reset: () => void;
};

const initial = (): SessionState => ({
   phone: '',
   selectedCountry: defaultCountry(),
   sentAt: 0,
   signedIn: false,
   welcomeSeen: false,
});

export const useSessionStore = create<SessionState & SessionActions>()(
   persist(
      (set) => ({
         ...initial(),
         patch: (partial) => set((s) => ({ ...s, ...partial })),
         reset: () => set(initial()),
      }),
      {
         name: 'wajamama.session.v1',
         storage: createJSONStorage(() => zustandStorage),
      },
   ),
);
