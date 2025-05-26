import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Rive, { Fit, RiveRef } from 'rive-react-native';
import { useFaceSwitcher } from './useFaceSwitcher';
import { Text } from 'react-native';

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
    if (riveRef.current) {
      try {
        riveRef.current.setInputStateAtPath("FaceId", currentFaceId, "Object");
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
    }
  });

  return (
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
  );
}
