import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { formatDistanceToNow, parseISO } from 'date-fns';

export default function ItemCard({ item, onPress }) {
  const daysLeft = formatDistanceToNow(parseISO(item.expiry), { addSuffix: true });

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.date}>Expires {daysLeft}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f2f2f2', padding: 15, borderRadius: 12, marginVertical: 6
  },
  name: { fontSize: 18, fontWeight: '600' },
  date: { color: '#888', marginTop: 4 }
});
