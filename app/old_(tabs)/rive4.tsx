import React, { useRef } from 'react';
import { SafeAreaView } from 'react-native';
import Rive, { Fit, RiveRef, RiveGeneralEvent, RiveOpenUrlEvent } from 'rive-react-native';

export default function Tools() {
  const riveRef = useRef<RiveRef>(null);

  const handleStateChange = (stateMachineName: string, stateName: string) => {
    console.log('State changed:', { stateMachineName, stateName });
  };

  const handleRiveEvent = (event: RiveGeneralEvent | RiveOpenUrlEvent) => {
    console.log('Event received:', event);
  };

  return (
    <SafeAreaView className="items-center justify-center flex-1 bg-slate-200">
      <Rive
        ref={riveRef}
        resourceName="tools_choose"
        artboardName="tools 2"
        stateMachineName="Choose Tools"
        onStateChanged={handleStateChange}
        onRiveEventReceived={handleRiveEvent}
        fit={Fit.Cover}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </SafeAreaView>
  );
}
