import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import ItemCard from '../components/ItemCard';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const [items, setItems] = useState([
    { id: '1', name: 'Milk', expiry: '2025-10-28' },
    { id: '2', name: 'Tomatoes', expiry: '2025-10-30' },
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Fridge</Text>
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <ItemCard item={item} onPress={() => navigation.navigate('ItemDetails', { item })} />
        )}
        keyExtractor={item => item.id}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Scan')}>
        <Ionicons name="camera" color="#fff" size={24} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: '600', marginBottom: 10 },
  fab: {
    position: 'absolute', bottom: 30, right: 30,
    backgroundColor: '#4CAF50', padding: 15, borderRadius: 50
  }
});
