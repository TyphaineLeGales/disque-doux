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
    <View className="size-full flex-1">
      <Rive
        ref={riveComponentRef}
        resourceName="start"
        fit={Fit.Contain}
        className="flex w-full flex-row items-center justify-center"
        style={{
          width: '100%',
          height: '90%',
        }}
        onStateChanged={handleStateChange}
      />
      <View className="flex w-full flex-row items-center justify-center">
        <Button title="start" onPress={onStart} />
      </View>
    </View>
  );
}
