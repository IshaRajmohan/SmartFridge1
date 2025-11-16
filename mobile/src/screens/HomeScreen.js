// src/screens/HomeScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ItemCard from '../components/ItemCard';
import {
  scheduleItemExpiryNotification,
  rescheduleAll,
} from '../utils/notificationService';
import { formatDistanceToNow, parseISO, isBefore, addDays } from 'date-fns';

export default function HomeScreen({ route }) {
  const navigation = useNavigation();
  const [items, setItems] = useState([]);
  const [expiringItems, setExpiringItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  // ────── ADD NEW ITEM & UPDATE UI + NOTIFICATIONS IMMEDIATELY ──────
  useEffect(() => {
    if (route.params?.newItem) {
      const newItem = { ...route.params.newItem };

      // 1. Add to list
      setItems(prev => {
        const updated = [newItem, ...prev];

        // 2. Update badge & modal instantly
        updateExpiringSoon(updated);

        // 3. Schedule notification & persist
        scheduleItemExpiryNotification(newItem);
        rescheduleAll(updated); // refresh all just in case

        return updated;
      });

      // 4. Clear route param
      navigation.setParams({ newItem: undefined });
    }
  }, [route.params?.newItem, navigation]);

  // ────── RE-SCHEDULE ON FOCUS (fallback) ──────
  useFocusEffect(
    useCallback(() => {
      rescheduleAll(items);
      updateExpiringSoon(items);
    }, [items])
  );

  // ────── HELPER: find items expiring within 7 days ──────
  const updateExpiringSoon = (list = items) => {
    const soon = list.filter(i => {
      const exp = parseISO(i.expiry);
      const week = addDays(new Date(), 7);
      return isBefore(exp, week) && isBefore(new Date(), exp);
    });
    setExpiringItems(soon);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header + Bell Badge */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Fridge</Text>
          <Text style={styles.subtitle}>
            {items.length} item{items.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.notificationIcon}>
          <Ionicons name="notifications-outline" size={28} color="#2E7D32" />
          {expiringItems.length > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>{expiringItems.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Item List */}
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <ItemCard
            item={item}
            onPress={() => navigation.navigate('ItemDetails', { item })}
          />
        )}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="basket-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>Your fridge is empty</Text>
            <Text style={styles.emptySub}>Tap the camera to scan your first item</Text>
          </View>
        }
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Scan')}>
        <Ionicons name="camera" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Expiry Modal */}
      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Items Expiring Soon</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={28} color="#2E7D32" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            {expiringItems.length ? (
              expiringItems.map(i => {
                const days = formatDistanceToNow(parseISO(i.expiry), { addSuffix: true });
                return (
                  <View key={i.id} style={styles.notificationItem}>
                    <Text style={styles.notificationItemName}>{i.name}</Text>
                    <Text style={styles.notificationItemExpiry}>Expires {days}</Text>
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyNotification}>
                <Ionicons name="checkmark-circle-outline" size={60} color="#4CAF50" />
                <Text style={styles.emptyNotificationText}>No items expiring soon!</Text>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

/* ────── STYLES (unchanged) ────── */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
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
  title: { fontSize: 28, fontWeight: '700', color: '#2E7D32' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 4 },
  notificationIcon: { position: 'relative' },
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
  notificationBadgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  list: { padding: 20, paddingBottom: 100 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 18, color: '#999', marginTop: 16 },
  emptySub: { fontSize: 14, color: '#aaa', marginTop: 8 },
  fab: {
    position: 'absolute',
    bottom: 90,
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
  modalContainer: { flex: 1, backgroundColor: '#fff' },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: { fontSize: 24, fontWeight: '700', color: '#2E7D32' },
  modalContent: { flex: 1, padding: 20 },
  notificationItem: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  notificationItemName: { fontSize: 18, fontWeight: '600', color: '#333' },
  notificationItemExpiry: { fontSize: 14, color: '#666', marginTop: 4 },
  emptyNotification: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 60 },
  emptyNotificationText: { fontSize: 18, color: '#4CAF50', marginTop: 16, textAlign: 'center' },
});