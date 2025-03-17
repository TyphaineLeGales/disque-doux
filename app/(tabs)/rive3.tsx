import { useRef, useState, useEffect } from 'react';
import { SafeAreaView, PanResponder, View, Dimensions, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useDerivedValue,
  runOnJS,
} from 'react-native-reanimated';
import Rive, { Fit, RiveRef } from 'rive-react-native';

const { width } = Dimensions.get('window');
const SIZE = width;
const RADIUS = 100;
const CENTER = SIZE / 2;
const FULL_CIRCLE = Math.PI * 2;
const SCREWSPEED = 3;

export default function test() {
  const riveComponentRef = useRef<RiveRef>(null);
  const angle = useSharedValue(0);
  const progress = useSharedValue(0);
  const [displayProgress, setDisplayProgress] = useState(0); // UI state for displaying progress
  const startTouchX = useRef(0);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (_, gestureState) => {
      startTouchX.current = gestureState.x0;
    },
    onPanResponderRelease: (_, gestureState) => {
      const endTouchX = gestureState.moveX;
      const addedAcceleration = Math.abs(endTouchX - startTouchX.current) / (SIZE / SCREWSPEED);
      console.log('added acceleration', addedAcceleration);
      angle.value = withSpring(angle.value + addedAcceleration * FULL_CIRCLE * 0.2);
    },
  });

  // Derived value to calculate progress and sync with React state
  useDerivedValue(() => {
    const newProgress = ((angle.value % FULL_CIRCLE) / FULL_CIRCLE) * 100;
    progress.value = newProgress;
    runOnJS(setDisplayProgress)(newProgress);
  });

  const animatedStyle = useAnimatedStyle(() => {
    const x = CENTER + Math.cos(angle.value) * RADIUS;
    const y = CENTER + Math.sin(angle.value) * RADIUS;
    return {
      transform: [{ translateX: x - 12.5 }, { translateY: y - 12.5 }],
    };
  });

  useEffect(() => {
    riveComponentRef.current?.setInputState('main', 'progress', displayProgress);
  }, [displayProgress]);

  return (
    <SafeAreaView className="relative flex-1 items-center justify-center bg-slate-200">
      <Rive
        ref={riveComponentRef}
        resourceName="test_2"
        fit={Fit.Contain}
        className="absolute"
        style={{ width: '100%', PointerEvent: 'none' }}
        stateMachineName="main"
      />
      <View className="absolute h-full w-full border" {...panResponder.panHandlers}>
        {/* <View className="relative h-1/2 bg-orange-200 opacity-[0.25]">
          <Animated.View
            style={[animatedStyle]}
            className="absolute h-[25px] w-[25px] bg-slate-800"
          />
        </View> */}
        <Text>{`Progress: ${displayProgress.toFixed(0)}%`}</Text>
      </View>
    </SafeAreaView>
  );
}
