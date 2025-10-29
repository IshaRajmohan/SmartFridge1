import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { FridgeProvider } from './src/contexts/FridgeContext';

export default function App() {
  return (
    <FridgeProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </FridgeProvider>
  );
}
