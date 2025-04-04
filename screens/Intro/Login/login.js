import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { loginUser, account } from '../../../lib/appwrite'; // Ensure account is imported
import LottieView from 'lottie-react-native'; 

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
  
    setIsLoading(true);
    try {
      const { session, accountId } = await loginUser(email, password);
  
      if (!accountId) {
        throw new Error('Failed to retrieve user account ID.');
      }
  
      console.log('Login successful:', session);
  
      // Store session in AsyncStorage
      await AsyncStorage.setItem('userSession', JSON.stringify(session));
      await AsyncStorage.setItem('accountId', accountId);

      // Fetch the latest user details after login
      const userDetails = await account.get();
      await AsyncStorage.setItem('userDetails', JSON.stringify(userDetails));
  
      // Set onboardingCompleted to true after successful login
      await AsyncStorage.setItem('onboardingCompleted', 'true');

      // Always navigate to HomeOverview after login
      navigation.navigate('HomeOverview');

    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent={false} backgroundColor="#fff" />

      {/* Title Section */}
      <Text style={styles.title}>Welcome Back!</Text>

      {/* Lottie Animation */}
      <LottieView
        source={require('../../../assets/animation/login.json')}
        autoPlay
        loop
        style={styles.animation}
      />

      {/* Input Fields */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading}
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
        placeholderTextColor="#888"
      />

      {/* Login Button */}
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.disabledButton]} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>{isLoading ? 'LOGGING IN...' : 'LOGIN'}</Text>
      </TouchableOpacity>

      {/* Navigate to Registration */}
      <TouchableOpacity onPress={() => navigation.navigate('Registration')} disabled={isLoading}>
        <Text style={styles.linkText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00aaff',
    marginBottom: 20,
  },
  animation: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1,
  },
  button: {
    backgroundColor: '#00aaff',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkText: {
    marginTop: 20,
    color: '#00aaff',
    fontSize: 16,
  },
});

export default Login;