// src/utils/notificationService.js
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIF_KEY = 'expiry_notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const registerForPushNotificationsAsync = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  const { data } = await Notifications.getExpoPushTokenAsync();
  console.log('Push token:', data);
  return data;
};

// Safe date parser
const safeDate = (str) => {
  if (!str) return null;
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
};

export const scheduleItemExpiryNotification = async (item) => {
  if (!item?.expiry) {
    console.warn('No expiry → skip', item);
    return null;
  }

  let expiryDate = safeDate(item.expiry);
  if (!expiryDate) {
    console.warn('Invalid expiry → fallback +7 days', item.expiry);
    expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
  }

  const trigger = new Date(expiryDate);
  trigger.setDate(trigger.getDate() - 1);

  if (trigger <= new Date()) {
    console.log('Trigger in past → skip');
    return null;
  }

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Item Expiring Soon!',
      body: `${item.name} will expire tomorrow. Use it soon!`,
      data: { itemId: item.id },
    },
    trigger,
  });

  const map = await getNotificationMap();
  map[item.id] = identifier;
  await AsyncStorage.setItem(NOTIF_KEY, JSON.stringify(map));

  console.log('Scheduled ID:', identifier);
  return identifier;
};

export const cancelNotification = async (itemId) => {
  const map = await getNotificationMap();
  const id = map[itemId];
  if (id) {
    await Notifications.cancelScheduledNotificationAsync(id);
    delete map[itemId];
    await AsyncStorage.setItem(NOTIF_KEY, JSON.stringify(map));
  }
};

const getNotificationMap = async () => {
  const raw = await AsyncStorage.getItem(NOTIF_KEY);
  return raw ? JSON.parse(raw) : {};
};

export const rescheduleAll = async (items) => {
  const map = await getNotificationMap();
  for (const item of items) {
    if (map[item.id]) await cancelNotification(item.id);
    await scheduleItemExpiryNotification(item);
  }
};