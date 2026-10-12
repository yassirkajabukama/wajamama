/**
 * App-data store — in-session data: appointments, membership, liked
 * lessons, groups, check-in, etc. Persisted so the user doesn't lose
 * progress between app restarts; wiped on sign-out.
 */
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Appointment, Membership, Post } from '@/types/domain';
import { zustandStorage } from './storage';

export type AppDataState = {
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
   read: boolean;
   muted: boolean;
};

type AppDataActions = {
   patch: (partial: Partial<AppDataState>) => void;
   reset: () => void;
};

const initial = (): AppDataState => ({
   sharedDevice: true,
   appointments: [],
   likedLessons: [],
   membership: 'none',
   rsvp: false,
   posts: [],
   questions: [],
   dependents: [],
   read: false,
   muted: false,
   checkin: undefined,
   handoff: undefined,
});

export const useAppDataStore = create<AppDataState & AppDataActions>()(
   persist(
      (set) => ({
         ...initial(),
         patch: (partial) => set((s) => ({ ...s, ...partial })),
         reset: () => set(initial()),
      }),
      {
         name: 'wajamama.data.v1',
         storage: createJSONStorage(() => zustandStorage),
      },
   ),
);
