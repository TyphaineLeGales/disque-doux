import React, { useRef } from 'react';
import { View } from 'react-native';
import Rive, { Fit, RiveRef, RiveGeneralEvent, RiveOpenUrlEvent } from 'rive-react-native';
type AssembleProps = {
  onDone: Function;
  id: string;
};
export default function AssembleProto(props: AssembleProps) {
  const riveRef = useRef<RiveRef>(null);
  const currObjectId = useRef<string>('-1');

  const handleStateChange = (stateMachineName: string, stateName: string) => {
    console.log('State changed:', { stateMachineName, stateName });
    if (stateName.includes('onCurrentPiece')) {
      console.log('currentIdIs', stateName.split('onCurrentPiece')[1]);
      currObjectId.current = stateName.split('onCurrentPiece')[1];
    }
    if (stateName === 'dropOut') {
      riveRef.current?.setInputState('State Machine 1', 'inventoryOpen', false);
      riveRef.current?.setInputStateAtPath('is3D', true, currObjectId.current);
    }
  };

  const handleRiveEvent = (event: RiveGeneralEvent | RiveOpenUrlEvent) => {
    console.log('Event received:', event);
    // if (event.name === 'onCurrObjectSelected') {
    //   console.log(event.properties);
    //   currObjectId.current = event.properties.ID;
    // }
  };

  //riveComponentRef.current?.setInputStateAtPath("is3D", true, `currObjectId`);
  return (
    <View className="h-full w-full flex-1">
      <Rive
        ref={riveRef}
        resourceName="assemble_v3_6"
        onStateChanged={handleStateChange}
        onRiveEventReceived={handleRiveEvent}
        fit={Fit.Contain}
        style={{
          height: '80%',
        }}
      />
    </View>
  );
}
