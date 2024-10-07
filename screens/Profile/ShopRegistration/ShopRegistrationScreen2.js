import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; // For back button

const ShopRegistrationScreen2 = ({ route }) => {
  const navigation = useNavigation();
  const [displayInfo, setDisplayInfo] = useState('');

  const { shopName, email, phoneNumber } = route.params;

  const handleRegister = () => {
    // Handle registration logic
    console.log("Shop Name:", shopName);
    console.log("Email:", email);
    console.log("Phone Number:", phoneNumber);
    console.log("Display Info:", displayInfo);

    // Redirect to success or another page after registration
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#00aaff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shop registration</Text>
      </View>

      <Text style={styles.subTitle}>Please fill in your details to create your account</Text>

      <View style={styles.inputContainer}>
        <Text>Enter What you can display to user</Text>
        <TextInput
          style={[styles.input, { height: 150 }]}
          value={displayInfo}
          onChangeText={setDisplayInfo}
          multiline={true}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>REGISTER</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00aaff',
    marginLeft: 10,
  },
  subTitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#00aaff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ShopRegistrationScreen2;
