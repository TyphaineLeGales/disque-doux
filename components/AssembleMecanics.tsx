import React, { useRef } from 'react';
import { View } from 'react-native';
import Rive, { Fit, RiveRef, RiveGeneralEvent, RiveOpenUrlEvent } from 'rive-react-native';

type AssembleProps = {
  onDone: Function;
  id: string;
};

export default function AssembleMecanics(props: AssembleProps) {
  const riveRef = useRef<RiveRef>(null);
  const zone = useRef('');
  const prevObjectId = useRef(0);
  const currObjectId = useRef(2); // should be updated dynamically on draggin event
  // convention z up
  const completionState = useRef({
    top: [1],
    left: [0],
    right: [],
  });

  /* 
    set currObjectId on dragging
    update completion state 
      - add currObjectId to correct axis id
      - if prevObject === currObject id remove it to completion state
    check for level completion when all pieces are placed
  */

  const getIndexFromDirection = (dir: string) => {
    if (dir === 'top') return 0;
    if (dir === 'bottom') return 1;
    if (dir === 'left') return 2;
    if (dir === 'right') return 3;
  };

  const handleStateChange = (stateMachineName: string, stateName: string) => {
    //console.log('State changed:', { stateMachineName, stateName });
    if (stateName.includes('zone')) {
      zone.current = stateName.split('_')[1];
      //console.log('name', stateName.split('_')[1]);
    }

    if (stateName === 'dragging') {
      riveRef.current.setInputState('main', 'snap', -1); //non snap
      // set currObjectId.current
    }
  };

  const handleRiveEvent = (event: RiveGeneralEvent | RiveOpenUrlEvent) => {
    //console.log('Event received:', event);
    if (event.name === 'EndDrag') {
      riveRef.current.setInputState('main', 'snap', getIndexFromDirection(zone.current));
      // trigger timeline corresponding to direction
    }

    if (event.name === 'onSnap') {
      //riveRef.current.fireState('main', 'fadeOutSlots');
      riveRef.current.fireState('main', 'triggerBounce'); // trigger onSnapEnd

      if (prevObjectId.current === currObjectId.current) {
        // remove from previous position
        const indexToRemove = currObjectId.current; // The index you want to remove

        Object.keys(completionState.current).forEach((key) => {
          const arr = completionState.current[key];
          const idx = arr.indexOf(indexToRemove);
          if (idx !== -1) {
            arr.splice(idx, 1); // Remove the index from the array
          }
        });
      }
      completionState.current[zone.current].push(currObjectId.current);
      prevObjectId.current = currObjectId.current;
      console.log('completion state', completionState.current);
    }
  };

  // state based on

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
