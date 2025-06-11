import React, { useRef, useEffect } from 'react';
import Rive, { Fit, RiveEvent, RiveRef } from 'rive-react-native';

import { useLevelStore } from '@/stores/levelStore';

type AssembleProps = {
  onDone: Function;
  id: string;
  debug?: boolean;
};
export default function Assemble(props: AssembleProps) {
  const riveComponentRef = useRef<RiveRef>(null);
  const { setHideProgressBar } = useLevelStore();
  useEffect(() => {
    setHideProgressBar(true);
  }, []);

  const handleEvent = (event: RiveEvent) => {
    switch (event.name) {
      case 'Done':
        props.onDone();
        break;
    }
  };


  return (
    <Rive
      ref={riveComponentRef}
      resourceName="assemble_motion_6"
      fit={Fit.Cover}
      artboardName='Artboard'
      style={{ pointerEvents: 'none' }}
      onRiveEventReceived={handleEvent} 
    />
  );
}
