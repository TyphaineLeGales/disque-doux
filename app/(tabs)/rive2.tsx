import { useRef, useEffect, useState } from 'react';
import { StyleSheet, Switch, View, Button, Text } from 'react-native';
import Rive, { Fit, RiveEvent, RiveRef } from 'rive-react-native';

export default function Screw() {
  // setting idle render retriggers a render
  const riveComponentRef = useRef<RiveRef>(null);
  const timer = useRef<NodeJS.Timeout | string>('');
  //const touchPosition = useRef({ x: 0, y: 0 });
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  // Track touch position
  //   const panResponder = PanResponder.create({
  //     onStartShouldSetPanResponder: () => true,
  //     onPanResponderGrant: (event) => {
  //       const { locationX, locationY } = event.nativeEvent;
  //       console.log('on pan responder', locationX, locationY);
  //       touchPosition.current = { x: locationX, y: locationY };
  //     },
  //   });

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

  useEffect(() => {
    if (isEnabled) {
      riveComponentRef.current?.setInputState('screw', 'isDone', true);
    }
  }, [isEnabled]);

  const setIdle = () => {
    riveComponentRef.current?.setInputState('screw', 'userIsIdle', true);
  };

  const handleStateChanges = (stateMachineName: string, stateName: string) => {
    if (stateName === 'Tracking' && counter > 0) {
      console.log('on tracking');
      clearTimeout(timer.current);
    }

    // if(stateName === "Detecting") {
    //     console.log("on detecting, position is:", touchPosition.current)
    // }
  };

  const onEvent = (event: RiveEvent) => {
    console.log('event received', event);
  };

  const nextChange = () => {
    riveComponentRef.current?.fireStateAtPath('starsOut', 'stars'); // access nested artoboard properties
  };

  return (
    <View style={styles.container}>
      <Rive
        ref={riveComponentRef}
        resourceName="screw"
        fit={Fit.Cover}
        style={{ width: '100%' }}
        stateMachineName="screw"
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
        <Button
          onPress={nextChange}
          title="Next"
          color="#FF6161"
          accessibilityLabel="Learn more about this purple button"
        />
        <Text>idle count: {counter}</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
    </View>
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
