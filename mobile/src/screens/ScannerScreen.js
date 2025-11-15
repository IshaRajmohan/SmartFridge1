// src/screens/ScannerScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TextInput, 
  TouchableOpacity,
  Alert,
  Picker
} from 'react-native';

export default function ScannerScreen({ navigation }) {
  const [itemName, setItemName] = useState('');
  const [expiryDays, setExpiryDays] = useState(7);

  const handleAddItem = () => {
    if (!itemName.trim()) {
      Alert.alert('Error', 'Please enter an item name');
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      name: itemName.trim(),
      expiry: new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // X days from now
    };

    navigation.navigate('AppTabs', { screen: 'Home', params: { newItem } });
    setItemName('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Add New Item</Text>
        
        <TextInput
          style={styles.input}
          value={itemName}
          onChangeText={setItemName}
          placeholder="Enter item name"
          autoCapitalize="words"
          autoFocus
        />

        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Expires in:</Text>
          <Picker
            selectedValue={expiryDays}
            style={styles.picker}
            onValueChange={(itemValue) => setExpiryDays(itemValue)}
          >
            <Picker.Item label="1 day" value={1} />
            <Picker.Item label="2 days" value={2} />
            <Picker.Item label="3 days" value={3} />
            <Picker.Item label="1 week" value={7} />
            <Picker.Item label="2 weeks" value={14} />
            <Picker.Item label="1 month" value={30} />
          </Picker>
        </View>

        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddItem}
        >
          <Text style={styles.buttonText}>Add Item</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 30,
    marginTop: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  pickerContainer: {
    width: '100%',
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'left',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});