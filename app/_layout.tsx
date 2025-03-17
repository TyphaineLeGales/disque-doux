import '../global.css';
import { Stack } from 'expo-router';
import { DevTools } from '@/components/DevTools';
import Constants from 'expo-constants';
// import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function Layout() {
  const isDev = Constants.expoConfig?.extra?.isDevelopment;
  
  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      {isDev && <DevTools />}
    </>
  );
}
