import '../global.css';

import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
