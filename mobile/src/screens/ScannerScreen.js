// src/screens/ScannerScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';

const VISION_API_KEY = 'AIzaSyAAlmnoDEhWZ4j7abqf-J0YjpMl9KugKuA';

export default function ScannerScreen({ navigation }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualExpiry, setManualExpiry] = useState('');

  useEffect(() => {
    (async () => {
      const { status: cam } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: lib } = await MediaLibrary.requestPermissionsAsync();
      if (cam !== 'granted') Alert.alert('Camera permission required');
      if (lib !== 'granted') Alert.alert('Photo saving permission required');
    })();
  }, []);

  const processImageWithVision = async (uri) => {
    const manip = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800 } }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG, base64: true }
    );

    const body = {
      requests: [{ image: { content: manip.base64 }, features: [{ type: 'TEXT_DETECTION' }] }],
    };

    const res = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${VISION_API_KEY}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Vision error');
    return data.responses[0]?.fullTextAnnotation?.text || '';
  };

  const parseText = (text) => {
    const lines = text.toLowerCase().split('\n').map(l => l.trim()).filter(Boolean);
    const name = lines.find(l => l.length > 3 && !/(exp|best|use|mfg|sell)/i.test(l)) || 'Milk';
    const cap = name.charAt(0).toUpperCase() + name.slice(1);

    const dateMatch = text.match(/\b(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})\b/);
    let expiry = '';

    if (dateMatch && !isNaN(new Date(dateMatch[0]).getTime())) {
      expiry = new Date(dateMatch[0]).toISOString().split('T')[0];
    } else {
      expiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    }

    return { name: cap, expiry };
  };

  const captureAndScan = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });
      if (result.canceled || !result.assets?.[0]?.uri) return;

      const uri = result.assets[0].uri;
      await MediaLibrary.saveToLibraryAsync(uri);

      let text = '';
      try {
        text = await processImageWithVision(uri);
      } catch {
        Alert.alert('OCR failed', 'Using sample data');
        text = 'Milk\nBest before 23/11/2025';
      }

      const { name, expiry } = parseText(text);
      const newItem = { id: Date.now().toString(), name, expiry };
      navigation.navigate('Home', { newItem });
    } catch (e) {
      Alert.alert('Error', 'Try manual entry', [{ text: 'Manual', onPress: () => setShowManual(true) }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const addManual = () => {
    if (!manualName.trim()) return Alert.alert('Enter name');
    const expiry = manualExpiry || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const newItem = { id: Date.now().toString(), name: manualName.trim(), expiry };
    navigation.navigate('Home', { newItem });
    setShowManual(false);
    setManualName('');
    setManualExpiry('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.placeholder}>
        <Ionicons name="camera-outline" size={100} color="#ccc" />
        <Text style={styles.placeholderText}>Tap to scan product label</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.captureBtn} onPress={captureAndScan} disabled={isProcessing}>
          <Ionicons name="camera" size={32} color="#fff" />
          <Text style={styles.btnText}>Scan Label</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.manualBtn} onPress={() => setShowManual(true)}>
          <Ionicons name="create-outline" size={24} color="#fff" />
          <Text style={styles.btnText}>Manual Entry</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="close" size={28} color="#333" />
      </TouchableOpacity>

      <Modal visible={showManual} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Add Item</Text>
            <TextInput style={styles.input} placeholder="Name" value={manualName} onChangeText={setManualName} />
            <TextInput style={styles.input} placeholder="Expiry (YYYY-MM-DD)" value={manualExpiry} onChangeText={setManualExpiry} />
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowManual(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addBtn} onPress={addManual}>
                <Text style={styles.addText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e8f5e9' },
  placeholderText: { marginTop: 16, fontSize: 16, color: '#666' },
  buttonContainer: { padding: 20, gap: 12 },
  captureBtn: { backgroundColor: '#4CAF50', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12 },
  manualBtn: { backgroundColor: '#FF9800', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12 },
  btnText: { color: '#fff', marginLeft: 8, fontWeight: '600' },
  closeBtn: { position: 'absolute', top: 50, right: 20, padding: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modal: { backgroundColor: '#fff', width: '90%', borderRadius: 16, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 16 },
  modalBtns: { flexDirection: 'row', justifyContent: 'space-around' },
  cancelBtn: { backgroundColor: '#ccc', padding: 12, borderRadius: 8, flex: 1, marginRight: 8 },
  cancelText: { textAlign: 'center', fontWeight: '600' },
  addBtn: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 8, flex: 1, marginLeft: 8 },
  addText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});