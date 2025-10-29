// mobile/utils/storage.js
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getStorage = () => {
  if (Platform.OS === 'web') {
    return {
      getItem: async (key) => Promise.resolve(localStorage.getItem(key)),
      setItem: async (key, value) => Promise.resolve(localStorage.setItem(key, value)),
      removeItem: async (key) => Promise.resolve(localStorage.removeItem(key)),
    };
  } else {
    return AsyncStorage;
  }
};

export default getStorage();
