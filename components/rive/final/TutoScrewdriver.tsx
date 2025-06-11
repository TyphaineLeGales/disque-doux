import React, { useState, useRef, useEffect } from 'react';
import { View } from 'react-native';
import Rive, { Fit, RiveRef } from 'rive-react-native'; // Adjust to your Rive version
type TutoScrewdriverProps = {
  screwsLeft: number[];
};

export default function TutoScrewdriver(props: TutoScrewdriverProps) {
  const riveRef = useRef<RiveRef>(null);
  const [showTuto, setShowTuto] = useState(false);
  const idleInterval = useRef<NodeJS.Timeout>();

  const handleStateChange = (stateMachineName: string, stateName: string) => {
    if (stateName === 'hide') {
      setTimeout(() => setShowTuto(false), 300);
    }
  };
  useEffect(() => {
    clearTimeout(idleInterval.current);

    if (props.screwsLeft.length === 4) {
      idleInterval.current = setTimeout(() => {
        setShowTuto(true);
      }, 7000);
    }
    if (props.screwsLeft.length === 0) {
      idleInterval.current = setTimeout(() => {
        setShowTuto(true);
      }, 7000);
    }

    return () => clearTimeout(idleInterval.current);
  }, [props.screwsLeft]);

  return (
    <View
      className={`${!showTuto ? 'pointer-events-none' : ''} absolute left-0 top-0 h-full w-full flex-1`}>
      {showTuto && (
        <Rive
          ref={riveRef}
          resourceName="tuto_tools_box_2"
          artboardName="TutoToolBoxScrew"
          fit={Fit.Cover}
          style={{ width: '100%', pointerEvents: 'none' }}
          onStateChanged={handleStateChange}
        />
      )}
    </View>
  );
}
