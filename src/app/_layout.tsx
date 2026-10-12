import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider, useApp } from '@/providers/AppProvider';
import { fonts } from '@/theme/fonts';
import { useAppColorScheme, useMaterialTheme } from '@/theme/use-theme-colors';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

void SplashScreen.preventAutoHideAsync();
if (typeof SplashScreen.setOptions === 'function') {
   try { SplashScreen.setOptions({ fade: true, duration: 350 }); } catch {}
}

export default function RootLayout() {
   const [loaded, error] = useFonts({
      [fonts.regular]: require('../../assets/geist/Geist-Regular.ttf'),
      [fonts.medium]: require('../../assets/geist/Geist-Medium.ttf'),
      [fonts.semibold]: require('../../assets/geist/Geist-SemiBold.ttf'),
      [fonts.bold]: require('../../assets/geist/Geist-Bold.ttf'),
      [fonts.light]: require('../../assets/geist/Geist-Light.ttf'),
   });
   return (
      <GestureHandlerRootView style={{ flex: 1 }}>
         <AppProvider>
            <BottomSheetModalProvider>
               <Navigation fontsReady={loaded || !!error} />
            </BottomSheetModalProvider>
         </AppProvider>
      </GestureHandlerRootView>
   );
}

function Navigation({ fontsReady }: { fontsReady: boolean }) {
   const { ready } = useApp();
   const scheme = useAppColorScheme();
   const colors = useMaterialTheme();

   useEffect(() => {
      if (fontsReady && ready) void SplashScreen.hideAsync();
   }, [fontsReady, ready]);

   if (!fontsReady || !ready) return null;

   return (
      <>
         <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
         <Stack
            screenOptions={{
               headerShown: false,
               contentStyle: { backgroundColor: colors.background },
            }}
         />
      </>
   );
}
