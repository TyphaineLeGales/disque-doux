import { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import Rive, { Fit, RiveEvent, RiveRef } from 'rive-react-native';

export default function Screw() {
  // setting idle render retriggers a render
  const riveComponentRef = useRef<RiveRef>(null);
  const timer = useRef<NodeJS.Timeout | string>('');

  const [counter, setCounter] = useState(15);
  useEffect(() => {
    riveComponentRef.current?.setInputState('screw', 'userIsIdle', false);
  }, []);

  useEffect(() => {
    if (counter > 0) {
      timer.current = setTimeout(() => setCounter(counter - 1), 1000);
    } else {
      setIdle();
    }
  }, [counter]);

  const setIdle = () => {
    riveComponentRef.current?.setInputState('screw', 'userIsIdle', true);
  };

  const handleStateChanges = (stateMachineName: string, stateName: string) => {
    if (stateName === 'Tracking' && counter > 0) {
      console.log('on tracking');
      clearTimeout(timer.current);
    }

    if (stateName === 'Completion') {
      console.log('on completion');
      // trigger nextIn
      riveComponentRef.current?.fireStateAtPath('NextIn', 'Next');
    }

    // if(stateName === "Detecting") {
    //     console.log("on detecting, position is:", touchPosition.current)
    // }
  };

  const onEvent = (event: RiveEvent) => {
    console.log('event received', event);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Rive
        ref={riveComponentRef}
        resourceName="screw"
        fit={Fit.Contain}
        style={{ width: '100%' }}
        stateMachineName="screw "
        onStateChanged={handleStateChanges}
        onRiveEventReceived={onEvent}
      />
      <View
        style={{
          height: '10%',
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 12,
        }}>
        <Text>idle count: {counter}</Text>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 5,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    alignSelf: 'center',
  },
});
