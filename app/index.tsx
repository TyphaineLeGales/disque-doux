import '../global.css';

import { useRouter } from 'expo-router';
import { useEffect, useState, useRef } from 'react';

import { LoadingScreen } from '@/components/LoadingScreen';
import { useUserStore } from '@/stores/userStore';
import 'react-native-reanimated';

export default function Home() {
  const router = useRouter();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const loadingSpeed = useRef(2);
  const { isFirstTime } = useUserStore();

  const timer = useRef<NodeJS.Timeout | string>('');
  useEffect(() => {
    if (loadingProgress < 1) {
      timer.current = setTimeout(
        () => setLoadingProgress(loadingProgress + 0.1 * loadingSpeed.current),
        1500
      );
    } else {
      if (!isFirstTime) {
        router.push('(tabs)');
      } else {
        router.push('/tutoriel');
      }
    }
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [loadingProgress]);
  return <LoadingScreen progressValue={loadingProgress} />;
}
