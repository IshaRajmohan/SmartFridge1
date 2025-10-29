// src/screens/RecipeDetailsScreen.js
import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RecipeDetailsScreen({ route, navigation }) {
  const { recipe } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.close}>
          <Ionicons name="close" size={28} color="#2E7D32" />
        </TouchableOpacity>
        <Text style={styles.title}>{recipe.title}</Text>
      </View>

      <ScrollView style={styles.scroll}>
        <Image source={recipe.image} style={styles.image} resizeMode="cover" />

        <View style={styles.info}>
          <View style={styles.row}>
            <Ionicons name="time-outline" size={18} color="#666" />
            <Text style={styles.meta}>{recipe.time}</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="people-outline" size={18} color="#666" />
            <Text style={styles.meta}>{recipe.servings} servings</Text>
          </View>
        </View>

        <Text style={styles.section}>Ingredients</Text>
        {recipe.ingredients.map((ing, i) => (
          <Text key={i} style={styles.ingredient}>
            • {ing}
            {recipe.expiringSoon.includes(ing) && ' (use soon!)'}
          </Text>
        ))}

        <Text style={styles.section}>Instructions</Text>
        <Text style={styles.instructions}>
          1. Blend {recipe.ingredients.join(' and ')} until smooth.{'\n'}
          2. Add ice if desired.{'\n'}
          3. Serve immediately and enjoy!
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#C8E6C9',
  },
  close: { marginRight: 12 },
  title: { fontSize: 20, fontWeight: '600', color: '#2E7D32', flex: 1 },
  scroll: { flex: 1 },
  image: { width: '100%', height: 200 },
  info: { flexDirection: 'row', justifyContent: 'space-around', padding: 16 },
  row: { flexDirection: 'row', alignItems: 'center' },
  meta: { marginLeft: 6, color: '#666' },
  section: { fontSize: 18, fontWeight: '600', color: '#2E7D32', marginHorizontal: 16, marginTop: 20 },
  ingredient: { fontSize: 16, color: '#444', marginHorizontal: 16, marginVertical: 4 },
  instructions: { fontSize: 16, color: '#444', marginHorizontal: 16, marginVertical: 8, lineHeight: 24 },
});