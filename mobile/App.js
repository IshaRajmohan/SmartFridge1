// src/App.js  (full, ready-to-copy)
import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { SettingsProvider } from './src/contexts/SettingsContext';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from './src/utils/notificationService';

// Global handler (must be top-level)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  // Store the subscription objects (they have .remove())
  const notificationListener = useRef(null);
  const responseListener = useRef(null);

  useEffect(() => {
    registerForPushNotificationsAsync();

    // Add listeners – returns subscription objects
    notificationListener.current = Notifications.addNotificationReceivedListener(notif => {
      console.log('Notification received:', notif);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(resp => {
      console.log('Notification tapped:', resp);
    });

    return () => {
      // FIXED: Call .remove() on the subscription objects
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  return (
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