import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ItemDetailsScreen({ route }) {
  const { item } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.detail}>Expiry: {item.expiry}</Text>
      <Text style={styles.sectionTitle}>Suggested Recipes</Text>
      <Text>- Coming Soon -</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  name: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  detail: { fontSize: 16, color: '#777' },
  sectionTitle: { marginTop: 20, fontSize: 20, fontWeight: '600' }
});
