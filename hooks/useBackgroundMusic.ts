import { Audio } from 'expo-av';
import { useEffect, useRef } from 'react';

const BACKGROUND_MUSIC = require('../assets/music/themeMusic.mp3');

export function useBackgroundMusic() {
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    let isMounted = true;

    const startMusic = async () => {
      console.log(Audio);
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: false,
          playThroughEarpieceAndroid: false,
          interruptionModeIOS: 0, //MIX_WITH_OTHERS
        });

        const { sound } = await Audio.Sound.createAsync(BACKGROUND_MUSIC, {
          isLooping: true,
          volume: 0.025,
          shouldPlay: true,
        });

        if (isMounted) {
          soundRef.current = sound;
          await sound.playAsync();
        }
      } catch (e) {
        console.error('Error loading background music:', e);
      }
    };

    startMusic();

    return () => {
      isMounted = false;
      soundRef.current?.unloadAsync();
    };
  }, []);
}
