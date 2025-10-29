// mobile/App.js
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { getToken } from './src/utils/authStorage';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRouteName, setInitialRouteName] = useState('Splash');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getToken();
        setInitialRouteName(token ? 'AppTabs' : 'Splash');
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  if (isLoading) {
    return null; // Or a loading screen component
  }

  return (
    <NavigationContainer>
      <AppNavigator initialRouteName={initialRouteName} />
    </NavigationContainer>
  );
}