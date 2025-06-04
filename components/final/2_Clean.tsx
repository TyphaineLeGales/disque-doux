import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Rive, { Fit, RiveRef } from 'rive-react-native';

import { useFaceSwitcher } from '@/hooks/useFaceSwitcher';

type CleanProps = {
  onDone: Function;
  id: string;
  debug?: boolean;
};

export default function Clean(props: CleanProps) {
  const riveRef = useRef<RiveRef>(null);
  const gesture = Gesture.Manual();
  const [currentFaceId, setCurrentFaceId] = useState(0);

  useEffect(() => {
    // for debugging and implementing the flow
    setTimeout(props.onDone, 3000);
  }, []);

  useEffect(() => {
    if (riveRef.current) {
      try {
        riveRef.current.setInputStateAtPath('FaceId', currentFaceId, 'Object');
      } catch (error) {
        console.warn('Failed to initialize Rive:', error);
      }
    }
  }, [riveRef.current]);

  useFaceSwitcher({
    riveRef,
    gesture,
    currentFaceId,
    onFaceChange: (faceId) => {
      setCurrentFaceId(faceId);
    },
  });

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
  });

  return (
    <View style={styles.container}>
      <GestureDetector gesture={gesture}>
        <View style={StyleSheet.absoluteFill}>
          <Rive
            ref={riveRef}
            resourceName="clean_2"
            fit={Fit.Cover}
            artboardName="Clean"
            style={[StyleSheet.absoluteFill, { zIndex: -1 }]}
          />
          <Text>Current Face: {currentFaceId}</Text>
        </View>
      </GestureDetector>
    </View>
  );
}
