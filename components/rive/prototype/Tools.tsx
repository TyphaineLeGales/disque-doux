import React, { useRef } from 'react';
import Rive, { Fit, RiveRef } from 'rive-react-native';

type ToolsProps = {
  onDone: Function;
  id: string;
};

export default function Tools(props: ToolsProps) {
  const riveRef = useRef<RiveRef>(null);

  const handleStateChange = (stateMachineName: string, stateName: string) => {
    console.log('State changed:', { stateMachineName, stateName });
    if (stateName === 'ExitState') {
      props.onDone();
    }
  };

  return (
    <Rive
      ref={riveRef}
      resourceName="tools_3"
      artboardName="tools"
      stateMachineName="Choose Tools"
      onStateChanged={handleStateChange}
      fit={Fit.Contain}
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  );
}
