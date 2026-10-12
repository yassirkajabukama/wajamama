import { useState } from 'react';
import { Redirect, router } from 'expo-router';
import { Button, Screen, Toggle, Txt } from '@/components/ui/kit';
import { useApp } from '@/providers/AppProvider';

export default function ConsentScreen() {
  const { entry, consent, t, ready } = useApp();
  const [terms, setTerms] = useState(entry.consents.some(c => c.purpose === 'terms' && c.granted));
  if (!ready) return null;
  if (!entry.languageChosen) return <Redirect href="/language" />;
  if (!entry.introComplete) return <Redirect href="/onboarding" />;

  return (
    <Screen title={t('Faragha yako ni muhimu', 'Your privacy matters')}>

      <Txt kind="bodyLarge">
        {t(
          'Karibu Wajamama — jukwaa lililoundwa kwa ajili ya mama, watoto, na familia. Kabla ya kuendelea, tafadhali soma na kukubali masharti yetu ya huduma.',
          'Welcome to Wajamama — a platform built for mothers, children, and families. Before continuing, please read and accept our terms of service.',
        )}
      </Txt>

      <Txt kind="heading">{t('1. Data ya Kibinafsi', '1. Personal Data')}</Txt>
      <Txt>
        {t(
          'Namba ya simu ya kubuni hutumika kwa uthibitisho ndani ya programu tu — hakuna SMS inayotumwa, hakuna akaunti halisi inayoundwa. Jina unalochagua na mapendeleo yako huhifadhiwa kwenye kifaa hiki peke yake na hayapelekwi kwenye seva yoyote.',
          'A fictional phone number is used only for in-app verification — no SMS is sent, no real account is created. Your chosen name and preferences are stored on this device only and are never transmitted to any server.',
        )}
      </Txt>

      <Txt kind="heading">{t('2. Kikao na Uhifadhi', '2. Session & Storage')}</Txt>
      <Txt>
        {t(
          'Lugha uliyochagua, maendeleo ya utangulizi, na uchaguzi wako wa idhini huhifadhiwa kwenye hifadhi ya ndani ya kifaa. Taarifa zote za kikao — ikiwemo miadi ya kubuni, maswali, na dondoo — huondolewa moja kwa moja unapotoka.',
          'Your selected language, onboarding progress, and consent choices are stored in device-local storage. All session data — including fictional appointments, questions, and check-ins — is cleared automatically on sign-out.',
        )}
      </Txt>

      <Txt kind="heading">{t('3. Faragha na Usalama', '3. Privacy & Security')}</Txt>
      <Txt>
        {t(
          'Wajamama inaamini kwa dhati katika haki yako ya faragha. Katika toleo la uzalishaji, data yako yote ingehifadhiwa salama kulingana na kanuni za GDPR na sheria za hifadhi ya data za Tanzania. Mfano huu hauna ufikiaji wa kamera, eneo, au mawasiliano yako.',
          'Wajamama is deeply committed to your right to privacy. In a production release, all your data would be stored securely in compliance with GDPR principles and Tanzanian data protection regulations. This demo does not access your camera, location, or contacts.',
        )}
      </Txt>

      <Txt kind="heading">{t('4. Msaada wa AI (Hiari)', '4. AI Assistant (Optional)')}</Txt>
      <Txt>
        {t(
          'Mfano huu unajumuisha msaidizi wa AI kwa maelezo ya ziada ya kiafya. Matumizi ya msaidizi wa AI ni ya hiari kabisa — unaweza kuamsha au kuzima wakati wowote kutoka kwenye mipangilio ya faragha yako. Majibu ya AI hayawakilishi daktari au mtaalamu wa afya.',
          'This demo includes an AI assistant for additional health information. Use of the AI assistant is entirely optional — you can enable or disable it at any time from your privacy settings. AI responses do not represent a doctor or qualified health professional.',
        )}
      </Txt>

      <Txt kind="heading">{t('5. Haki Zako', '5. Your Rights')}</Txt>
      <Txt>
        {t(
          'Una haki ya kufikia, kusahihisha, au kufuta taarifa yoyote iliyohifadhiwa kwenye kifaa hiki wakati wowote. Unaweza kutoka kwenye programu na kufuta data yako yote kwa kubonyeza "Toka" kutoka kwenye skrini ya wasifu wako.',
          'You have the right to access, correct, or delete any information stored on this device at any time. You can sign out and clear all your data by tapping "Sign out" from your profile screen.',
        )}
      </Txt>

      <Toggle
        label={t(
          'Nimesoma na ninakubali masharti ya huduma (inahitajika)',
          'I have read and accept the terms of service (required)',
        )}
        value={terms}
        onChange={setTerms}
      />

      <Button
        disabled={!terms}
        label={t('Kubali na uendelee', 'Accept and continue')}
        onPress={() => { consent('terms', true); router.replace('/login'); }}
      />
    </Screen>
  );
}
