import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  withDecay,
  useSharedValue,
  useAnimatedReaction,
  runOnJS,
  useAnimatedRef,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Rive, { Fit, RiveGeneralEvent, RiveRef } from 'rive-react-native';

type WiggleProps = {
  onDone: Function;
  showTuto: boolean;
};

export default function Wiggle(props: WiggleProps) {
  const riveRefTuto = useRef<RiveRef>(null);
  const riveRefGame = useRef<RiveRef>(null);
  const progress = useSharedValue(0);
  const lastX = useSharedValue(0);
  const isDone = useRef(false);

  useEffect(() => {
    console.log('wiggle mounts');
    riveRefGame.current?.setInputState('State Machine 1', 'showTuto', props.showTuto);
    if (!props.showTuto) {
      riveRefGame.current?.setInputState('State Machine 1', 'open', true);
    }
  }, []);

  const handleRiveEvent = (event: RiveGeneralEvent) => {
    console.log('event', event.name);
  };

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .onBegin((e) => {
          lastX.value = e.x;
        })
        .onUpdate((e) => {
          const dx = Math.abs(e.x - lastX.value);
          // Adjust scale/sensitivity
          progress.value += dx * 0.2;

          lastX.value = e.x;
        })
        .onEnd((e) => {
          progress.value = withDecay({
            velocity: e.velocityX * 0.1,
            deceleration: 0.98,
            clamp: [0, 100],
          });
        }),
    []
  );

  const updateRiveState = useCallback(
    (num: number) => {
      if (isDone.current) return;
      console.log(num, typeof num);

      if (num < 100) {
        riveRefGame.current?.setInputState('State Machine 1', 'progress', num); // modulo 100 === 1 turn -> we need to do several turns,
        console.log('num in first');
      } else {
        console.log('in last');
        isDone.current = true;
        riveRefGame.current?.fireState('State Machine 1', 'close');
        setTimeout(props.onDone, 500);
      }
    },
    [props.onDone]
  );

  useAnimatedReaction(
    () => progress.value,
    (val) => {
      const scaled = val * 0.25; // 🧠 halve the input
      const clamped = Math.max(0, Math.min(scaled, 100));
      runOnJS(updateRiveState)(clamped);
    },
    [updateRiveState]
  );

  return (
    <View className="flex h-full w-full flex-1 bg-slate-50">
      <View className="relative z-30 h-full w-full">
        <View className="absolute top-0 h-full w-full">
          <Rive
            ref={riveRefGame}
            resourceName="separe2"
            artboardName="GameSepare"
            fit={Fit.Contain}
            onRiveEventReceived={handleRiveEvent}
            style={{ width: '100%', pointerEvents: 'none' }}
          />
        </View>
        {/* {props.showTuto && (
          <View className="absolute top-0 w-full h-full">
            <Rive
              ref={riveRefTuto}
              resourceName="pop_up_separe_2"
              artboardName="TutoSepare"
              fit={Fit.Contain}
              onRiveEventReceived={handleRiveEvent}
              style={{ width: '100%', pointerEvents: 'none' }}
            />
          </View>
        )} */}
      </View>
      <GestureDetector gesture={panGesture}>
        <View className="absolute z-50 h-full w-full" />
      </GestureDetector>
    </View>
  );
}
