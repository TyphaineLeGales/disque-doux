import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Success from '@/components/Success';
import FindTools from '@/components/final/1_FindTools';
import Clean from '@/components/final/2_Clean';
import Disassemble from '@/components/final/3_Disassemble';
import Assemble from '@/components/final/4_Assemble';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useBackgroundMusic } from '@/hooks/useBackgroundMusic';
import { useLevelStore } from '@/stores/levelStore';

export default function Sequence() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { phaseIndex, setPhaseIndex } = useLevelStore();
  const PHASES = ['FindTools', 'Clean', 'Disassemble', 'Assemble'];
  const [showSuccess, setShowSuccess] = useState(false);
  const [phaseProgress, setPhaseProgress] = useState(0);

  const onPhaseDone = () => {
    setTimeout(() => {
      setShowSuccess(true);
    }, 1000);
  };

  const handleSuccessComplete = () => {
    setShowSuccess(false);
    setPhaseIndex(phaseIndex + 1);
  };

  const updatePhaseProgress = (progress: number) => {
    setPhaseProgress(progress);
  };

  useBackgroundMusic();

  return (
    <GestureHandlerRootView className="size-full flex-1">
      <View className="size-full w-[100vw] flex-1">
        {!showSuccess && (
          <ProgressBar
            currentPhase={phaseIndex}
            totalPhases={PHASES.length}
            phaseProgress={phaseProgress}
          />
        )}
        {phaseIndex === 0 && (
          <FindTools onDone={onPhaseDone} id={id} onProgress={updatePhaseProgress} />
        )}
        {phaseIndex === 1 && (
          <Clean onDone={onPhaseDone} id={id} onProgress={updatePhaseProgress} />
        )}
        {phaseIndex === 2 && (
          <Disassemble onDone={onPhaseDone} id={id} onProgress={updatePhaseProgress} />
        )}
        {phaseIndex === 3 && <Assemble onDone={onPhaseDone} id={id} />}

        {showSuccess && <Success onAnimationComplete={handleSuccessComplete} />}
      </View>
    </GestureHandlerRootView>
  );
}
