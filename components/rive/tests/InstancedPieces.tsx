import React, { useRef, useEffect } from 'react';
import { Text, View } from 'react-native';
import Rive, {
  Fit,
  RiveRef,
  BindByName,
  RNRiveError,
  RNRiveErrorType,
  AutoBind,
} from 'rive-react-native';
export default function InstancedPieces() {
  const riveRef = useRef<RiveRef>(null);

  return (
    <View className="h-full w-full flex-1">
      <Text>Data binding test</Text>
      <Rive
        ref={riveRef}
        resourceName="data_binding_test_2"
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
        fit={Fit.Contain}
        style={{
          height: '75%',
        }}
      />
    </View>
  );
}
