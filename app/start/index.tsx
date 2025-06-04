import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import { Pressable } from 'react-native';
import Rive, { Fit, RiveRef } from 'rive-react-native';

export default function StartScreen() {
  const riveComponentRef = useRef<RiveRef>(null);
  const router = useRouter();

  const onStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/narration/1');
  };

  return (
    <Pressable className="size-full" onPress={onStart}>
      <Rive
        ref={riveComponentRef}
        resourceName="start"
        fit={Fit.Contain}
        style={{ pointerEvents: 'none' }}
      />
    </Pressable>
  );
}
