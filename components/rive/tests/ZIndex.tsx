import React, { useRef, useState, useEffect } from 'react';
import { Text, View, Pressable } from 'react-native';
import Rive, {
  Fit,
  RiveRef,
  BindByName,
  RNRiveError,
  RNRiveErrorType,
  AutoBind,
  RiveGeneralEvent,
} from 'rive-react-native';

export default function ZIndex() {
  const riveRef = useRef<RiveRef>(null);
  const currPieceIndex = useRef(1);

  const handleStateChange = (stateMachineName: string, stateName: string) => {
    console.log('State changed:', { stateMachineName, stateName });
    if (stateName.includes('inInventory')) {
      const pieceId = stateName.split('_')[0];
      console.log('piece id', pieceId);
      riveRef.current?.setInputStateAtPath('isDraggable', false, `piece ${pieceId}`);
    }
  };
  const handleRiveEvent = (event: RiveGeneralEvent) => {
    console.log('Event received:', event);
  };
  const onBtnPress = () => {
    riveRef.current?.setInputStateAtPath('isDraggable', true, `piece ${currPieceIndex.current}`);
    currPieceIndex.current += 1;
  };

  return (
    <View className="flex h-full w-full flex-1">
      <View className="h-full w-full flex-1">
        <Rive
          ref={riveRef}
          resourceName="test_z_index_12"
          artboardName="vue Ydraggable"
          onStateChanged={handleStateChange}
          onRiveEventReceived={handleRiveEvent}
          fit={Fit.Contain}
          style={{
            width: '100%',
          }}
          dataBinding={AutoBind(true)}
          onError={(riveError: RNRiveError) => {
            switch (riveError.type) {
              case RNRiveErrorType.DataBindingError: {
                console.error(`${riveError.message}`);
                return;
              }
              default:
                console.error('Unhandled error');
            }
          }}
        />
      </View>

      <View className="h-1/8 absolute bottom-0 z-10 w-full items-center justify-end ">
        <Pressable onPress={onBtnPress}>
          <Text className="font-bold uppercase text-orange-600">Click Me</Text>
        </Pressable>
      </View>
    </View>
  );
}
