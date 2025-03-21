import React, { useRef } from 'react';
import Rive, { Fit, RiveRef, RiveGeneralEvent, RiveOpenUrlEvent } from 'rive-react-native';

type ToolsProps = {
  onDone: Function;
  id: string;
};

export default function Tools(props: ToolsProps) {
  const riveRef = useRef<RiveRef>(null);

  const handleStateChange = (stateMachineName: string, stateName: string) => {
    console.log('State changed:', { stateMachineName, stateName });
  };

  const handleRiveEvent = (event: RiveGeneralEvent | RiveOpenUrlEvent) => {
    console.log('Event received:', event);
    if (event.name === 'Drop') {
      setTimeout(props.onDone, 500);
    }
  };

  return (
    <Rive
      ref={riveRef}
      resourceName="tools_choose"
      artboardName="tools 2"
      stateMachineName="Choose Tools"
      onStateChanged={handleStateChange}
      onRiveEventReceived={handleRiveEvent}
      fit={Fit.Contain}
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  );
}
