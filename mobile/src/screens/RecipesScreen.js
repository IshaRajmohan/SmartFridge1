import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Button,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import RecipeCard from "../components/RecipeCard";

const RecipesScreen = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const API_BASE = "http://192.168.0.115:5001/api/recipes";

  // 🧩 Fetch recipes based on ingredients
  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/generate`);
      const data = await res.json();
      setRecipes(data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🍽️ Fetch full recipe details by ID
  const fetchRecipeDetails = async (id) => {
    try {
      setDetailLoading(true);
      const res = await fetch(`${API_BASE}/${id}`);
      const data = await res.json();
      setSelectedRecipe(data);
      setModalVisible(true);
    } catch (error) {
      console.error("Error fetching recipe details:", error);
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="blue" style={{ marginTop: 50 }} />
    );
  }

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Button title="Generate Recipes" onPress={fetchRecipes} />

      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => fetchRecipeDetails(item.id)}>
            <RecipeCard recipe={item} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No recipes found. Add more ingredients!
          </Text>
        }
      />

      {/* 🍲 Modal for detailed recipe info */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
          {detailLoading ? (
            <ActivityIndicator size="large" color="blue" />
          ) : selectedRecipe ? (
            <ScrollView>
              <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
                {selectedRecipe.title}
              </Text>
              <Text style={{ color: "gray", marginBottom: 10 }}>
                Ready in {selectedRecipe.readyInMinutes} mins • Serves {selectedRecipe.servings}
              </Text>
              <Text style={{ marginBottom: 10 }}>{selectedRecipe.summary?.replace(/<[^>]*>/g, "")}</Text>

              <Text style={{ fontWeight: "bold", marginTop: 10 }}>Ingredients:</Text>
              {selectedRecipe.ingredients?.map((ing, index) => (
                <Text key={index}>• {ing}</Text>
              ))}

              {selectedRecipe.instructions && (
                <>
                  <Text style={{ fontWeight: "bold", marginTop: 15 }}>Instructions:</Text>
                  <Text>{selectedRecipe.instructions.replace(/<[^>]*>/g, "")}</Text>
                </>
              )}

              <Button title="Close" onPress={() => setModalVisible(false)} />
            </ScrollView>
          ) : (
            <Text>No recipe selected</Text>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default RecipesScreen;
