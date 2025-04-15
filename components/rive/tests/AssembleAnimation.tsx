import React, { useRef } from 'react';
import { Button, View } from 'react-native';
import Rive, { Fit, RiveRef, RiveGeneralEvent, RiveOpenUrlEvent } from 'rive-react-native';

type AssembleProps = {
  onDone: Function;
  id: string;
};

export default function Assemble(props: AssembleProps) {
  const riveRef = useRef<RiveRef>(null);

  const handleStateChange = (stateMachineName: string, stateName: string) => {
    console.log('State changed:', { stateMachineName, stateName });
  };

  const handleRiveEvent = (event: RiveGeneralEvent | RiveOpenUrlEvent) => {
    console.log('Event received:', event);
    if (event.name === 'Drop') {
      props.onDone();
    }
  };

  const onAssemble = () => riveRef.current?.fireState('State Machine 1', 'assemble');
  const onDisassemble = () => riveRef.current?.fireState('State Machine 1', 'Disassemble');

  return (
    <View className="h-full w-full flex-1">
      <Rive
        ref={riveRef}
        resourceName="assemble"
        onStateChanged={handleStateChange}
        onRiveEventReceived={handleRiveEvent}
        fit={Fit.Contain}
        style={{
          height: '75%',
        }}
      />
      <View className="flex w-full flex-row items-center justify-center">
        <Button title="assemble" onPress={onAssemble} />
        <Button title="disassemble" onPress={onDisassemble} />
      </View>
    </View>
  );
}
