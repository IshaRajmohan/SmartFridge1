// mobile/App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';

// ✅ Import both providers
import { ThemeProvider } from './src/contexts/ThemeContext';
import { SettingsProvider } from './src/contexts/SettingsContext';

export default function App() {
  return (
    // 🧠 Wrap everything inside ThemeProvider → SettingsProvider → Navigation
    <ThemeProvider>
      <SettingsProvider>
        <NavigationContainer>
          <AppNavigator initialRouteName="Splash" />
          <StatusBar style="auto" />
        </NavigationContainer>
      </SettingsProvider>
    </ThemeProvider>
  );
}
