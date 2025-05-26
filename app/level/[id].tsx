import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Success from '@/components/Success';
import FindTools from '@/components/final/1_FindTools';
import Clean from '@/components/final/2_Clean';
import Disassemble from '@/components/final/3_Disassemble';
import Assemble from '@/components/final/4_Assemble';
import GameTuto from '@/components/final/GameplayTuto';
import { useLevelStore } from '@/stores/levelStore';

export default function Sequence() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { phaseIndex } = useLevelStore();
  const PHASES = ['FindTools', 'Clean', 'Disassemble', 'Assemble'];
  const [currPhaseIndex, setCurrPhaseIndex] = useState(phaseIndex || 0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showTuto, setShowTuto] = useState(false);

  useEffect(() => {
    setCurrPhaseIndex(phaseIndex);
  }, [phaseIndex]);

  const onPhaseDone = () => {
    setShowSuccess(true);
  };

  const onTutoDone = () => {
    setCurrPhaseIndex((prev) => prev + 1);
  };

  const handleSuccessComplete = () => {
    setShowSuccess(false);
    setShowTuto(true);
    // TODO : show tutorial of next level
  };

  return (
    <GestureHandlerRootView className="flex size-full flex-1 ">
      <View className="flex size-full w-[100vw] flex-1 ">
        <Text>
          Level : {id}, Phase: {currPhaseIndex} {PHASES[currPhaseIndex]}
        </Text>
        {currPhaseIndex === 0 && <FindTools onDone={onPhaseDone} id={id} />}
        {currPhaseIndex === 1 && <Clean onDone={onPhaseDone} id={id} />}
        {currPhaseIndex === 2 && <Disassemble onDone={onPhaseDone} id={id} />}
        {currPhaseIndex === 3 && <Assemble onDone={onPhaseDone} id={id} />}
        {showSuccess && <Success onAnimationComplete={handleSuccessComplete} />}
        {showTuto && <GameTuto id={id} onDone={onTutoDone} />}
        {/* <BtnTools /> */}
      </View>
    </GestureHandlerRootView>
  );
}
