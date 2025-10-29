// src/screens/SplashScreen.js
import React, { useEffect } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("SignIn");
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient colors={["#E8F5E9", "#C8E6C9"]} style={styles.container}>
      <View style={styles.inner}>
        <Image
          source={require("../../assets/fridge-logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>FridgeWise</Text>
        <Text style={styles.tagline}>Never waste food again</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  inner: { alignItems: "center" },
  logo: { width: 140, height: 140, marginBottom: 24 },
  title: { fontSize: 36, fontWeight: "600", color: "#2E7D32" },
  tagline: { fontSize: 16, color: "#4CAF50", marginTop: 8 },
});

export default SplashScreen;