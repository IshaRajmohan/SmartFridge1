import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const RecipeCard = ({ recipe }) => (
  <View style={styles.card}>
    <Image source={{ uri: recipe.image }} style={styles.image} />
    <Text style={styles.title}>{recipe.title}</Text>
    <Text>✅ Used: {recipe.usedIngredients.join(", ")}</Text>
    {recipe.missedIngredients.length > 0 && (
      <Text>❌ Missing: {recipe.missedIngredients.join(", ")}</Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 8
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 5
  }
});

export default RecipeCard;
