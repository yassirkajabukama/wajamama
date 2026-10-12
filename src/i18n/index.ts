export type Language = 'sw' | 'en';
export type Copy = readonly [string, string];
export const translate = (language: Language, sw: string, en: string) =>
  language === 'sw' ? sw : en;
export function dateLabel(iso: string, language: Language, time = true) {
  return new Intl.DateTimeFormat(language === 'sw' ? 'sw-TZ' : 'en-GB', {
    timeZone: 'Africa/Dar_es_Salaam',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    ...(time
      ? { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' as const }
      : {}),
  }).format(new Date(iso));
}
