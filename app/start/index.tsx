import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import { View, Button } from 'react-native';
import Rive, { Fit, RiveRef } from 'rive-react-native';

export default function StartScreen() {
  const riveComponentRef = useRef<RiveRef>(null);
  const router = useRouter();

  const handleStateChange = (stateMachineName: string, stateName: string) => {
    if (stateName === 'out') {
      setTimeout(() => {
        router.push('/narration/1');
      }, 1000);
    }
  };

  const onStart = () => {
    setTimeout(() => {
      router.push('/narration/1');
    }, 1000);
  };

  return (
    <View className="size-full">
      <Rive
        ref={riveComponentRef}
        resourceName="start"
        fit={Fit.Contain}
        onStateChanged={handleStateChange}
      />
      {/* <View className="flex flex-row items-center justify-center w-full">
          <Button title="start" onPress={onStart} />
        </View> */}
    </View>
  );
}
