import { useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Rive, { Fit, RiveRef } from 'rive-react-native';

import { useUserStore } from '@/stores/userStore';

export const Timeline = () => {
  const riveComponentRef = useRef<RiveRef>(null);
  const { levelCompleted } = useUserStore(); // persisted state

  useEffect(() => {
    if (riveComponentRef.current) {
      riveComponentRef.current.setInputState('main', 'levelDone', levelCompleted);
    }
  }, [riveComponentRef.current]);
  return (
    <SafeAreaView className="flex-1 items-center justify-center ">
      <Rive
        ref={riveComponentRef}
        resourceName="timeline"
        fit={Fit.Contain}
        style={{
          width: '75%',
        }}
        stateMachineName="main"
      />
    </SafeAreaView>
  );
};
