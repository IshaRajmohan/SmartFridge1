// SettingsContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    reminderDays: 3,
    profile: {
      name: '',
      email: '',
      phone: '',
      gender: '',
      photo: null,
    },
  });

  // Load settings from storage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem('@app_settings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error('Failed to load settings', error);
      }
    };

    loadSettings();
  }, []);

  // Save settings to storage when they change
  useEffect(() => {
    const saveSettings = async () => {
      try {
        await AsyncStorage.setItem('@app_settings', JSON.stringify(settings));
      } catch (error) {
        console.error('Failed to save settings', error);
      }
    };

    saveSettings();
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  const updateProfile = (profileData) => {
    setSettings(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...profileData
      }
    }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, updateProfile }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};