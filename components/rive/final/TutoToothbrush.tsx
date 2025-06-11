import React, { useState, useRef, useEffect } from 'react';
import { View } from 'react-native';
import Rive, { Fit, RiveRef } from 'rive-react-native'; // Adjust to your Rive version
type TutoToothbrushProps = {
  piecesInInventory: number[];
};

export default function TutoToothbrush(props: TutoToothbrushProps) {
  const riveRef = useRef<RiveRef>(null);
  const [showTuto, setShowTuto] = useState(false);
  const idleInterval = useRef<NodeJS.Timeout>();
  const tutoHasBeenShown = useRef(false);
  const handleStateChange = (stateMachineName: string, stateName: string) => {
    if (stateName === 'hide') {
      setTimeout(() => setShowTuto(false), 300);
    }
  };
  useEffect(() => {
    clearTimeout(idleInterval.current);
    if (tutoHasBeenShown.current) return;
    if (props.piecesInInventory.length === 8) {
      idleInterval.current = setTimeout(() => {
        setShowTuto(true);
        tutoHasBeenShown.current = true;
      }, 3000);
    }

    return () => clearTimeout(idleInterval.current);
  }, [props.piecesInInventory]);

  return (
    <View
      className={`${!showTuto ? 'pointer-events-none' : ''} absolute left-0 top-0 h-full w-full flex-1`}>
      {showTuto && (
        <Rive
          ref={riveRef}
          resourceName="tuto_tools_box_2"
          artboardName="TutoToolBoxNettoie"
          fit={Fit.Cover}
          style={{ width: '100%', pointerEvents: 'none' }}
          onStateChanged={handleStateChange}
        />
      )}
    </View>
  );
}
