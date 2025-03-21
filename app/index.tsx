import '../global.css';

import { useRouter } from 'expo-router';
import React, { useEffect, useState, useRef } from 'react';

import { LoadingScreen } from '@/components/LoadingScreen';
import { useUserStore } from '@/stores/userStore';
import 'react-native-reanimated';

export default function Home() {
  const router = useRouter();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const loadingSpeed = useRef(2);
  const { isFirstTime } = useUserStore();
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    console.log('Current isFirstTime state:', isFirstTime);
  }, [isFirstTime]);

  useEffect(() => {
    if (loadingProgress < 1) {
      timer.current = setTimeout(
        () => setLoadingProgress(loadingProgress + 0.1 * loadingSpeed.current),
        1500
      );
    } else {
      setTimeout(() => {
        router.replace(isFirstTime ? '/tutoriel' : '/start');
      }, 100);
    }

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [loadingProgress, isFirstTime]);

  return <LoadingScreen progressValue={loadingProgress} />;
}
