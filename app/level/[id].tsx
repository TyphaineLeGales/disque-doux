import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import Assemble from '@/components/Assemble';
import AssembleAnimation from '@/components/AssembleAnimation';
import AssembleMecanics from '@/components/AssembleMecanics';
import Screw from '@/components/Screw';
import Tools from '@/components/Tools';

export default function Sequence() {
  const { id } = useLocalSearchParams();
  const PHASES = ['tools', 'disassemble', 'reassemble'];
  const [currPhaseIndex, setCurrPhaseIndex] = useState(2);
  const onPhaseDone = () => setCurrPhaseIndex((prev) => prev + 1);

  return (
    <GestureHandlerRootView>
      <SafeAreaView className="flex-1 items-center justify-center bg-[#FFE8E0]">
        <Text>
          {' '}
          Level : {id}, Phase: {PHASES[currPhaseIndex]}
        </Text>
        {currPhaseIndex === 0 && <Tools onDone={onPhaseDone} id={id} />}
        {currPhaseIndex === 1 && <Screw onDone={onPhaseDone} id={id} />}
        {/* {currPhaseIndex === 2 && <AssembleAnimation onDone={onPhaseDone} id={id} />} */}
        {/* {currPhaseIndex === 2 && <AssembleMecanics onDone={onPhaseDone} id={id} />} */}
        {currPhaseIndex === 2 && <Assemble onDone={onPhaseDone} id={id} />}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
