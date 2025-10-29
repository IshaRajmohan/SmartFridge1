// src/screens/RecipesScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RecipesScreen({ navigation }) {
  // Mock data: recipes that use items from your fridge
  const [recipes] = useState([
    {
      id: '1',
      title: 'Tomato & Milk Smoothie',
      time: '5 mins',
      servings: 2,
      ingredients: ['Tomatoes', 'Milk'],
      image: require('../../assets/recipe-smoothie.png'), // ← add later
      expiringSoon: ['Tomatoes'],
    },
    {
      id: '2',
      title: 'Creamy Tomato Soup',
      time: '20 mins',
      servings: 4,
      ingredients: ['Tomatoes', 'Milk'],
      image: require('../../assets/recipe-soup.png'),
      expiringSoon: ['Milk'],
    },
  ]);

  const renderRecipe = ({ item }) => {
    const hasExpiring = item.expiringSoon.length > 0;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('RecipeDetails', { recipe: item })}
      >
        <Image source={item.image} style={styles.image} resizeMode="cover" />
        <View style={styles.content}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.row}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.meta}>{item.time}</Text>
            <Ionicons name="people-outline" size={16} color="#666" style={{ marginLeft: 12 }} />
            <Text style={styles.meta}>{item.servings} servings</Text>
          </View>
          {hasExpiring && (
            <View style={styles.expiringBadge}>
              <Text style={styles.expiringText}>
                Use {item.expiringSoon.join(', ')} soon!
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recipes for You</Text>
      <FlatList
        data={recipes}
        renderItem={renderRecipe}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.empty}>No recipes yet. Add items to your fridge!</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: {
    fontSize: 26,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#F9FFFB',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  image: { width: '100%', height: 140 },
  content: { padding: 16 },
  title: { fontSize: 18, fontWeight: '600', color: '#2E7D32', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center' },
  meta: { fontSize: 14, color: '#666', marginLeft: 4 },
  expiringBadge: {
    marginTop: 10,
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  expiringText: { color: '#D32F2F', fontSize: 13, fontWeight: '600' },
  empty: { textAlign: 'center', color: '#999', fontSize: 16, marginTop: 40 },
});