import React, { useRef, useState, useEffect } from 'react';
import { Text, View, Pressable } from 'react-native';
import Rive, {
  Fit,
  RiveRef,
  BindByName,
  RNRiveError,
  RNRiveErrorType,
  AutoBind,
} from 'rive-react-native';

export default function ZIndex() {
  const riveRef = useRef<RiveRef>(null);
  const currPieceIndex = useRef(1);

  const handleStateChange = (stateMachineName: string, stateName: string) => {};
  const onBtnPress = () => {
    riveRef.current?.setInputStateAtPath('isDraggable', true, `piece ${currPieceIndex.current}`);
    currPieceIndex.current += 1;
  };

  return (
    <View className="flex h-full w-full flex-1">
      <View className="h-full w-full flex-1">
        <Rive
          ref={riveRef}
          resourceName="test_z_index_6"
          artboardName="vue Ydraggable"
          onStateChanged={handleStateChange}
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
