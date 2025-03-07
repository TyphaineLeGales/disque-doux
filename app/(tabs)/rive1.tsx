import { forwardRef, useRef } from 'react';
import { Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Rive, { Fit, RiveRef } from 'rive-react-native';

function RiveComponent() {
  const riveComponentRef = useRef<RiveRef>(null);

  const triggerBump = () => riveComponentRef.current?.fireState('bumpy', 'bump');

  return (
    <SafeAreaView className="flex-1">
      <Button title="Bump" onPress={triggerBump} />
      <Rive
        ref={riveComponentRef}
        resourceName="vehicles"
        fit={Fit.Cover}
        style={{
          width: '100%',
          height: '100%',
        }}
        stateMachineName="bumpy"
      />
    </SafeAreaView>
  );
}

export default forwardRef(RiveComponent);
