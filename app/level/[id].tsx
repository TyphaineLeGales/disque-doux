import { useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Success from '@/components/Success';
import Assemble from '@/components/rive/prototype/Assemble';
import Clean from '@/components/rive/prototype/Clean';
import Disassemble from '@/components/rive/prototype/Disassemble';
import Tools from '@/components/rive/prototype/Tools';
import { useLevelStore } from '@/stores/levelStore';

export default function Sequence() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { phaseIndex } = useLevelStore();
  const PHASES = ['tools', 'clean', 'disassemble', 'reassemble'];
  const [currPhaseIndex, setCurrPhaseIndex] = React.useState(phaseIndex || 0);
  const [showSuccess, setShowSuccess] = React.useState(false);

  useEffect(() => {
    setCurrPhaseIndex(phaseIndex);
  }, [phaseIndex]);

  const onPhaseDone = () => {
    setShowSuccess(true);
  };

  const handleSuccessComplete = () => {
    setShowSuccess(false);
    setCurrPhaseIndex((prev) => prev + 1);
  };

  return (
    <GestureHandlerRootView className="size-full">
      <View className="size-full bg-[#FFE8E0]">
        <Text>
          Level : {id}, Phase: {currPhaseIndex} {PHASES[currPhaseIndex]}
        </Text>
        {currPhaseIndex === 0 && <Tools onDone={onPhaseDone} id={id} />}
        {currPhaseIndex === 1 && <Clean onDone={onPhaseDone} id={id} />}
        {currPhaseIndex === 2 && <Disassemble onDone={onPhaseDone} id={id} />}
        {currPhaseIndex === 3 && <Assemble onDone={onPhaseDone} id={id} />}
        {showSuccess && <Success onAnimationComplete={handleSuccessComplete} />}
      </View>
    </GestureHandlerRootView>
  );
}
