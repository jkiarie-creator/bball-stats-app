import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { soundService } from '../services/sound.service';

export const VolumeControl: React.FC = () => {
  const [volume, setVolume] = React.useState(soundService.getVolume());

  const handleVolumeChange = async (value: number) => {
    await soundService.setVolume(value);
    setVolume(value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Volume</Text>
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          value={volume}
          onValueChange={handleVolumeChange}
          minimumTrackTintColor="#3498db"
          maximumTrackTintColor="#dcdde1"
          thumbTintColor="#3498db"
        />
        <Text style={styles.value}>{Math.round(volume * 100)}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
    height: 40,
  },
  value: {
    width: 45,
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'right',
  },
}); 