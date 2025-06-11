import * as Haptics from 'expo-haptics';
import React, { useRef, useEffect } from 'react';
import { View } from 'react-native';
import Rive, { Fit, RiveRef, RiveGeneralEvent, RiveOpenUrlEvent, DataBindBy, AutoBind, BindByName, RNRiveErrorType, RNRiveError, BindByIndex, RiveEvent } from 'rive-react-native';

type FindToolProps = {
  onDone: Function;
  id: string;
  debug?: boolean;
};

export default function FindTools(props: FindToolProps) {
  //DEBUG - CAN BE REMOVED
  // useEffect(() => {
  //   setTimeout(props.onDone, 1000);
  // }, []);

  const riveRef = useRef<RiveRef>(null);

  const handleStateChange = (stateMachineName: string, stateName: string) => {
    if (stateName === 'ExitState') {
      props.onDone();
    }
  };

  const handleEvent = (event: RiveEvent) => {
    switch (event.name) {
      case 'Haptics':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
    }
  };

  return (
    <View className="h-full w-full flex-1">
      <Rive
        ref={riveRef}
        autoplay={true}
        dataBinding={AutoBind(true)}
        resourceName="cherche_14"
        artboardName="Artboard"
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
        onRiveEventReceived={handleEvent}
        onStateChanged={handleStateChange}
        fit={Fit.Cover}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </View>
  );
}
