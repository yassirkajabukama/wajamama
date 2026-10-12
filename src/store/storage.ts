/**
 * Zustand storage adapter — web build (localStorage).
 * The native build uses storage.native.ts (MMKV).
 */
import type { StateStorage } from 'zustand/middleware';

export const zustandStorage: StateStorage = {
   getItem: (key) =>
      typeof window !== 'undefined' ? window.localStorage.getItem(key) : null,
   setItem: (key, value) => {
      if (typeof window !== 'undefined') window.localStorage.setItem(key, value);
   },
   removeItem: (key) => {
      if (typeof window !== 'undefined') window.localStorage.removeItem(key);
   },
};
