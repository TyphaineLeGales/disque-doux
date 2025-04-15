import React, { useRef, useCallback, useState } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSharedValue, withDecay, useAnimatedReaction, runOnJS } from 'react-native-reanimated';
import Rive, { Fit, RiveRef, RiveGeneralEvent, RiveOpenUrlEvent } from 'rive-react-native';

type AssembleProps = {
  onDone: Function;
  id: string;
};

const THRESHOLD = 1000; // 10 turns

export default function Disassemble(props: AssembleProps) {
  const riveRef = useRef<RiveRef>(null);
  const offset = useSharedValue<number>(0);
  const isDone = useRef(false);
  const [inCloseUp, setInCloseUp] = useState(false);

  const panGesture = Gesture.Pan() // put in useMemo to avoid reevalution
    .onChange((event) => {
      offset.value += event.changeX;
    })
    .onFinalize((event) => {
      offset.value = withDecay({
        velocity: event.velocityX * 0.1,
        rubberBandEffect: false,
        clamp: [0, THRESHOLD],
      });
    });

  const updateRiveState = (num: number) => {
    if (isDone.current) return;
    if (num < THRESHOLD) {
      console.log(num, 'num');
      console.log('progressScrewPos', num / 10);
      console.log('progressScrewRotate', num % 100);
      riveRef.current?.setInputStateAtPath('progressScrewPos', num / 10, 'closeUp'); // modulo 100 === 1 turn -> we need to do several turns,
      riveRef.current?.setInputStateAtPath('progressScrewRotate', num % 100, 'closeUp');
    } else {
      isDone.current = true;
      //setTimeout(props.onDone, 2000);
    }
  };

  const cachedUpdate = useCallback(updateRiveState, []);
  useAnimatedReaction(
    () => offset.value,
    (data) => {
      runOnJS(cachedUpdate)(data);
    },
    [cachedUpdate] // dependencies
  );

  const handleStateChange = (stateMachineName: string, stateName: string) => {
    console.log(stateName);
  };
  const handleRiveEvent = (event: RiveGeneralEvent | RiveOpenUrlEvent) => {
    if (event.name === 'toolDropped') {
      console.log('tool dropped');
      riveRef.current.setInputState('main', 'showCloseUp', true);
      setInCloseUp(true);
    }
  };
  return (
    <View className="h-full w-full flex-1">
      <Rive
        ref={riveRef}
        resourceName="disassemble_4"
        onStateChanged={handleStateChange}
        onRiveEventReceived={handleRiveEvent}
        fit={Fit.Contain}
        style={{
          height: '80%',
        }}
      />
      {inCloseUp && (
        <GestureDetector gesture={panGesture}>
          <View className="absolute h-full w-full " />
        </GestureDetector>
      )}
    </View>
  );
}
