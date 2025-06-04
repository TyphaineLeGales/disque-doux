import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef } from 'react';
import { Pressable } from 'react-native';
import Rive, { Fit, RiveRef } from 'rive-react-native';

export default function Sequence() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const onNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/level/' + id);
  };
  const riveComponentRef = useRef<RiveRef>(null);

  return (
    <Pressable className="size-full bg-[#FFE8E0]" onPress={onNext}>
      <Rive
        ref={riveComponentRef}
        resourceName="narration_1_2"
        fit={Fit.Cover}
        style={{ pointerEvents: 'none' }}
      />
    </Pressable>
  );
}
