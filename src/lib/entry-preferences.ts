import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import type { Language } from '@/i18n';
import type { Consent } from '@/types/domain';

const key = 'wajamama.demo.entry.v1';
export type EntryPreferences = {
  language: Language;
  languageChosen: boolean;
  introComplete: boolean;
  showTabLabels: boolean;
  consents: Consent[];
};
export const defaultEntryPreferences = (): EntryPreferences => ({
  language: 'sw', languageChosen: false, introComplete: false, showTabLabels: false, consents: [],
});

export async function readEntryPreferences(): Promise<EntryPreferences> {
  try {
    const raw = Platform.OS === 'web'
      ? (typeof window === 'undefined' ? null : window.localStorage.getItem(key))
      : await SecureStore.getItemAsync(key);
    if (!raw) return defaultEntryPreferences();
    const saved: unknown = JSON.parse(raw);
    if (!saved || typeof saved !== 'object') return defaultEntryPreferences();
    const value = saved as Partial<EntryPreferences>;
    return {
      language: value.language === 'en' ? 'en' : 'sw',
      languageChosen: value.languageChosen === true,
      introComplete: value.introComplete === true,
      showTabLabels: value.showTabLabels === true,
      consents: Array.isArray(value.consents)
        ? value.consents.filter((entry): entry is Consent =>
            !!entry && entry.version === '1' &&
            ['terms', 'ai', 'previews'].includes(entry.purpose) &&
            typeof entry.granted === 'boolean' && typeof entry.at === 'string')
        : [],
    };
  } catch {
    return defaultEntryPreferences();
  }
}

export async function writeEntryPreferences(value: EntryPreferences) {
  const raw = JSON.stringify(value);
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') window.localStorage.setItem(key, raw);
  } else {
    await SecureStore.setItemAsync(key, raw);
  }
}
