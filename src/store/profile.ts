/**
 * Profile store — user identity that persists between sessions.
 * Keeps `name` (preferred username) and `path` (chosen care service).
 */
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandStorage } from './storage';

export type ProfileState = {
   name: string;
   path: string;
};

type ProfileActions = {
   patch: (partial: Partial<ProfileState>) => void;
   reset: () => void;
};

const initial = (): ProfileState => ({
   name: '',
   path: '',
});

export const useProfileStore = create<ProfileState & ProfileActions>()(
   persist(
      (set) => ({
         ...initial(),
         patch: (partial) => set((s) => ({ ...s, ...partial })),
         reset: () => set(initial()),
      }),
      {
         name: 'wajamama.profile.v1',
         storage: createJSONStorage(() => zustandStorage),
      },
   ),
);
