import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const registerForPushNotificationsAsync = async () => {
  let token;
  
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log('Push token:', token);
  
  return token;
};

export const scheduleItemExpiryNotification = async (item) => {
  const trigger = new Date(item.expiry);
  // Schedule 1 day before expiry
  trigger.setDate(trigger.getDate() - 1);
  
  if (trigger > new Date()) {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Item Expiring Soon!',
        body: `${item.name} will expire tomorrow. Use it soon!`,
        data: { itemId: item.id },
      },
      trigger,
    });
    
    console.log('Scheduled notification with ID:', identifier);
    return identifier;
  }
  
  return null;
};

export const cancelNotification = async (identifier) => {
  if (identifier) {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  }
};