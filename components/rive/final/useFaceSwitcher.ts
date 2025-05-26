import { useCallback } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { 
  useSharedValue,
  runOnJS,
  withTiming,
} from 'react-native-reanimated';
import { RiveRef } from 'rive-react-native';

type Direction = 'left' | 'right' | null;

type UseFaceSwitcherProps = {
  riveRef: React.RefObject<RiveRef>;
  gesture: Gesture;
  onFaceChange?: (faceId: number) => void;
  numFaces?: number;
  currentFaceId: number;
};

export function useFaceSwitcher({
  riveRef,
  gesture,
  onFaceChange,
  numFaces = 4,
  currentFaceId,
}: UseFaceSwitcherProps) {
  const isMenuMode = useSharedValue(false);
  const touchStartX = useSharedValue(0);
  const pressProgress = useSharedValue(0);
  const currentDirection = useSharedValue<Direction>(null);

  const getDirection = useCallback((dx: number) => {
    'worklet';
    const minSwipeDistance = 50;
    if (Math.abs(dx) < minSwipeDistance) return null;
    return dx > 0 ? 'right' : 'left';
  }, []);

  const updateFaceId = useCallback((direction: Direction) => {
    if (!direction) return;
    
    let newFaceId = currentFaceId;
    if (direction === 'right') {
      newFaceId = (currentFaceId + 1) % numFaces;
    } else if (direction === 'left') {
      newFaceId = (currentFaceId - 1 + numFaces) % numFaces;
    }
    
    try {
      riveRef.current?.setInputStateAtPath("FaceId", newFaceId, "Object");
    } catch (error) {
      console.warn('Failed to update Rive face:', error);
    }
    onFaceChange?.(newFaceId);
  }, [numFaces, onFaceChange, riveRef, currentFaceId]);

  gesture
    .onTouchesDown((e, manager) => {
      'worklet';
      const touch = e.changedTouches[0];
      touchStartX.value = touch.x;
      isMenuMode.value = true;
      currentDirection.value = null;
      pressProgress.value = withTiming(1, {
        duration: 200,
      });
      manager.activate();
    })
    .onTouchesMove((e, manager) => {
      'worklet';
      if (!isMenuMode.value) return;
      
      const touch = e.changedTouches[0];
      const dx = touch.x - touchStartX.value;
      const direction = getDirection(dx);
      if (direction !== currentDirection.value) {
        currentDirection.value = direction;
      }
    })
    .onTouchesUp(() => {
      'worklet';
      if (!isMenuMode.value) return;
      
      if (currentDirection.value) {
        runOnJS(updateFaceId)(currentDirection.value);
      }
      isMenuMode.value = false;
      pressProgress.value = 0;
      currentDirection.value = null;
    });
} 