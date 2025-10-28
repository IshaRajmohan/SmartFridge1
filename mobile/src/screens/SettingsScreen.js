// SettingsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { validateEmail, validatePhone, validateName } from '../utils/validators';
import * as Notifications from 'expo-notifications';

const GENDER_OPTIONS = [
  { label: 'Select Gender', value: '' },
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
  { label: 'Prefer not to say', value: 'prefer-not-to-say' },
];

export default function SettingsScreen() {
  const { colors, isDark, theme, updateTheme } = useTheme();
  const { settings, updateSettings, updateProfile } = useSettings();
  const [formData, setFormData] = useState({
    name: settings.profile.name || '',
    email: settings.profile.email || '',
    phone: settings.profile.phone || '',
    gender: settings.profile.gender || '',
  });
  const [reminderDaysInput, setReminderDaysInput] = useState(settings.reminderDays.toString());
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingReminder, setIsSavingReminder] = useState(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission required', 'Sorry, we need camera roll permissions to upload photos.');
        }
      }
    })();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.name && !validateName(formData.name)) {
      newErrors.name = 'Please enter a valid name';
    }
    
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid Indian phone number (e.g., +91 9876543210 or 9876543210)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateReminderDays = (value) => {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 1 || num > 14) {
      return 'Please enter a number between 1 and 14';
    }
    return null;
  };

  const handleReminderDaysChange = (value) => {
    setReminderDaysInput(value);
    const error = validateReminderDays(value);
    setErrors(prev => ({
      ...prev,
      reminderDays: error
    }));
  };

  const handleSaveReminderDays = () => {
    const error = validateReminderDays(reminderDaysInput);
    if (error) {
      setErrors(prev => ({
        ...prev,
        reminderDays: error
      }));
      return;
    }

    setIsSavingReminder(true);
    updateSettings({ reminderDays: parseInt(reminderDaysInput, 10) });
    
    // Show success message
    setTimeout(() => {
      Alert.alert('Success', 'Reminder period updated successfully');
      setIsSavingReminder(false);
    }, 500);
  };

  const handleSaveProfile = () => {
    if (!validateForm()) return;
    
    setIsSaving(true);
    updateProfile(formData);
    
    // Show success message
    setTimeout(() => {
      Alert.alert('Success', 'Profile updated successfully');
      setIsSaving(false);
    }, 500);
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        updateProfile({ photo: result.assets[0].uri });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleNotificationToggle = async (value) => {
    if (!value) {
      updateSettings({ notifications: false });
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert(
        'Notifications Permission',
        'Please enable notifications in your device settings to receive app notifications.'
      );
      updateSettings({ notifications: false });
      return;
    }

    updateSettings({ notifications: true });
  };

  const renderSection = (title, children) => (
    <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.sectionTitle, { color: colors.primary }]}>{title}</Text>
      {children}
    </View>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Profile Section */}
      {renderSection('Profile Information', (
        <>
          <View style={styles.profileHeader}>
            <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
              {settings.profile.photo ? (
                <Image 
                  source={{ uri: settings.profile.photo }} 
                  style={styles.avatar} 
                />
              ) : (
                <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                  <Ionicons name="person" size={40} color="white" />
                </View>
              )}
              <View style={[styles.cameraIcon, { backgroundColor: colors.primary }]}>
                <Ionicons name="camera" size={16} color="white" />
              </View>
            </TouchableOpacity>
            <Text style={[styles.userName, { color: colors.text }]}>
              {settings.profile.name || 'Your Name'}
            </Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  borderColor: errors.name ? colors.danger : colors.border,
                  color: colors.text,
                  backgroundColor: colors.card
                }
              ]}
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
              placeholder="Enter your name"
              placeholderTextColor={colors.text + '80'}
            />
            {errors.name && <Text style={styles.error}>{errors.name}</Text>}
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Email</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  borderColor: errors.email ? colors.danger : colors.border,
                  color: colors.text,
                  backgroundColor: colors.card
                }
              ]}
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="your.email@example.com"
              placeholderTextColor={colors.text + '80'}
            />
            {errors.email && <Text style={styles.error}>{errors.email}</Text>}
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Phone Number</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  borderColor: errors.phone ? colors.danger : colors.border,
                  color: colors.text,
                  backgroundColor: colors.card
                }
              ]}
              value={formData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
              keyboardType="phone-pad"
              placeholder="9876543210 or +919876543210"
              placeholderTextColor={colors.text + '80'}
            />
            {errors.phone && <Text style={styles.error}>{errors.phone}</Text>}
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Gender</Text>
            <View 
              style={[
                styles.pickerContainer, 
                { 
                  borderColor: colors.border,
                  backgroundColor: colors.card
                }
              ]}
            >
              <Picker
                selectedValue={formData.gender}
                onValueChange={(value) => handleInputChange('gender', value)}
                style={[styles.picker, { color: isDark ? '#ffffff' : colors.text }]}
                dropdownIconColor={isDark ? '#ffffff' : colors.text}
              >
                {GENDER_OPTIONS.map((option) => (
                  <Picker.Item 
                    key={option.value} 
                    label={option.label} 
                    value={option.value}
                    color={isDark ? '#ffffff' : '#000000'} // Explicitly set item text color
                  />
                ))}
              </Picker>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleSaveProfile}
            disabled={isSaving}
          >
            <Text style={styles.saveButtonText}>
              {isSaving ? 'Saving...' : 'Save Profile'}
            </Text>
          </TouchableOpacity>
        </>
      ))}

      {/* App Preferences Section */}
      {renderSection('App Preferences', (
        <>
          <View style={styles.preferenceItem}>
            <View>
              <Text style={[styles.preferenceTitle, { color: colors.text }]}>
                Dark Mode
              </Text>
              <Text style={[styles.preferenceSubtitle, { color: colors.text + 'B0' }]}>
                {theme === 'dark' 
                  ? 'Dark mode enabled' 
                  : 'Light mode enabled'}
              </Text>
            </View>
            <View style={styles.themeButtons}>
              <TouchableOpacity 
                style={[
                  styles.themeButton, 
                  theme === 'light' && styles.themeButtonActive,
                  { borderColor: colors.primary }
                ]}
                onPress={() => updateTheme('light')}
              >
                <Ionicons 
                  name="sunny" 
                  size={20} 
                  color={theme === 'light' ? 'white' : colors.primary} 
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.themeButton, 
                  { 
                    ...(theme === 'dark' ? styles.themeButtonActive : {}),
                    borderColor: colors.primary 
                  }
                ]}
                onPress={() => updateTheme('dark')}
              >
                <Ionicons 
                  name="moon" 
                  size={20} 
                  color={theme === 'dark' ? 'white' : colors.primary} 
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.preferenceItem}>
            <View>
              <Text style={[styles.preferenceTitle, { color: colors.text }]}>
                Receive Notifications
              </Text>
              <Text style={[styles.preferenceSubtitle, { color: colors.text + 'B0' }]}>
                {settings.notifications 
                  ? 'Notifications are enabled' 
                  : 'Notifications are disabled'}
              </Text>
            </View>
            <Switch
              value={settings.notifications}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.card}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Default Reminder Period (days)</Text>
            <View style={styles.inputButtonContainer}>
              <TextInput
                style={[
                  styles.input,
                  { 
                    borderColor: errors.reminderDays ? colors.danger : colors.border,
                    color: colors.text,
                    backgroundColor: colors.card,
                    flex: 1,
                    marginRight: 8
                  }
                ]}
                value={reminderDaysInput}
                onChangeText={handleReminderDaysChange}
                keyboardType="numeric"
                placeholder="Enter days (1-14)"
                placeholderTextColor={colors.text + '80'}
              />
              <TouchableOpacity 
                style={[styles.saveButton, { backgroundColor: colors.primary, paddingVertical: 10, paddingHorizontal: 12 }]}
                onPress={handleSaveReminderDays}
                disabled={isSavingReminder}
              >
                <Text style={styles.saveButtonText}>
                  {isSavingReminder ? 'Saving...' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
            {errors.reminderDays && <Text style={styles.error}>{errors.reminderDays}</Text>}
          </View>
        </>
      ))}

      {/* App Info Section */}
      {renderSection('About', (
        <View style={styles.infoItem}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>App Version</Text>
          <Text style={[styles.infoValue, { color: colors.text + 'B0' }]}>1.0.0</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: Platform.OS === 'ios' ? 150 : 50,
  },
  saveButton: {
    marginTop: 8,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  preferenceSubtitle: {
    fontSize: 13,
  },
  themeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  themeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeButtonActive: {
    backgroundColor: '#007AFF',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoTitle: {
    fontSize: 15,
  },
  infoValue: {
    fontSize: 15,
  },
  error: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});