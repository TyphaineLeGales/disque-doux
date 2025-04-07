import React, { useRef } from 'react';
import { View } from 'react-native';
import Rive, { Fit, RiveRef, RiveGeneralEvent, RiveOpenUrlEvent } from 'rive-react-native';

type AssembleProps = {
  onDone: Function;
  id: string;
};

type Direction = 'top' | 'left' | 'right';

type CompletionState = {
  [key in Direction]: number[];
};

export default function AssembleMecanics(props: AssembleProps) {
  const riveRef = useRef<RiveRef>(null);
  const zone = useRef('');
  const prevObjectId = useRef(0);
  const currObjectId = useRef(2); // should be updated dynamically on draggin event
  const TOTAL_PIECES = 3;
  const WIN_STATE = {
    top: [1],
    left: [0, 2],
    right: [],
  };
  const piecesPlacedCount = useRef(2);
  const completionState = useRef<CompletionState>({
    top: [1],
    left: [0, 2],
    right: [],
  });

  const hasWon = () => {
    const answers: boolean[] = [];
    (Object.keys(WIN_STATE) as Direction[]).forEach((key) => {
      const arrOnCurrAxis = completionState.current[key];
      arrOnCurrAxis.forEach((item, i) => {
        answers.push(completionState.current[key][i] === WIN_STATE[key][i]);
      });
    });
    return !answers.includes(false);
  };

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
        const indexToRemove = currObjectId.current;
        (Object.keys(completionState.current) as Direction[]).forEach((key) => {
          const arr = completionState.current[key];
          const idx = arr.indexOf(indexToRemove);
          if (idx !== -1) {
            arr.splice(idx, 1);
          }
        });
      } else {
        piecesPlacedCount.current++;
      }
      completionState.current[zone.current].push(currObjectId.current);
      prevObjectId.current = currObjectId.current;
      console.log('completion state', completionState.current);

      // Check success condition if all pieces are placed
      if (piecesPlacedCount.current === TOTAL_PIECES) {
        console.log('user has won ', hasWon());
      }
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
