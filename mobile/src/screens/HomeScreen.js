import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FridgeContext } from '../contexts/FridgeContext';
import { parseExpiry } from '../utils/expiryParser';

export default function HomeScreen() {
  const { items, deleteItem } = useContext(FridgeContext);
  const today = new Date();

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteItem(id) },
      ]
    );
  };

  const getItemStyle = (expiry) => {
    const expiryDate = parseExpiry(expiry);
    const diffInHours = (expiryDate - today) / (1000 * 60 * 60);

    if (diffInHours < 0) return styles.expired;
    if (diffInHours <= 72) return styles.soon;
    return styles.fresh;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Items Details</Text>

      {items.length === 0 ? (
        <Text>No items yet</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <View style={[styles.item, getItemStyle(item.expiry)]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.expiry}>{item.expiry}</Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 16 },
  item: { padding: 8, borderBottomWidth: 1, borderColor: '#ccc', borderRadius: 5, marginVertical: 4 },
  name: { fontSize: 18 },
  expiry: { fontSize: 14 },
  deleteButton: { padding: 8, backgroundColor: '#ff4d4d', borderRadius: 5 },
  deleteText: { color: '#fff', fontWeight: '600' },

  expired: { backgroundColor: '#ffcccc' },   // red
  soon: { backgroundColor: '#fff0b3' },      // yellow
  fresh: { backgroundColor: '#ccffcc' },     // green
});
