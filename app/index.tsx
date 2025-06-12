import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useRef, useEffect } from 'react';
import { Pressable } from 'react-native';
import Rive, { Fit, RiveRef } from 'rive-react-native';

const START_SOUND = require('../assets/music/SoundArrow.mp3');
export default function StartScreen() {
  const riveComponentRef = useRef<RiveRef>(null);
  const router = useRouter();
  const soundRef = useRef<Audio.Sound | null>();
  const loadSound = async () => {
    const { sound } = await Audio.Sound.createAsync(START_SOUND, {
      shouldPlay: false,
      volume: 0.9,
    });
    soundRef.current = sound;
  };

  useEffect(() => {
    loadSound();
  }, []);

  const onStart = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!soundRef.current) return;
    await soundRef.current.replayAsync();
    router.push('/narration/1');
  };

  return (
    <Pressable className="size-full" onPress={onStart}>
      <Rive
        ref={riveComponentRef}
        resourceName="start_narration_2"
        artboardName="main"
        fit={Fit.Cover}
        style={{ pointerEvents: 'none' }}
      />
    </Pressable>
  );
}
