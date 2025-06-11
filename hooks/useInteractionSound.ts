import { Audio } from 'expo-av';
import { useRef, useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedReaction, runOnJS } from 'react-native-reanimated';

const SCREWDRIVER_SOUND = require('../assets/music/SoundTournevisPopup.mp3');
export const useInteractionSound = (progress: Animated.SharedValue<number>) => {
  const soundRef = useRef<Audio.Sound | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const loadSound = async () => {
    const { sound } = await Audio.Sound.createAsync(SCREWDRIVER_SOUND, {
      shouldPlay: false,
      volume: 0.8,
    });
    soundRef.current = sound;
  };

  const playSound = async () => {
    if (!soundRef.current) return;
    await soundRef.current.replayAsync();
  };

  const startSoundLoop = () => {
    if (intervalRef.current) return; // Already running
    intervalRef.current = setInterval(() => {
      playSound();
    }, 500); // Every 300ms (adjust as needed)
  };

  const stopSoundLoop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    loadSound();
    return () => {
      soundRef.current?.unloadAsync();
      stopSoundLoop();
    };
  }, []);

  // React to motion
  const lastProgress = useSharedValue(progress.value);

  useAnimatedReaction(
    () => progress.value,
    (current, previous) => {
      if (Math.abs(current - lastProgress.value) > 0.1) {
        runOnJS(startSoundLoop)();
      } else {
        runOnJS(stopSoundLoop)();
      }
      lastProgress.value = current;
    },
    []
  );
};
