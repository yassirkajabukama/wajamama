/**
 * Zustand storage adapter — native build (MMKV v3, JSI-based).
 * MMKV reads/writes are synchronous, so Zustand stores are hydrated
 * before the first render — no async flicker, no NDK extras required.
 */
import { MMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';

const mmkv = new MMKV({ id: 'wajamama.store' });

export const zustandStorage: StateStorage = {
   getItem: (key) => mmkv.getString(key) ?? null,
   setItem: (key, value) => mmkv.set(key, value),
   removeItem: (key) => mmkv.delete(key),
};
