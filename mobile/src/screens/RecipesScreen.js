import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import RecipeCard from '../components/RecipeCard';

export default function RecipesScreen() {
  const recipes = [
    { id: '1', title: 'Tomato Pasta', used: ['Tomato', 'Garlic'] },
    { id: '2', title: 'Milkshake', used: ['Milk', 'Banana'] },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipes for You</Text>
      <FlatList
        data={recipes}
        renderItem={({ item }) => <RecipeCard recipe={item} />}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 10 }
});
