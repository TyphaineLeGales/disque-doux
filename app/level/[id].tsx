import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Success from '@/components/Success';
import FindTools from '@/components/final/1_FindTools';
import Clean from '@/components/final/2_Clean';
import Disassemble from '@/components/final/3_Disassemble';
import Assemble from '@/components/final/4_Assemble';
import GameTuto from '@/components/final/GameplayTuto';
import ProgressBar from '@/components/ui/ProgressBar';
import { useLevelStore } from '@/stores/levelStore';

export default function Sequence() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { phaseIndex, setPhaseIndex } = useLevelStore();
  const PHASES = ['FindTools', 'Clean', 'Disassemble', 'Assemble'];
  const [showSuccess, setShowSuccess] = useState(false);
  const [showTuto, setShowTuto] = useState(false);
  const [phaseProgress, setPhaseProgress] = useState(0);

  const onPhaseDone = () => {
    setTimeout(() => {
      setShowSuccess(true);
    }, 1000);
  };

  const onTutoDone = () => {
    setShowTuto(false);
    setPhaseProgress(0);
  };

  const handleSuccessComplete = () => {
    setShowSuccess(false);
    setShowTuto(true);
    setPhaseIndex(phaseIndex + 1);
  };

  const updatePhaseProgress = (progress: number) => {
    console.log('progress in updatePhaseProgress', progress);
    setPhaseProgress(progress);
  };

  return (
    <GestureHandlerRootView className="flex size-full flex-1">
      <View className="flex size-full w-[100vw] flex-1">
        {/* <ProgressBar totalPhases={PHASES.length} phaseProgress={phaseProgress} /> */}

        {phaseIndex === 0 && (
          <FindTools onDone={onPhaseDone} id={id} onProgress={updatePhaseProgress} />
        )}
        {phaseIndex === 1 && (
          <Clean onDone={onPhaseDone} id={id} onProgress={updatePhaseProgress} />
        )}
        {phaseIndex === 2 && (
          <Disassemble onDone={onPhaseDone} id={id} onProgress={updatePhaseProgress} />
        )}
        {phaseIndex === 3 && (
          <Assemble onDone={onPhaseDone} id={id} onProgress={updatePhaseProgress} />
        )}
        {/* {currPhaseIndex === 0 && <FindTools onDone={onPhaseDone} id={id} onProgress={updatePhaseProgress} />} */}
        {currPhaseIndex === 0 && <Clean onDone={onPhaseDone} id={id} onProgress={updatePhaseProgress} />}
        {/* {currPhaseIndex === 2 && <Disassemble onDone={onPhaseDone} id={id} onProgress={updatePhaseProgress} />}
        {currPhaseIndex === 3 && <Assemble onDone={onPhaseDone} id={id} onProgress={updatePhaseProgress} />} */}
        {showSuccess && <Success onAnimationComplete={handleSuccessComplete} />}
        {showTuto && <GameTuto id={id} onDone={onTutoDone} />}
      </View>
    </GestureHandlerRootView>
  );
}
