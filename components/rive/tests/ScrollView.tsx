import React, { useRef } from 'react';
import { Text, View } from 'react-native';
import Rive, { Fit, RiveRef, RiveGeneralEvent, RiveOpenUrlEvent } from 'rive-react-native';

export default function ScrollView() {
  const riveRef = useRef<RiveRef>(null);

  const handleRiveEvent = (event: RiveGeneralEvent | RiveOpenUrlEvent) => {
    console.log('Event received:', event);
  };

  return (
    <View className="h-full w-full flex-1 bg-[#313131]">
      <Rive
        ref={riveRef}
        resourceName="scrollable_views"
        artboardName="Artboard 2"
        onRiveEventReceived={handleRiveEvent}
        fit={Fit.Contain}
        style={{
          height: '100%',
        }}
      />
    </View>
  );
}
