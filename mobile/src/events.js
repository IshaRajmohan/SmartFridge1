// src/events.js
import { EventRegister } from 'react-native-event-listeners';

export const emitItemAdded = (item) => EventRegister.emit('itemAdded', item);
export const listenItemAdded = (cb) => EventRegister.addEventListener('itemAdded', cb);