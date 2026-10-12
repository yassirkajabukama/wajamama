import { useState } from 'react';
import { Linking } from 'react-native';
import { router } from 'expo-router';
import { ActionGroup, ActionRow } from '@/components/ui/ActionGroup';
import { Button, Card, Field, Notice, Screen, Txt, Access } from '@/components/ui/kit';
import { useApp } from '@/providers/AppProvider';
import { useThemeColors } from '@/theme/use-theme-colors';

export function Profile() {
  const colors=useThemeColors();
  const {state,update,t,language,setLanguage,signOut}=useApp();
  const [name,setName]=useState(state.name);
  return <Access><Screen back title={t('Wasifu wangu','My profile')}>
    <Card tone={colors.lavender}><Txt kind="heading">{state.name||t('Rafiki wa Wajamama','Wajamama friend')}</Txt><Txt>{t('Akaunti ya mfano · hakuna taarifa halisi','Demo account · no real account data')}</Txt></Card>
    <Notice>{t('Hizi ni huduma za mfano. Uchaguzi wa huduma hauandikishi mtu kwenye kliniki wala kutuma taarifa yoyote.', 'These are sample services. Choosing one does not enroll anyone at a clinic or send information.')}</Notice>
    <Field label={t('Jina unalopendelea','Preferred name')} value={name} onChangeText={setName} maxLength={50}/>
    <Button secondary label={t('Hifadhi jina','Save name')} onPress={()=>update({name:name.trim()})}/>
    <ActionGroup title={t('LUGHA','LANGUAGE')}>
      <ActionRow label="Kiswahili" icon="language-outline" selected={language==='sw'} onPress={()=>setLanguage('sw')}/>
      <ActionRow label="English" icon="language-outline" selected={language==='en'} onPress={()=>setLanguage('en')}/>
    </ActionGroup>
    <ActionGroup title={t('HUDUMA YANGU','MY CARE')}>
      <ActionRow label={t('Badilisha huduma','Change care')} icon="heart-outline" href="/service-selection"/>
      <ActionRow label={t('Watoto na walezi','Children and guardians')} icon="happy-outline" href="/child"/>
    </ActionGroup>
    <ActionGroup title={t('MIPANGILIO NA MSAADA','SETTINGS AND HELP')}>
      <ActionRow label={t('Faragha na mipangilio','Privacy and settings')} icon="shield-checkmark-outline" href="/profile/privacy"/>
      <ActionRow label={t('Taarifa','Notifications')} icon="notifications-outline" href="/notifications"/>
      <ActionRow label={t('Msaada','Help')} icon="help-circle-outline" href="/urgent-help"/>
    </ActionGroup>
    <ActionGroup><ActionRow label={t('Toka kwenye mfano','Sign out of demo')} icon="log-out-outline" destructive onPress={()=>{signOut();router.replace('/');}}/></ActionGroup>
  </Screen></Access>;
}

export function Privacy() {
  const colors=useThemeColors();
  const {entry,state,update,consent,t,setShowTabLabels,offline,setOffline,simulateError,setSimulateError}=useApp();
  const [requested,setRequested]=useState('');
  return <Screen back title={t('Faragha na mipangilio','Privacy and settings')}>
    <Notice>{t('Taarifa za huduma za mfano hukaa kwenye kumbukumbu ya kikao tu. Lugha, hatua za utangulizi na idhini za mfano huhifadhiwa kwenye kifaa; kutoka huondoa idhini. Hakuna data inayotumwa kwa AI, kliniki au Supabase.','Demo care data stays in session memory. Language, intro progress, and demo choices are stored on this device; signing out clears consent. Nothing is sent to AI, the clinic, or Supabase.')}</Notice>
    <ActionGroup title={t('MUONEKANO','APPEARANCE')}>
      <ActionRow label={t('Onyesha majina kwenye upau wa chini','Show tab labels')} icon="text-outline" value={entry.showTabLabels} onToggle={setShowTabLabels}/>
    </ActionGroup>
    <ActionGroup title={t('CHAGUO ZA FARAGHA','PRIVACY CHOICES')}>
      <ActionRow label={t('Ruhusu AI ya mfano','Allow demo AI')} icon="sparkles-outline" value={state.ai} onToggle={v=>consent('ai',v)}/>
      <ActionRow label={t('Onyesha maelezo kwenye arifa','Show notification details')} icon="notifications-outline" value={state.previews} onToggle={v=>consent('previews',v)}/>
      <ActionRow label={t('Simu ya pamoja: ficha maelezo','Shared phone: hide details')} icon="phone-portrait-outline" value={state.sharedDevice} onToggle={sharedDevice=>update({sharedDevice})}/>
    </ActionGroup>
    <Card tone={colors.mint}><Txt kind="heading">{t('Kumbukumbu na haki zako','Your records and choices')}</Txt><Txt>{t('Kuondoa idhini huzuia matumizi ya hiari ya baadaye. Data ya huduma halisi, ikiwa ipo, inaweza kufuata mahitaji yaliyoidhinishwa ya uhifadhi.','Withdrawing consent stops future optional processing. Real care records, if any, may be subject to approved retention obligations.')}</Txt></Card>
    <ActionGroup title={t('MAOMBI YA MFANO','DEMO REQUESTS')}>
      <ActionRow label={t('Omba nakala ya data','Request data export')} icon="download-outline" onPress={()=>setRequested('export')}/>
      <ActionRow label={t('Omba kufutwa','Request deletion')} icon="trash-outline" destructive onPress={()=>setRequested('delete')}/>
    </ActionGroup>
    {requested&&<Notice>{t('Ombi la mfano limeandikwa hapa tu; halijatumwa kwa timu.','Demo request recorded here only; it was not sent to a team.')}</Notice>}
    <Txt>{t('Maandishi makubwa na kupunguza mwendo vinadhibitiwa na mipangilio ya kifaa chako.','Large text and reduced motion are controlled in your device settings.')}</Txt>
    <ActionGroup title={t('HALI ZA MAJARIBIO','PREVIEW STATES')}>
      <ActionRow label={t('Nje ya mtandao · mfano','Offline · demo')} icon="cloud-offline-outline" value={offline} onToggle={setOffline}/>
      <ActionRow label={t('Kosa la kupakia · mfano','Loading error · demo')} icon="alert-circle-outline" value={simulateError} onToggle={setSimulateError}/>
    </ActionGroup>
  </Screen>;
}

export function Notifications() {
  const colors=useThemeColors();
  const {state,update,t}=useApp();
  const hasAppointment=state.appointments.some(a=>a.status==='confirmed');
  return <Access><Screen back title={t('Taarifa','Notifications')}>
    <Notice>{t('Arifa za kifaa na vikumbusho vya seva hazijaunganishwa. Maelezo ya skrini iliyofungwa yamefichwa kwa chaguo-msingi.','Device notifications and server reminders are not connected. Lock-screen details are hidden by default.')}</Notice>
    {hasAppointment?<Card tone={colors.mint}><Txt kind="heading">{t('Una miadi katika mfano','You have a demo appointment')}</Txt><Txt>{state.read?t('Umeisoma','Read'):t('Mpya','New')}</Txt></Card>:<Card><Txt>{t('Hakuna taarifa bado.','No notifications yet.')}</Txt></Card>}
    <ActionGroup title={t('HATUA','ACTIONS')}>
      {hasAppointment&&<ActionRow label={t('Angalia miadi','View visits')} icon="calendar-outline" href="/appointments" onPress={()=>update({read:true})}/>}
      <ActionRow label={t('Mipangilio ya taarifa','Notification settings')} icon="options-outline" href="/profile/privacy"/>
    </ActionGroup>
  </Screen></Access>;
}

export function OfficialHelp() {
  const {t}=useApp();
  return <Screen back title={t('Tovuti rasmi','Official website')}>
    <Notice>{t('Utakuwa ukifungua tovuti nje ya programu. Hakikisha mawasiliano na ratiba ya sasa hapo.','You will open an external website. Check current contact details and hours there.')}</Notice>
    <ActionGroup>
      <ActionRow label={t('Fungua tovuti rasmi','Open official website')} icon="globe-outline" external onPress={()=>Linking.openURL('https://www.wajamama.com/')}/>
      <ActionRow label={t('Ukurasa wa miadi ya kliniki','Clinic appointment page')} icon="calendar-outline" external onPress={()=>Linking.openURL('https://www.wajamama.com/book-an-appointment')}/>
    </ActionGroup>
  </Screen>;
}
