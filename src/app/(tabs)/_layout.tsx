import { NotchedTabBar } from '@/components/navigation/NotchedTabBar';
import { useApp } from '@/providers/AppProvider';
import { Redirect, Tabs } from 'expo-router';

export default function TabLayout() {
   const { t, ready, entryRoute } = useApp();

   if (!ready) return null;
   if (entryRoute !== '/(tabs)/home') return <Redirect href={entryRoute} />;

   return (
      <Tabs
         screenOptions={{ headerShown: false }}
         tabBar={(props) => <NotchedTabBar {...props} />}
      >
         <Tabs.Screen name='home' options={{ title: t('Mwanzo', 'Home') }} />
         <Tabs.Screen name='appointments' options={{ title: t('Miadi', 'Visits') }} />
         <Tabs.Screen name='assistant' options={{ title: t('Msaidizi', 'Assistant') }} />
         <Tabs.Screen name='pamoja' options={{ title: 'Pamoja' }} />
         <Tabs.Screen name='learn' options={{ title: t('Jifunze', 'Learn') }} />
      </Tabs>
   );
}
