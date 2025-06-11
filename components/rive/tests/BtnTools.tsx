import React, { useRef } from 'react';
import { Text, View } from 'react-native';
import Rive, { Fit, RiveRef, RiveGeneralEvent, RiveOpenUrlEvent } from 'rive-react-native';

export default function BtnTools() {
  const riveRef = useRef<RiveRef>(null);

  const handleStateChange = (stateMachineName: string, stateName: string) => {
    console.log('State changed:', { stateMachineName, stateName });
    if (stateName === 'ActiveTest') {
      riveRef.current?.fireState('State Machine 1', 'openToolbox');
    }

    if (stateName === 'IdleTest') {
      riveRef.current?.fireState('State Machine 1', 'closeToolbox');
    }
  };

  const handleRiveEvent = (event: RiveGeneralEvent | RiveOpenUrlEvent) => {
    console.log('Event received:', event);
  };

  return (
    <View className="h-full w-full flex-1">
      <Text>Coucou</Text>
      <Rive
        ref={riveRef}
        resourceName="btntools6"
        onStateChanged={handleStateChange}
        onRiveEventReceived={handleRiveEvent}
        fit={Fit.Contain}
        style={{
          height: '75%',
        }}
      />
    </View>
  );
}
