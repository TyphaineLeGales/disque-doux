import { useRef, useCallback, useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSharedValue, withDecay, useAnimatedReaction, runOnJS } from 'react-native-reanimated';
import Rive, { Fit, RiveRef } from 'rive-react-native';

const THRESHOLD = 1000; // 10 turns
export default function Test() {
  const riveComponentRef = useRef<RiveRef>(null);
  const offset = useSharedValue<number>(0);
  const [isDone, setIsDone] = useState(false);

  const panGesture = Gesture.Pan()
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
    if (num !== THRESHOLD) {
      riveComponentRef.current?.setInputState('main', 'progress', num % 100);
    } else {
      setIsDone(true);
      riveComponentRef.current?.fireStateAtPath('starsIn', 'stars');
    }
  };

  const cachedUpdate = useCallback(updateRiveState, []);
  useAnimatedReaction(
    () => offset.value, // modulo 100 === 1 turn -> we need to do several turns,
    (data) => {
      runOnJS(cachedUpdate)(data);
    },
    [cachedUpdate] // dependencies
  );

  return (
    <SafeAreaView className="relative flex-1 items-center justify-center bg-slate-200">
      <Rive
        ref={riveComponentRef}
        resourceName="test_4"
        fit={Fit.Contain}
        className="absolute"
        style={{ width: '100%', PointerEvent: 'none' }}
        stateMachineName="main"
      />

      <GestureDetector gesture={panGesture}>
        <View className="absolute h-full w-full" />
      </GestureDetector>
      {isDone && <View className="absolute h-full w-full" />}
    </SafeAreaView>
  );
}
