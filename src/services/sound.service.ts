import { Audio } from 'expo-av';

interface GameSounds {
  buzzer: Audio.Sound;
  shotClock: Audio.Sound;
  warning: Audio.Sound;
}

class SoundService {
  private sounds: Partial<GameSounds> = {};
  private initialized = false;
  private volume: number = 1.0;

  async initialize() {
    if (this.initialized) return;

    try {
      const buzzerSound = new Audio.Sound();
      const shotClockSound = new Audio.Sound();
      const warningSound = new Audio.Sound();

      await Promise.all([
        buzzerSound.loadAsync(require('../assets/sounds/buzzer.mp3')),
        shotClockSound.loadAsync(require('../assets/sounds/shot-clock.mp3')),
        warningSound.loadAsync(require('../assets/sounds/warning.mp3')),
      ]);

      this.sounds = {
        buzzer: buzzerSound,
        shotClock: shotClockSound,
        warning: warningSound,
      };

      // Set initial volume for all sounds
      await this.setVolume(this.volume);

      this.initialized = true;
    } catch (error) {
      console.error('Failed to load sounds:', error);
    }
  }

  async setVolume(volume: number) {
    if (volume < 0 || volume > 1) return;
    
    this.volume = volume;
    try {
      await Promise.all([
        this.sounds.buzzer?.setVolumeAsync(volume),
        this.sounds.shotClock?.setVolumeAsync(volume),
        this.sounds.warning?.setVolumeAsync(volume),
      ]);
    } catch (error) {
      console.error('Failed to set volume:', error);
    }
  }

  getVolume(): number {
    return this.volume;
  }

  async playBuzzer() {
    try {
      if (!this.initialized) await this.initialize();
      await this.sounds.buzzer?.replayAsync();
    } catch (error) {
      console.error('Failed to play buzzer sound:', error);
    }
  }

  async playShotClock() {
    try {
      if (!this.initialized) await this.initialize();
      await this.sounds.shotClock?.replayAsync();
    } catch (error) {
      console.error('Failed to play shot clock sound:', error);
    }
  }

  async playWarning() {
    try {
      if (!this.initialized) await this.initialize();
      await this.sounds.warning?.replayAsync();
    } catch (error) {
      console.error('Failed to play warning sound:', error);
    }
  }

  async cleanup() {
    try {
      await Promise.all([
        this.sounds.buzzer?.unloadAsync(),
        this.sounds.shotClock?.unloadAsync(),
        this.sounds.warning?.unloadAsync(),
      ]);
      this.sounds = {};
      this.initialized = false;
    } catch (error) {
      console.error('Failed to cleanup sounds:', error);
    }
  }
}

export const soundService = new SoundService(); 