import * as Haptics from 'expo-haptics';
import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Rive, { Fit, RiveRef, RiveEvent } from 'rive-react-native';

type CleanProps = {
  onDone: Function;
  id: string;
  debug?: boolean;
  onProgress: (progress: number) => void;
};

type FaceState = {
  opacity: number;
  isCleaned: boolean;
};

const FACE_COUNT = 4;
const INITIAL_OPACITY = 100;
const OPACITY_DECREASE_RATE = 5;
const HAPTIC_INTERVAL = 100;
const CLEANING_INTERVAL = 200;

const useFaceStates = (faceCount: number) => {
  const [faceStates, setFaceStates] = useState<FaceState[]>(
    Array(faceCount).fill({ opacity: INITIAL_OPACITY, isCleaned: false })
  );

  const updateFaceOpacity = (faceId: number, newOpacity: number) => {
    setFaceStates((prev) => {
      const newStates = [...prev];
      newStates[faceId - 1] = {
        opacity: newOpacity,
        isCleaned: newOpacity === 0,
      };
      return newStates;
    });
  };

  return { faceStates, updateFaceOpacity };
};

const useCleaning = (
  faceStates: FaceState[],
  currentFaceId: number,
  updateFaceOpacity: (faceId: number, opacity: number) => void,
  riveRef: React.RefObject<RiveRef>,
  onDone: Function,
  onProgress: (progress: number) => void
) => {
  const [isInState, setIsInState] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const opacityInterval = useRef<NodeJS.Timeout>();
  const hapticsInterval = useRef<NodeJS.Timeout>();
  const prevCleanedCount = useRef(0);

  useEffect(() => {
    const cleanedFaces = faceStates.filter((face) => face.isCleaned).length;
    onProgress(cleanedFaces / FACE_COUNT);

    if (cleanedFaces > prevCleanedCount.current) {
      if (riveRef.current) {
        riveRef.current.fireStateAtPath('Animate', 'StarsAnimation');
        console.log('StarsAnimation triggered');
      }
    }
    prevCleanedCount.current = cleanedFaces;

    if (cleanedFaces > prevCleanedCount.current) {
      if (riveRef.current) {
        riveRef.current.fireStateAtPath('Animate', 'StarsAnimation');
        console.log('StarsAnimation triggered');
      }
    }
    prevCleanedCount.current = cleanedFaces;

    const allFacesCleaned = faceStates.every((face) => face.isCleaned);
    if (allFacesCleaned) {
      onDone();
    }
  }, [faceStates, onDone, onProgress, riveRef]);

  useEffect(() => {
    if (isInState && isDragging) {
      opacityInterval.current = setInterval(() => {
        const currentOpacity = faceStates[currentFaceId - 1].opacity;
        const newOpacity = Math.max(0, currentOpacity - OPACITY_DECREASE_RATE);

        updateFaceOpacity(currentFaceId, newOpacity);
        if (riveRef.current) {
          riveRef.current.setInputState('main', 'Opacity', newOpacity);
        }

        if (newOpacity === 0) {
          setIsInState(false);
        }
      }, CLEANING_INTERVAL);

      hapticsInterval.current = setInterval(() => {
        const currentOpacity = faceStates[currentFaceId - 1].opacity;
        if (currentOpacity > 70) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        } else if (currentOpacity > 30) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else if (currentOpacity > 0) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }, HAPTIC_INTERVAL);
    }

    return () => {
      if (opacityInterval.current) clearInterval(opacityInterval.current);
      if (hapticsInterval.current) clearInterval(hapticsInterval.current);
    };
  }, [isInState, isDragging, currentFaceId, faceStates]);

  return { isInState, setIsInState, isDragging, setIsDragging };
};

const useFaceNavigation = (faceStates: FaceState[], riveRef: React.RefObject<RiveRef>) => {
  const [currentFaceId, setCurrentFaceId] = useState(2);

  const navigateToFace = (newFaceId: number) => {
    setCurrentFaceId(newFaceId);
    if (riveRef.current) {
      riveRef.current.setInputState('main', 'FaceId', newFaceId);
      riveRef.current.setInputState('main', 'Opacity', faceStates[newFaceId - 1].opacity);
    }
  };

  const handleIncrement = () => {
    const newFaceId = currentFaceId === FACE_COUNT ? 1 : currentFaceId + 1;
    navigateToFace(newFaceId);
  };

  const handleDecrement = () => {
    const newFaceId = currentFaceId === 1 ? FACE_COUNT : currentFaceId - 1;
    navigateToFace(newFaceId);
  };

  return { currentFaceId, handleIncrement, handleDecrement };
};

export default function Clean({ debug = false, onDone, onProgress, ...props }: CleanProps) {
  const riveRef = useRef<RiveRef>(null);
  const [clientCoords, setClientCoords] = useState({ x: 0, y: 0 });
  const [riveData, setRiveData] = useState<any>(null);
  const { faceStates, updateFaceOpacity } = useFaceStates(FACE_COUNT);
  const { currentFaceId, handleIncrement, handleDecrement } = useFaceNavigation(
    faceStates,
    riveRef
  );
  const { isInState, setIsInState, isDragging, setIsDragging } = useCleaning(
    faceStates,
    currentFaceId,
    updateFaceOpacity,
    riveRef,
    onDone,
    onProgress
  );

  //DEBUG - CAN BE REMOVED
  useEffect(() => {
    setTimeout(onDone, 1000);
  }, []);

  const handleEvent = (event: RiveEvent) => {
    
    switch (event.name) {
      case 'StainEnter':
        setIsInState(true);
        break;
      case 'StainExit':
        setIsInState(false);
        break;
      case 'StartDrag':
        setIsDragging(true);
        break;
      case 'EndDrag':
        setIsDragging(false);
        break;
      case 'Increment':
        handleIncrement();
        break;
      case 'Decrement':
        handleDecrement();
        break;
    }
  };

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFill}>
        <Rive
          ref={riveRef}
          resourceName="nettoyage_20"
          fit={Fit.Cover}
          artboardName="Clean"
          onRiveEventReceived={handleEvent}
          style={[StyleSheet.absoluteFill, { zIndex: -1 }]}
        />
        {debug && (
          <>
            <Text>Current Face: {currentFaceId}</Text>
            <Text>Is In State: {isInState ? 'true' : 'false'}</Text>
            <Text>Is Dragging: {isDragging ? 'true' : 'false'}</Text>
            <Text style={{ paddingTop: 200 }}>
              Face Opacities: {faceStates.map((f) => f.opacity).join(', ')}
            </Text>
            <Text style={{ paddingTop: 20 }}>
              Touch Coordinates: X: {clientCoords.x.toFixed(2)}, Y: {clientCoords.y.toFixed(2)}
            </Text>
            {riveData && (
              <>
                <Text style={{ paddingTop: 20 }}>
                  Artboard: {JSON.stringify(riveData.artboard)}
                </Text>
                <Text style={{ paddingTop: 10 }}>
                  State Machine: {JSON.stringify(riveData.stateMachine)}
                </Text>
                <Text style={{ paddingTop: 10 }}>Inputs: {JSON.stringify(riveData.inputs)}</Text>
                <Text style={{ paddingTop: 10 }}>File: {JSON.stringify(riveData.file)}</Text>
              </>
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
