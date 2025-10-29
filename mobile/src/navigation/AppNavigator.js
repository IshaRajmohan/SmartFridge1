import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import Dashboard from '../screens/Dashboard';
import HomeScreen from '../screens/HomeScreen';
import ManualEntry from '../screens/ManualEntry';
import ScannerScreen from '../screens/ScannerScreen';
import RecipesScreen from '../screens/RecipesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ItemDetailsScreen from '../screens/ItemDetailsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Bottom Tabs
function Tabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ tabBarIcon: ({ color }) => <Ionicons name="speedometer-outline" size={24} color={color} /> }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} /> }}
      />
      <Tab.Screen
        name="Scan"
        component={ScannerScreen}
        options={{ tabBarIcon: ({ color }) => <Ionicons name="barcode-outline" size={24} color={color} /> }}
      />
      <Tab.Screen
        name="Recipes"
        component={RecipesScreen}
        options={{ tabBarIcon: ({ color }) => <Ionicons name="restaurant-outline" size={24} color={color} /> }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={24} color={color} /> }}
      />
    </Tab.Navigator>
  );
}

// Main Navigator
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="ItemDetails" component={ItemDetailsScreen} />
        <Stack.Screen name="ManualEntry" component={ManualEntry} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
