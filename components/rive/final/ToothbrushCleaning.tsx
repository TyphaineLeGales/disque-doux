import React, { useMemo, useEffect } from 'react';
import { Dimensions, View, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

type ToothbrushCleaningProps = {
  onDone: Function;
  showTuto: boolean;
  pieceId: number;
};

export default function ToothbrushCleaning(props: ToothbrushCleaningProps) {
  const panGesture = useMemo(() => Gesture.Pan(), []);
  useEffect(() => {
    setTimeout(() => props.onDone, 5000);
  }, []);

  return (
    <View className="h-full w-full flex-1">
      <View className="relative h-full w-full">
        <View className="absolute top-0 h-full w-full">
          {/* <Rive
            ref={riveRefGame}
            resourceName="pop_up_devisse_13"
            artboardName="Game"
            fit={Fit.Contain}
            onRiveEventReceived={handleRiveEvent}
            style={{ width: '100%', pointerEvents: 'none' }}
          /> */}
        </View>
      </View>
      <GestureDetector gesture={panGesture}>
        <View className="absolute h-full w-full bg-orange-400 ">
          <Text>Cleaning game {props.pieceId}</Text>
        </View>
      </GestureDetector>
    </View>
  );
}
