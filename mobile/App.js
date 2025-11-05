// mobile/App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';

import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { SettingsProvider } from './src/contexts/SettingsContext';


export default function App() {
  return (
    <NavigationContainer>
      {/* Always start at Splash → SignIn */}
      <AppNavigator initialRouteName="Splash" />
    </NavigationContainer>
  );
}