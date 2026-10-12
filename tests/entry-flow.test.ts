import { describe, expect, test } from 'bun:test';
import { nextEntryRoute, type EntryStage } from '../src/lib/entry-flow';

const completed: EntryStage = {
  languageChosen: true, introComplete: true, termsGranted: true,
  signedIn: true, otpPending: false, welcomeSeen: true, service: 'pregnancy',
};

describe('first-time entry order', () => {
  test('requires each first-time stage in sequence', () => {
    const stage = { ...completed };
    expect(nextEntryRoute({ ...stage, languageChosen: false })).toBe('/language');
    expect(nextEntryRoute({ ...stage, introComplete: false })).toBe('/onboarding');
    expect(nextEntryRoute({ ...stage, termsGranted: false })).toBe('/consent');
    expect(nextEntryRoute({ ...stage, signedIn: false })).toBe('/login');
    expect(nextEntryRoute({ ...stage, signedIn: false, otpPending: true })).toBe('/otp');
    expect(nextEntryRoute({ ...stage, welcomeSeen: false })).toBe('/welcome');
    expect(nextEntryRoute({ ...stage, service: '' })).toBe('/service-selection');
    expect(nextEntryRoute(stage)).toBe('/(tabs)/home');
  });

  test('a returning demo session skips intro but still requires login', () => {
    expect(nextEntryRoute({ ...completed, signedIn: false, welcomeSeen: false, service: '' })).toBe('/login');
    expect(nextEntryRoute({ ...completed, termsGranted: false, signedIn: false, welcomeSeen: false, service: '' })).toBe('/consent');
  });
});
