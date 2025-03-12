import '../global.css';

import { Stack } from 'expo-router';
import { useEffect, useState, useRef } from 'react';

import { LoadingScreen } from '@/components/LoadingScreen';
// import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function Layout() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const timer = useRef<NodeJS.Timeout | string>('');
  useEffect(() => {
    //setTimeout()
    if (loadingProgress < 1) {
      console.log(loadingProgress);
      timer.current = setTimeout(() => setLoadingProgress(loadingProgress + 0.1), 1500);
    }
  }, [loadingProgress]);
  return (
    <LoadingScreen progressValue={loadingProgress} />
    // <Stack>
    //   <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    //   <Stack.Screen name="+not-found" />
    // </Stack>
  );
}
