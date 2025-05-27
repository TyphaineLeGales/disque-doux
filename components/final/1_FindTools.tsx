import React, { useRef } from 'react';
import { View } from 'react-native';
import Rive, { Fit, RiveRef, RiveGeneralEvent, RiveOpenUrlEvent } from 'rive-react-native';

type FindToolProps = {
  onDone: Function;
  id: string;
  debug?: boolean;
  onProgress: (progress: number) => void;
};

export default function FindTools(props: FindToolProps) {
  const { onProgress } = props;
  const riveRef = useRef<RiveRef>(null);
  const toolsFound = useRef(0);
  const TOTAL_TOOLS = 3;

  const handleStateChange = (stateMachineName: string, stateName: string) => {
    if (stateName === 'ExitState') {
      props.onDone();
    }
  };

  const handleRiveEvent = (event: RiveGeneralEvent | RiveOpenUrlEvent) => {
    console.log('event', event.name);
    if (event.name === 'Drop') {
      toolsFound.current++;
      onProgress(toolsFound.current / TOTAL_TOOLS);
    }
  };

  return (
    <View className="h-full w-full flex-1">
      <Rive
        ref={riveRef}
        resourceName="tools_3"
        artboardName="tools"
        stateMachineName="Choose Tools"
        onStateChanged={handleStateChange}
        onRiveEventReceived={handleRiveEvent}
        fit={Fit.Contain}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </View>
  );
}
