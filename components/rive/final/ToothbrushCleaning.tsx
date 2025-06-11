import React, { useMemo, useEffect, useRef, useCallback } from 'react';
import { Dimensions, View, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { withDecay, useSharedValue, useAnimatedReaction, runOnJS } from 'react-native-reanimated';
import Rive, { Fit, RiveGeneralEvent, RiveRef } from 'rive-react-native'; // Adjust to your Rive version

import { useInteractionSound } from '@/hooks/useInteractionSound';
type ToothbrushCleaningProps = {
  onDone: Function;
  showTuto: boolean;
  pieceId: number;
};

export default function ToothbrushCleaning(props: ToothbrushCleaningProps) {
  const riveRef = useRef<RiveRef>(null);
  const tutoRiveRef = useRef<RiveRef>(null);
  const progress = useSharedValue(0);
  const lastY = useSharedValue(0);
  const isDone = useRef(false);

  useEffect(() => {
    riveRef.current?.setInputState('State Machine 1', 'objectID', props.pieceId);
    riveRef.current?.setInputState('State Machine 1', 'showTuto', props.showTuto);
  }, []);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .onBegin((e) => {
          lastY.value = e.y;
        })
        .onUpdate((e) => {
          const dx = Math.abs(e.y - lastY.value);
          progress.value += dx * 0.2;

          lastY.value = e.y;
        })
        .onEnd((e) => {
          progress.value = withDecay({
            velocity: e.velocityY * 0.1,
            deceleration: 0.98,
            clamp: [0, 100],
          });
        }),
    []
  );

  const updateRiveState = useCallback((num: number) => {
    if (isDone.current) return;

    if (num < 100 && !isDone.current) {
      riveRef.current?.setInputState('State Machine 1', 'progress', num); // modulo 100 === 1 turn -> we need to do several turns,
    } else if (num >= 100) {
      riveRef.current?.fireState('State Machine 1', 'close');
      isDone.current = true;
    }
  }, []);

  useAnimatedReaction(
    () => progress.value,
    (val) => {
      const scaled = val * 0.1; // 🧠 halve the input
      const clamped = Math.max(0, Math.min(scaled, 100));
      console.log(clamped);
      runOnJS(updateRiveState)(clamped);
    },
    [updateRiveState]
  );

  const handleRiveEvent = (event: RiveGeneralEvent) => {
    if (event.name === 'Done') {
      props.onDone();
    }
  };
  useInteractionSound(progress, 'toothbrush');

  return (
    <View className="h-full w-full flex-1">
      <View className="relative h-full w-full">
        <View className="absolute top-0 h-full w-full">
          <Rive
            ref={riveRef}
            resourceName="pop_up_nettoyage_11"
            fit={Fit.Cover}
            style={{ width: '100%', pointerEvents: 'none' }}
            onRiveEventReceived={handleRiveEvent}
            artboardName="Game"
          />
        </View>
        {props.showTuto && (
          <View className="absolute top-0 h-full w-full">
            <Rive
              ref={tutoRiveRef}
              resourceName="pop_up_nettoyage_11"
              fit={Fit.Cover}
              style={{ width: '100%', pointerEvents: 'none' }}
              onRiveEventReceived={handleRiveEvent}
              artboardName="TutoNettoie"
            />
          </View>
        )}
      </View>
      <GestureDetector gesture={panGesture}>
        <View className="absolute h-full w-full" />
      </GestureDetector>
    </View>
  );
}
