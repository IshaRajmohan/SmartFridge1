// ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [isDark, setIsDark] = useState(false);

  // Load saved theme preference
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('@theme_preference');
        if (savedTheme === 'dark' || savedTheme === 'light') {
          setTheme(savedTheme);
          setIsDark(savedTheme === 'dark');
        } else {
          setTheme('light');
          setIsDark(false);
        }
      } catch (error) {
        console.error('Failed to load theme preference', error);
        setTheme('light');
        setIsDark(false);
      }
    };

    loadThemePreference();
  }, []);

  // Update theme preference
  const updateTheme = async (newTheme) => {
    if (newTheme !== 'light' && newTheme !== 'dark') return;
    try {
      setTheme(newTheme);
      await AsyncStorage.setItem('@theme_preference', newTheme);
      setIsDark(newTheme === 'dark');
    } catch (error) {
      console.error('Failed to save theme preference', error);
    }
  };

  const themeColors = {
    light: {
      background: '#ffffff',
      card: '#f8f9fa',
      text: '#212529',
      border: '#dee2e6',
      primary: '#007bff',
      secondary: '#6c757d',
      success: '#28a745',
      danger: '#dc3545',
      warning: '#ffc107',
      info: '#17a2b8',
    },
    dark: {
      background: '#121212',
      card: '#1e1e1e',
      text: '#f8f9fa',
      border: '#343a40',
      primary: '#0d6efd',
      secondary: '#6c757d',
      success: '#198754',
      danger: '#dc3545',
      warning: '#ffc107',
      info: '#0dcaf0',
    },
  };

  const colors = isDark ? themeColors.dark : themeColors.light;

  return (
    <ThemeContext.Provider value={{ theme, isDark, colors, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};