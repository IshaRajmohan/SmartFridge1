import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RecipeCard({ recipe }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{recipe.title}</Text>
      <Text style={styles.used}>Uses: {recipe.used.join(', ')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 15,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, marginBottom: 12
  },
  title: { fontSize: 18, fontWeight: '600' },
  used: { marginTop: 4, color: '#666' }
});
