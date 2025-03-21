import React, { useRef, useCallback } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSharedValue, withDecay, useAnimatedReaction, runOnJS } from 'react-native-reanimated';
import Rive, { Fit, RiveRef } from 'rive-react-native';

const THRESHOLD = 1000; // 10 turns

type ScrewProps = {
  onDone: Function;
  id: string;
};

export default function Screw(props: ScrewProps) {
  const riveComponentRef = useRef<RiveRef>(null);
  const offset = useSharedValue<number>(0);
  const isDone = useRef(false);

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
    if (num !== THRESHOLD) {
      riveComponentRef.current?.setInputState('main', 'progress', num % 100); // modulo 100 === 1 turn -> we need to do several turns,
    } else {
      isDone.current = true;
      riveComponentRef.current?.fireStateAtPath('starsIn', 'stars');
      setTimeout(props.onDone, 3000);
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

  return (
    <View className="flex-1 w-full h-full">
      <Rive
        ref={riveComponentRef}
        resourceName="test_4"
        fit={Fit.Contain}
        className="absolute"
        style={{ width: '100%', PointerEvent: 'none' }}
        stateMachineName="main"
      />

      <GestureDetector gesture={panGesture}>
        <View className="absolute w-full h-full" />
      </GestureDetector>
    </View>
  );
}
