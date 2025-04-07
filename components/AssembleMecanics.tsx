import React, { useRef } from 'react';
import { Button, View } from 'react-native';
import Rive, { Fit, RiveRef, RiveGeneralEvent, RiveOpenUrlEvent } from 'rive-react-native';

type AssembleProps = {
  onDone: Function;
  id: string;
};

export default function AssembleMecanics(props: AssembleProps) {
  const riveRef = useRef<RiveRef>(null);
  const zone = useRef('');

  const getIndexFromDirection = (dir: string) => {
    if (dir === 'top') return 0;
    if (dir === 'bottom') return 1;
    if (dir === 'left') return 2;
    if (dir === 'right') return 3;
  };

  const handleStateChange = (stateMachineName: string, stateName: string) => {
    console.log('State changed:', { stateMachineName, stateName });
    if (stateName.includes('zone')) {
      zone.current = stateName.split('_')[1];
      console.log('name', stateName.split('_')[1]);
    }

    if (stateName === 'dragging') {
      riveRef.current.setInputState('main', 'snap', -1); //non snap
    }
  };

  const handleRiveEvent = (event: RiveGeneralEvent | RiveOpenUrlEvent) => {
    console.log('Event received:', event);
    if (event.name === 'EndDrag') {
      riveRef.current.setInputState('main', 'snap', getIndexFromDirection(zone.current));
      // trigger timeline corresponding to direction
    }

    if (event.name === 'onSnap') {
      //riveRef.current.fireState('main', 'fadeOutSlots');
      riveRef.current.fireState('main', 'triggerBounce'); // trigger onSnapEnd
    }
  };

  return (
    <View className="h-full w-full flex-1">
      <Rive
        ref={riveRef}
        resourceName="assemble_test_2"
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
