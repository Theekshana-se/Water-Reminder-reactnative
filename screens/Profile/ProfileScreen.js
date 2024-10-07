import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { account } from '../../lib/appwrite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal'; // Import Modal for the pop-up

import {
  fetchUserWaterConsumption,
  fetchUserWeight,
  fetchUserAge,
  fetchUserEmailAndPhone,
  fetchUserWakeUpTime,
  fetchUserBedtime,
} from '../../lib/appwrite';

const defaultProfilePic = 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg';

const ProfileScreen = () => {
  const navigation = useNavigation();

  const [profile, setProfile] = useState({
    name: 'Loading...',
    intakeGoal: 'Loading...',
    wakeUpTime: 'Loading...',
    bedtime: 'Loading...',
    email: 'Loading...',
    mobile: 'Loading...',
    weight: 'Loading...',
    age: 'Loading...',
    profilePic: defaultProfilePic,
  });

  const [isModalVisible, setModalVisible] = useState(false); // State for Modal visibility

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const waterConsumption = await fetchUserWaterConsumption();
        const weight = await fetchUserWeight();
        const age = await fetchUserAge();
        const wakeUpTime = await fetchUserWakeUpTime();
        const bedtime = await fetchUserBedtime();
        const { email, phoneNumber, profilePic, username } = await fetchUserEmailAndPhone();

        setProfile({
          intakeGoal: `${waterConsumption} ml`,
          weight: `${weight} kg`,
          age: `${age}`,
          email,
          mobile: phoneNumber,
          username,
          wakeUpTime,
          bedtime,
          profilePic: profilePic || defaultProfilePic,
        });
      } catch (error) {
        console.error('Failed to load profile data:', error);
      }
    };

    loadProfileData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userSession');
      const currentUser = await account.get();
      if (currentUser) {
        await account.deleteSession('current');
        Alert.alert('Success', 'Logged out successfully');
        navigation.navigate('Login');
      }
    } catch (error) {
      Alert.alert('Error', 'No active session to log out from.');
    }
  };

  // Toggle Modal visibility
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleModal}>
          <Text style={styles.threeDots}>⋮</Text>
        </TouchableOpacity>
      </View>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal} // Close modal when clicking outside
        animationIn="fadeIn"
        animationOut="fadeOut"
        backdropOpacity={0} // Removes the dimming effect
        animationInTiming={200} // Faster animation in
        animationOutTiming={200} // Faster animation out
        style={styles.modalStyle}
      >
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={() => { navigation.navigate('DailyTips'); toggleModal(); }}>
            <Text style={styles.modalText}>Daily Tips</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { navigation.navigate('ShopRegistrationScreen1'); toggleModal(); }}>
            <Text style={styles.modalText}>Join with Us</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleModal}>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.profileContainer}>
        <Image source={{ uri: profile.profilePic }} style={styles.profileImage} />
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditProfile', { profile })}
        >
          <Text style={styles.editText}>EDIT PROFILE</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>💧 Intake Goal: {profile.intakeGoal}</Text>
        <Text style={styles.infoText}>👤 Username: {profile.username}</Text>
        <Text style={styles.infoText}>📧 Email: {profile.email}</Text>
        <Text style={styles.infoText}>⚖️ Weight: {profile.weight}</Text>
        <Text style={styles.infoText}>🎂 Age: {profile.age}</Text>
        <Text style={styles.infoText}>⏰ Wake-up Time: {profile.wakeUpTime}</Text>
        <Text style={styles.infoText}>🌙 Bedtime: {profile.bedtime}</Text>
      </View>

      <View style={styles.logoutButtonContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>LOG OUT</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20, // Ensure content has padding to prevent cutting off
    backgroundColor: '#f7f7f7',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
  },
  threeDots: {
    fontSize: 30,
  },
  modalStyle: {
    justifyContent: 'flex-start', // Aligns the modal at the top
    alignItems: 'flex-end', // Aligns the modal to the right
    margin: 0, // Removes default margin
    paddingTop: 60, // Adds padding to position below the top bar
    paddingRight: 20, // Align with the three dots button
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: 'transparent', // No shadow color
    elevation: 0, // No elevation
    width: 150, // Adjust width as per your design
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#00aaff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  editText: {
    color: '#fff',
    fontSize: 16,
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 2,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 18,
    marginBottom: 15,
  },
  logoutButtonContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    elevation: 2,
    marginBottom: 20, // Adds space at the bottom
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ProfileScreen;
