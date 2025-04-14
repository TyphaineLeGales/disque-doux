import { useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Assemble from '@/components/Assemble';
import AssembleAnimation from '@/components/AssembleAnimation';
import AssembleMecanics from '@/components/AssembleMecanics';
import Clean from '@/components/Clean';
import Screw from '@/components/Screw';
import Success from '@/components/Success';
import Tools from '@/components/Tools';

export default function Sequence() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const PHASES = ['tools', 'disassemble', 'reassemble', 'clean'];
  const [currPhaseIndex, setCurrPhaseIndex] = React.useState(0);
  const [showSuccess, setShowSuccess] = React.useState(false);

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
          Level : {id}, Phase: {PHASES[currPhaseIndex]}
        </Text>
        {/* {currPhaseIndex === 0 && <Tools onDone={onPhaseDone} id={id} />}
        {currPhaseIndex === 1 && <Screw onDone={onPhaseDone} id={id} />}
        {/* {currPhaseIndex === 2 && <AssembleAnimation onDone={onPhaseDone} id={id} />} */}

        {currPhaseIndex === 0 && <Assemble onDone={onPhaseDone} id={id} />}
        {/* {currPhaseIndex === 0 && <Clean onDone={onPhaseDone} id={id} />} */}
        {showSuccess && <Success onAnimationComplete={handleSuccessComplete} />}
      </View>
    </GestureHandlerRootView>
  );
}
