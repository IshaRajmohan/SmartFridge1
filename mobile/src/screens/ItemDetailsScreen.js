import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ItemDetailsScreen({ route }) {
  const { item } = route.params;
  const expiry = new Date(item.expiryDate).toLocaleDateString();

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{item.name}</Text>
      {item.barcode && <Text style={styles.barcode}>Barcode: {item.barcode}</Text>}
      <Text style={styles.expiry}>Expires: {expiry}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Suggested Recipes</Text>
        <Text style={styles.comingSoon}>- Coming Soon -</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  name: { fontSize: 28, fontWeight: '700', color: '#2E7D32', marginBottom: 8 },
  barcode: { fontSize: 14, color: '#666', marginBottom: 4 },
  expiry: { fontSize: 18, color: '#D32F2F', fontWeight: '600', marginBottom: 20 },
  section: { marginTop: 30 },
  sectionTitle: { fontSize: 20, fontWeight: '600', marginBottom: 10 },
  comingSoon: { fontStyle: 'italic', color: '#999' },
});