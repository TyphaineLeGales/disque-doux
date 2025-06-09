import { Audio } from 'expo-av';
import { useEffect, useRef } from 'react';

export function useBackgroundMusic() {
  const soundRef = useRef<Audio.Sound | null>(null);
  const BACKGROUND_MUSIC = require('../assets/music/themeMusic.mp3');

  useEffect(() => {
    let isMounted = true;

    const playMusic = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(BACKGROUND_MUSIC, {
          isLooping: true,
          shouldPlay: true,
          volume: 0.5,
        });
        if (isMounted) {
          soundRef.current = sound;
          await sound.playAsync();
        }
      } catch (error) {
        console.error('Error loading background music:', error);
      }
    };

    playMusic();

    return () => {
      isMounted = false;
      soundRef.current?.unloadAsync();
    };
  }, []);
}
