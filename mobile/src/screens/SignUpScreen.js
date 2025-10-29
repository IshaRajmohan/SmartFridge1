// src/screens/SignUpScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { storeToken, storeUser } from '../utils/authStorage';

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Email signup
  const handleEmailSignUp = async () => {
    if (!email || !password) {
      return Alert.alert("Error", "Please fill all fields");
    }

    try {
      const res = await fetch('http://192.168.0.185:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: email.split('@')[0], email, password }),
      });
      const data = await res.json();
      if (data.token) {
        await storeToken(data.token);
        await storeUser(data);
        navigation.replace("AppTabs", { screen: "Home" });
      } else {
        Alert.alert("Error", data.message || "Signup failed");
      }
    } catch (err) {
      Alert.alert("Error", "Network error");
    }
  };

  return (
    <LinearGradient colors={["#E8F5E9", "#FFFFFF"]} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.btnPrimary} onPress={handleEmailSignUp}>
          <Text style={styles.btnText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("SignIn")} style={styles.link}>
          <Text style={styles.linkText}>
            Already have an account? <Text style={styles.bold}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  title: { fontSize: 28, fontWeight: "600", color: "#2E7D32", textAlign: "center", marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: "#C8E6C9",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    backgroundColor: "#F9FFFB",
  },
  btnPrimary: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  btnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  link: { alignItems: "center" },
  linkText: { color: "#666" },
  bold: { color: "#4CAF50", fontWeight: "600" },
});