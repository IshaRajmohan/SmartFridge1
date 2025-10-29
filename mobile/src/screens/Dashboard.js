import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView, Dimensions } from 'react-native';
import { FridgeContext } from '../contexts/FridgeContext';
import { parseExpiry } from '../utils/expiryParser';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function Dashboard({ navigation }) {
  const { items } = useContext(FridgeContext);

  const today = new Date();
  let expired = 0,
      soon = 0,
      fresh = 0;

  items.forEach((item) => {
    const expiryDate = parseExpiry(item.expiry);
    const diffInHours = (expiryDate - today) / (1000 * 60 * 60);

    if (diffInHours < 0) expired++;
    else if (diffInHours <= 72) soon++;
    else fresh++;
  });

  const total = items.length;
  const recentItems = items.slice(-5).reverse();

  // Calculate card width so that 3 cards + gaps fit nicely
  const gap = 20; // gap in pixels (~5cm visually on emulator)
  const cardWidth = (width - 32 - gap * 2) / 3; // 32 = paddingHorizontal of container

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      {/* Status Cards */}
      <View style={styles.cardsContainer}>
        <View style={[styles.card, { width: cardWidth, borderLeftColor: '#FF3B30', backgroundColor: '#FFE5E0' }]}>
          <MaterialCommunityIcons name="alert-circle" size={46} color="#FF3B30" />
          <Text style={styles.cardLabel}>Expired</Text>
          <Text style={styles.cardValue}>{expired}</Text>
        </View>

        <View style={[styles.card, { width: cardWidth, borderLeftColor: '#FF9500', backgroundColor: '#FFF3E0' }]}>
          <Ionicons name="time-outline" size={46} color="#FF9500" />
          <Text style={styles.cardLabel}>Soon to Expire</Text>
          <Text style={styles.cardValue}>{soon}</Text>
        </View>

        <View style={[styles.card, { width: cardWidth, borderLeftColor: '#34C759', backgroundColor: '#E0F7E9' }]}>
          <FontAwesome5 name="leaf" size={46} color="#34C759" />
          <Text style={styles.cardLabel}>Fresh</Text>
          <Text style={styles.cardValue}>{fresh}</Text>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.quickStats}>
        <Text style={styles.statsText}>Total Items: {total}</Text>
        <Text style={styles.statsText}>Added Today: {items.filter(i => {
          const addedDate = new Date(i.addedDate);
          return addedDate.toDateString() === today.toDateString();
        }).length}</Text>
        <Text style={styles.statsText}>Expiring Soon: {soon}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('ManualEntry')}>
          <Ionicons name="add-circle-outline" size={46} color="#4CAF50" />
          <Text style={styles.actionLabel}>Add Item</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="list-outline" size={46} color="#2196F3" />
          <Text style={styles.actionLabel}>Details</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Reminders')}>
          <Ionicons name="notifications-outline" size={46} color="#FF9500" />
          <Text style={styles.actionLabel}>Reminders</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Items */}
      <View style={styles.recentContainer}>
        <Text style={styles.recentTitle}>Recent Items</Text>
        {recentItems.length === 0 ? (
          <Text style={styles.noRecent}>No recent items</Text>
        ) : (
          <FlatList
            data={recentItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.recentItem}>
                <FontAwesome5 name="box-open" size={20} color="#555" style={{ marginRight: 10 }} />
                <Text style={styles.recentName}>{item.name}</Text>
                <Text style={styles.recentExpiry}>{item.expiry}</Text>
              </View>
            )}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, backgroundColor: '#f0f4f7' },
  title: { fontSize: 36, fontWeight: '700', marginBottom: 32, color: '#222', textAlign: 'center' },
  cardsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 32,
  },
  card: {
    paddingVertical: 24,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 4,
    borderLeftWidth: 6,
  },
  cardLabel: { fontSize: 20, fontWeight: '600', color: '#333', marginTop: 8, textAlign: 'center' },
  cardValue: { fontSize: 28, fontWeight: '700', color: '#222', marginTop: 4 },
  quickStats: { marginBottom: 24, paddingHorizontal: 10 },
  statsText: { fontSize: 20, marginVertical: 6, color: '#555', fontWeight: '600' },
  actions: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 32 },
  actionBtn: { alignItems: 'center' },
  actionLabel: { marginTop: 6, fontSize: 16, fontWeight: '600', color: '#333' },
  recentContainer: { padding: 14, backgroundColor: '#fff', borderRadius: 14, elevation: 3, marginBottom: 24 },
  recentTitle: { fontSize: 22, fontWeight: '700', marginBottom: 12, color: '#222' },
  noRecent: { fontSize: 16, color: '#888', textAlign: 'center' },
  recentItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderColor: '#eee', alignItems: 'center' },
  recentName: { fontSize: 18, color: '#333', flex: 1 },
  recentExpiry: { fontSize: 16, color: '#777', textAlign: 'right' },
});
