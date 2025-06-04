import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { Dimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  withDecay,
  useSharedValue,
  useAnimatedReaction,
  runOnJS,
  useAnimatedRef,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Rive, { Fit, RiveGeneralEvent, RiveRef } from 'rive-react-native'; // Adjust to your Rive version

type DisassembleProps = {
  onDone: Function;
  showTuto: boolean;
};

const { width, height } = Dimensions.get('window');
const CENTER = { x: width / 2, y: height / 2 };
const THRESHOLD = 360 * 3; // e.g., 3 full rotations
const SPEED = 0.8;
export default function Unscrew(props: DisassembleProps) {
  const riveRefTuto = useRef<RiveRef>(null);
  const riveRefGame = useRef<RiveRef>(null);
  const angle = useSharedValue(0); // cumulative angle
  const prevAngle = useSharedValue(0);
  const isDone = useRef(false);

  useEffect(() => {
    riveRefGame.current?.setInputState('State Machine 1', 'showTuto', props.showTuto);
    if (!props.showTuto) {
      riveRefGame.current?.fireState('State Machine 1', 'transitionIn');
    }
  }, []);

  // 👇 Convert touch to angle

  const getAngleFromTouch = (x: number, y: number) => {
    'worklet';
    const dx = x - CENTER.x;
    const dy = y - CENTER.y;
    return Math.atan2(dy, dx);
  };
  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .onBegin((e) => {
          prevAngle.value = getAngleFromTouch(e.x, e.y);
        })
        .onUpdate((e) => {
          const current = getAngleFromTouch(e.x, e.y);
          let delta = current - prevAngle.value;

          // Normalize angle to avoid jumps at -π <-> π
          if (delta > Math.PI) delta -= 2 * Math.PI;
          if (delta < -Math.PI) delta += 2 * Math.PI;

          angle.value += delta * (180 / Math.PI); // convert radians to degrees
          prevAngle.value = current;
        })
        .onFinalize((e) => {
          'worklet';

          // Estimate angular velocity from gesture
          const vx = e.velocityX;
          const vy = e.velocityY;

          const dx = e.x - CENTER.x;
          const dy = e.y - CENTER.y;

          // Tangential velocity: perpendicular to radius
          const radius = Math.sqrt(dx * dx + dy * dy);
          if (radius === 0) return;

          const tangentialV = (vx * -dy + vy * dx) / radius;
          const angularVelocity = tangentialV / radius; // rad/s

          // Apply decay to angle, converting radians/sec to degrees/sec
          angle.value = withDecay({
            velocity: angularVelocity * (180 / Math.PI),
            deceleration: 0.995, // fine-tune this
            clamp: [0, 10000], // optional clamp
          });
        }),
    []
  );

  const updateRiveState = useCallback(
    (num: number) => {
      if (isDone.current) return;

      if (num < THRESHOLD) {
        riveRefGame.current?.setInputStateAtPath('progressPosition', num / 10, 'screw'); // modulo 100 === 1 turn -> we need to do several turns,
        riveRefGame.current?.setInputStateAtPath('progressRotation', num % 100, 'screw');
      } else {
        isDone.current = true;
        riveRefGame.current?.fireState('State Machine 1', 'onScrewDone');
        setTimeout(props.onDone, 500);
      }
    },
    [props.onDone]
  );

  useAnimatedReaction(
    () => angle.value,
    (data) => {
      const scaledProgress = data * SPEED; // convert angle (deg) to progress
      runOnJS(updateRiveState)(scaledProgress);
    },
    [updateRiveState]
  );

  const handleRiveEvent = (event: RiveGeneralEvent) => {
    if (event.name === 'showmask') {
      riveRefGame.current?.setInputStateAtPath('showMask', true, 'screw');
    }
    if (event.name === 'hideTuto') {
      riveRefGame.current?.fireState('State Machine 1', 'transitionIn');
      riveRefTuto.current?.fireState('State Machine 1', 'hide');
      // riveRefTuto.current?.pause();
      riveRefGame.current?.setInputStateAtPath('showMask', true, 'screw');
    }
  };

  return (
    <View className="h-full w-full flex-1">
      <View className="relative h-full w-full">
        <View className="absolute top-0 h-full w-full">
          <Rive
            ref={riveRefGame}
            resourceName="pop_up_devisse_11"
            artboardName="Game"
            fit={Fit.Contain}
            onRiveEventReceived={handleRiveEvent}
            style={{ width: '100%', pointerEvents: 'none' }}
          />
        </View>
        {props.showTuto && (
          <View className="absolute top-0 h-full w-full">
            <Rive
              ref={riveRefTuto}
              resourceName="pop_up_devisse_11"
              artboardName="Tuto"
              fit={Fit.Contain}
              onRiveEventReceived={handleRiveEvent}
              style={{ width: '100%', pointerEvents: 'none' }}
            />
          </View>
        )}
      </View>
      <GestureDetector gesture={panGesture}>
        <View className="absolute h-full w-full " />
      </GestureDetector>
    </View>
  );
}
