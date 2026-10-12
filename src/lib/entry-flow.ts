export type EntryStage = {
  languageChosen: boolean;
  introComplete: boolean;
  termsGranted: boolean;
  signedIn: boolean;
  otpPending: boolean;
  welcomeSeen: boolean;
  service: string;
};

/** The order is intentional: optional care choices are never inferred from login. */
export function nextEntryRoute(stage: EntryStage): '/language' | '/onboarding' | '/consent' | '/login' | '/otp' | '/welcome' | '/service-selection' | '/(tabs)/home' {
  if (!stage.languageChosen) return '/language';
  if (!stage.introComplete) return '/onboarding';
  if (!stage.termsGranted) return '/consent';
  if (!stage.signedIn) return stage.otpPending ? '/otp' : '/login';
  if (!stage.welcomeSeen) return '/welcome';
  if (!stage.service) return '/service-selection';
  return '/(tabs)/home';
}
