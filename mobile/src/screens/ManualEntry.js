import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FridgeContext } from '../contexts/FridgeContext';

export default function ManualEntry({ navigation, onAddItem }) {
  const { addItem } = useContext(FridgeContext);
  const [name, setName] = useState('');
  const [expiry, setExpiry] = useState('');

  const handleAdd = () => {
    if (!name || !expiry) return Alert.alert('Error', 'Enter name and expiry');

    const item = { id: Date.now().toString(), name, expiry };
    if (onAddItem) onAddItem(item); // Dashboard modal
    else addItem(item);             // ManualEntry screen

    setName('');
    setExpiry('');
    if (navigation) navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Item Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Expiry Date</Text>
      <TextInput style={styles.input} value={expiry} onChangeText={setExpiry} />

      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Add Item</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { marginTop: 20, fontSize: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginTop: 5, borderRadius: 8 },
  button: { marginTop: 30, padding: 15, backgroundColor: '#4CAF50', borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
