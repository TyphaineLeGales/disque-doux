import { useRouter } from 'expo-router';
import { useRef } from 'react';
import { SafeAreaView } from 'react-native';
import Rive, { Fit, RiveRef } from 'rive-react-native';

export default function StartScreen() {
  const riveComponentRef = useRef<RiveRef>(null);
  const router = useRouter();

  const handleStateChange = (stateMachineName: string, stateName: string) => {
    if (stateName === 'ExitState') {
      router.push('/(tabs)');
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <Rive
        ref={riveComponentRef}
        resourceName="start_screen"
        fit={Fit.Cover}
        style={{
          width: '100%',
          height: '100%',
        }}
        onStateChanged={handleStateChange}
      />
    </SafeAreaView>
  );
}
