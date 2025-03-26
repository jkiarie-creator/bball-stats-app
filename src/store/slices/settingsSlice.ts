import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getUserPreferences, saveUserPreferences } from '../../services/firebase';
import type { SettingsState } from '@/types';

const initialState: SettingsState = {
  theme: 'light',
  sound: {
    enabled: true,
    volume: 1.0,
  },
  vibration: {
    enabled: true,
    intensity: 1.0,
  },
  autoSave: true,
};

export const fetchUserPreferences = createAsyncThunk(
  'settings/fetchUserPreferences',
  async (userId: string) => {
    const preferences = await getUserPreferences(userId);
    return preferences;
  }
);

export const updateUserPreferences = createAsyncThunk(
  'settings/updateUserPreferences',
  async ({ userId, ...settings }: { userId: string } & SettingsState) => {
    await saveUserPreferences({ userId, ...settings });
    return settings;
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    toggleSound: (state) => {
      state.sound.enabled = !state.sound.enabled;
    },
    setSoundVolume: (state, action: PayloadAction<number>) => {
      state.sound.volume = Math.max(0, Math.min(1, action.payload));
    },
    toggleVibration: (state) => {
      state.vibration.enabled = !state.vibration.enabled;
    },
    setVibrationIntensity: (state, action: PayloadAction<number>) => {
      state.vibration.intensity = Math.max(0, Math.min(1, action.payload));
    },
    toggleAutoSave: (state) => {
      state.autoSave = !state.autoSave;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPreferences.fulfilled, (state, action) => {
        return { ...state, ...action.payload };
      })
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        return { ...state, ...action.payload };
      });
  },
});

export const {
  toggleTheme,
  toggleSound,
  setSoundVolume,
  toggleVibration,
  setVibrationIntensity,
  toggleAutoSave,
} = settingsSlice.actions;

export default settingsSlice.reducer;