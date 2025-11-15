// src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ItemCard from '../components/ItemCard';
import { scheduleItemExpiryNotification } from '../utils/notificationService';
import { formatDistanceToNow, parseISO, isBefore, addDays } from 'date-fns';

export default function HomeScreen({ navigation, route }) {
  const [items, setItems] = useState([
    { id: '1', name: 'Milk', expiry: '2025-11-18' }, // Expires in 2 days
    { id: '2', name: 'Tomatoes', expiry: '2025-11-17' }, // Expires tomorrow
    { id: '3', name: 'Cheese', expiry: '2025-11-20' }, // Expires in 4 days
    { id: '4', name: 'Bread', expiry: '2025-11-16' }, // Expires today
  ]);
  
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [expiringItems, setExpiringItems] = useState([]);

  // ─── Schedule notifications for existing items ─────────────────────
  useEffect(() => {
    items.forEach(item => {
      scheduleItemExpiryNotification(item);
    });
    
    // Find items expiring within a week
    const itemsExpiringSoon = items.filter(item => {
      const expiryDate = parseISO(item.expiry);
      const oneWeekFromNow = addDays(new Date(), 7);
      return isBefore(expiryDate, oneWeekFromNow) && isBefore(new Date(), expiryDate);
    });
    
    setExpiringItems(itemsExpiringSoon);
  }, []);

  // ─── Receive scanned item from ScannerScreen ─────────────────────
  useEffect(() => {
    if (route.params?.newItem) {
      const newItem = route.params.newItem;
      setItems(prev => [newItem, ...prev]);
      
      // Schedule notification for the new item
      scheduleItemExpiryNotification(newItem);
      
      // Update expiring items list
      const expiryDate = parseISO(newItem.expiry);
      const oneWeekFromNow = addDays(new Date(), 7);
      if (isBefore(expiryDate, oneWeekFromNow) && isBefore(new Date(), expiryDate)) {
        setExpiringItems(prev => [...prev, newItem]);
      }
      
      // Clear param to prevent duplicate adds
      navigation.setParams({ newItem: null });
    }
  }, [route.params?.newItem, navigation]);

  const openNotificationModal = () => {
    // Refresh the expiring items list
    const itemsExpiringSoon = items.filter(item => {
      const expiryDate = parseISO(item.expiry);
      const oneWeekFromNow = addDays(new Date(), 7);
      return isBefore(expiryDate, oneWeekFromNow) && isBefore(new Date(), expiryDate);
    });
    
    setExpiringItems(itemsExpiringSoon);
    setNotificationModalVisible(true);
  };

  // ─── Render ─────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Fridge</Text>
          <Text style={styles.subtitle}>
            {items.length} item{items.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <TouchableOpacity onPress={openNotificationModal} style={styles.notificationIcon}>
          <Ionicons name="notifications-outline" size={28} color="#2E7D32" />
          {expiringItems.length > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>{expiringItems.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        renderItem={({ item }) => (
          <ItemCard
            item={item}
            onPress={() => navigation.navigate('ItemDetails', { item })}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="basket-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>Your fridge is empty</Text>
            <Text style={styles.emptySub}>Tap + to scan your first item</Text>
          </View>
        }
      />

      {/* ─── Floating Action Button ────────────────────────────────── */}
      <TouchableOpacity
  style={styles.fab}
  onPress={() => navigation.navigate('Scan')} // Now works!
>
  <Ionicons name="camera" size={28} color="#fff" />
</TouchableOpacity>
      
      {/* ─── Notification Modal ────────────────────────────────── */}
      <Modal
        visible={notificationModalVisible}
        animationType="slide"
        onRequestClose={() => setNotificationModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Items Expiring Soon</Text>
            <TouchableOpacity onPress={() => setNotificationModalVisible(false)}>
              <Ionicons name="close" size={28} color="#2E7D32" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {expiringItems.length > 0 ? (
              expiringItems.map(item => {
                const expiryDate = parseISO(item.expiry);
                const daysLeft = formatDistanceToNow(expiryDate, { addSuffix: true });
                
                return (
                  <View key={item.id} style={styles.notificationItem}>
                    <Text style={styles.notificationItemName}>{item.name}</Text>
                    <Text style={styles.notificationItemExpiry}>Expires {daysLeft}</Text>
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyNotification}>
                <Ionicons name="checkmark-circle-outline" size={60} color="#4CAF50" />
                <Text style={styles.emptyNotificationText}>No items expiring within the next week!</Text>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2E7D32',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  notificationIcon: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#F44336',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  list: {
    padding: 20,
    paddingBottom: 100, // Space for FAB + tab bar
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 16,
  },
  emptySub: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 90, // Above tab bar (~60) + margin
    right: 30,
    backgroundColor: '#4CAF50',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2E7D32',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  notificationItem: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  notificationItemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  notificationItemExpiry: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  emptyNotification: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  emptyNotificationText: {
    fontSize: 18,
    color: '#4CAF50',
    marginTop: 16,
    textAlign: 'center',
  },
});