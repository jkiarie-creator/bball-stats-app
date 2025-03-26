import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

export function useSound() {
  const [buzzer, setBuzzer] = useState<Audio.Sound>();
  const [warning, setWarning] = useState<Audio.Sound>();
  const { sound } = useSelector((state: RootState) => state.settings);

  useEffect(() => {
    loadSounds();
    return () => {
      unloadSounds();
    };
  }, []);

  const loadSounds = async () => {
    try {
      const buzzerSound = new Audio.Sound();
      await buzzerSound.loadAsync(require('@/assets/sounds/buzzer.mp3'));
      setBuzzer(buzzerSound);

      const warningSound = new Audio.Sound();
      await warningSound.loadAsync(require('@/assets/sounds/warning.mp3'));
      setWarning(warningSound);
    } catch (error) {
      console.error('Error loading sounds:', error);
    }
  };

  const unloadSounds = async () => {
    try {
      if (buzzer) {
        await buzzer.unloadAsync();
      }
      if (warning) {
        await warning.unloadAsync();
      }
    } catch (error) {
      console.error('Error unloading sounds:', error);
    }
  };

  const playBuzzer = async () => {
    if (!sound.enabled || !buzzer) return;
    try {
      await buzzer.setVolumeAsync(sound.volume);
      await buzzer.setPositionAsync(0);
      await buzzer.playAsync();
    } catch (error) {
      console.error('Error playing buzzer:', error);
    }
  };

  const playWarning = async () => {
    if (!sound.enabled || !warning) return;
    try {
      await warning.setVolumeAsync(sound.volume);
      await warning.setPositionAsync(0);
      await warning.playAsync();
    } catch (error) {
      console.error('Error playing warning:', error);
    }
  };

  return {
    playBuzzer,
    playWarning,
  };
}
