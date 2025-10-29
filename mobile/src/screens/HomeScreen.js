// src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ItemCard from '../components/ItemCard';

export default function HomeScreen({ navigation, route }) {
  const [items, setItems] = useState([
    { id: '1', name: 'Milk', expiry: '2025-10-28' },
    { id: '2', name: 'Tomatoes', expiry: '2025-10-30' },
  ]);

  // ─── Receive scanned item from ScannerScreen ─────────────────────
  useEffect(() => {
    if (route.params?.newItem) {
      setItems(prev => [route.params.newItem, ...prev]);
      // Clear param to prevent duplicate adds
      navigation.setParams({ newItem: null });
    }
  }, [route.params?.newItem, navigation]);

  // ─── Render ─────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Fridge</Text>
        <Text style={styles.subtitle}>
          {items.length} item{items.length !== 1 ? 's' : ''}
        </Text>
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
});