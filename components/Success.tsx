import * as Haptics from 'expo-haptics';
import React, { useRef } from 'react';
import { Pressable } from 'react-native';
import Rive, { Fit, RiveRef, RiveGeneralEvent, RiveOpenUrlEvent } from 'rive-react-native';

import { useLevelStore } from '@/stores/levelStore';

type SuccessProps = {
  onAnimationComplete: () => void;
};

export default function Success({ onAnimationComplete }: SuccessProps) {
  const riveComponentRef = useRef<RiveRef>(null);
  const { phaseIndex } = useLevelStore();
  const animationIsDone = useRef(false);

  const handleRiveEvent = (event: RiveGeneralEvent | RiveOpenUrlEvent) => {
    if (event.name === 'showArrow') {
      animationIsDone.current = true;
      riveComponentRef.current?.setInputStateAtPath('ShowArrow', true, 'ArrowNext');
    }
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!animationIsDone.current) return;
    onAnimationComplete();
  };

  return (
    <Pressable
      onPress={handlePress}
      className="absolute bottom-0 left-0 right-0 top-0"
      style={{ zIndex: 10 }}>
      <Rive
        ref={riveComponentRef}
        resourceName="successscreens_3"
        artboardName={`success_${phaseIndex + 1}`}
        fit={Fit.Contain}
        autoplay
        style={{ pointerEvents: 'none' }}
        onRiveEventReceived={handleRiveEvent}
      />
    </Pressable>
  );
}
