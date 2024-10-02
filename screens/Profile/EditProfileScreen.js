import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { updateProfilePicture, updateUserWeight, updateUserAge, updateWakeUpTime, updateBedtime, updateUserEmailAndPhone } from '../../lib/appwrite';
import { useNavigation, useRoute } from '@react-navigation/native';

const EditProfileScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  
  const { profile } = route.params; // Receive the passed profile data

  const [profilePic, setProfilePic] = useState(profile.profilePic);
  const [name, setName] = useState(profile.username);
  const [email, setEmail] = useState(profile.email);
  const [weight, setWeight] = useState(profile.weight);
  const [age, setAge] = useState(profile.age);
  const [wakeUpTime, setWakeUpTime] = useState(profile.wakeUpTime);
  const [bedtime, setBedtime] = useState(profile.bedtime);

  const selectImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const { uri } = response.assets[0];
        setProfilePic(uri);
      }
    });
  };

  const handleSaveProfile = async () => {
    try {
      // Save all updated fields to Appwrite
      if (profilePic) await updateProfilePicture(profilePic);
      await updateUserEmailAndPhone(email);
      await updateUserWeight(weight);
      await updateUserAge(age);
      await updateWakeUpTime(wakeUpTime);
      await updateBedtime(bedtime);

      Alert.alert('Success', 'Profile updated successfully');
      navigation.navigate('ProfileScreen'); // Navigate back to profile page
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
      console.error('Error updating profile:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={selectImage}>
        <Image source={{ uri: profilePic }} style={styles.profileImage} />
        <Text style={styles.editText}>Tap to select image</Text>
      </TouchableOpacity>

      {/* Form inputs for other profile details */}
      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Weight" value={weight} onChangeText={setWeight} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Age" value={age} onChangeText={setAge} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Wake-up Time" value={wakeUpTime} onChangeText={setWakeUpTime} />
      <TextInput style={styles.input} placeholder="Bedtime" value={bedtime} onChangeText={setBedtime} />

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
        <Text style={styles.saveButtonText}>Save Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  editText: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '80%',
    marginVertical: 10,
  },
  saveButton: {
    backgroundColor: '#00aaff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  backButton: {
    marginTop: 20,
  },
  backButtonText: {
    color: '#00aaff',
    fontSize: 16,
  },
});

export default EditProfileScreen;
