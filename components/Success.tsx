import * as Haptics from 'expo-haptics';
import React, { useRef } from 'react';
import { View } from 'react-native';
import Rive, { Fit, RiveRef, RiveGeneralEvent, RiveOpenUrlEvent } from 'rive-react-native';

import { useLevelStore } from '@/stores/levelStore';

type SuccessProps = {
  onAnimationComplete: () => void;
};

export default function Success({ onAnimationComplete }: SuccessProps) {
  const riveComponentRef = useRef<RiveRef>(null);
  const { phaseIndex } = useLevelStore();
  console.log('on success mount');

  const handleStateChange = (stateMachineName: string, stateName: string) => {
    if (stateName === 'ExitState') {
      onAnimationComplete();
    }
  };

  const handleRiveEvent = (event: RiveGeneralEvent | RiveOpenUrlEvent) => {
    if (event.name === 'Pressed') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    else if (event.name === 'Done') {
      // go to end screen
    }
  };

  return (
    <View className="absolute bottom-0 left-0 right-0 top-0">
      <Rive
        ref={riveComponentRef}
        resourceName="successscreens_22"
        artboardName={`success_${phaseIndex + 1} MAIN`}
        fit={Fit.Cover}
        onStateChanged={handleStateChange}
        onRiveEventReceived={handleRiveEvent}
      />
    </View>
  );
}
