import React, { useRef, useEffect } from 'react';
import Rive, { Fit, RiveRef } from 'rive-react-native';

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

  return (
    <Rive
      ref={riveComponentRef}
      resourceName="assemble_motion_2"
      fit={Fit.Contain}
      style={{ pointerEvents: 'none' }}
    />
  );
}
