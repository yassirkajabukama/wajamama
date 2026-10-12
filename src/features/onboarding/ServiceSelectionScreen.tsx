import { Redirect, router } from 'expo-router';
import { Button, Screen } from '@/components/ui/kit';
import { SelectableServiceCard } from '@/components/ui/SelectableServiceCard';
import { services } from '@/mocks/catalog';
import { useApp } from '@/providers/AppProvider';
import { useCardPalette } from '@/theme/use-theme-colors';

const icons = ['flower-outline','happy-outline','heart-outline','leaf-outline'] as const;

export default function ServiceSelectionScreen() {
  const {state,update,t,ready}=useApp();
  const palette=useCardPalette();
  if(!ready)return null;
  if(!state.signedIn)return <Redirect href="/login"/>;
  if(!state.welcomeSeen)return <Redirect href="/welcome"/>;
  const selected=services.find(service=>service.category===state.path);
  return <Screen title={t('Unahitaji huduma gani?','Which care fits you?')} subtitle={t('Chagua huduma moja kuanza. Unaweza kuibadilisha wakati wowote.','Choose one to begin. You can change it anytime.')}>
    {services.map((service,index)=><SelectableServiceCard key={service.id} title={t(...service.title)} description={t(...service.description)} icon={icons[index]} tone={palette[index]} selected={state.path===service.category} onPress={()=>update({path:state.path===service.category?'':service.category})}/>)}
    <Button disabled={!selected} label={t('Endelea nyumbani','Continue to home')} onPress={()=>router.replace('/(tabs)/home')}/>
  </Screen>;
}
