import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { loginUser } from '../../../lib/appwrite'; 

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
  
      // Check if the user is new or has completed onboarding
      const onboardingCompleted = await AsyncStorage.getItem('onboardingCompleted');
  
      if (onboardingCompleted === null) {
        // If onboarding status doesn't exist, set it to false (new user)
        await AsyncStorage.setItem('onboardingCompleted', 'false');
        navigation.navigate('Intro');  // Show Intro as user is new
      } else if (onboardingCompleted === 'false') {
        // If onboarding is not completed, continue to show the Intro
        navigation.navigate('Intro');
      } else {
        // Onboarding is complete, go to Home
        navigation.navigate('HomeOverview');
      }
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
      <Text style={styles.title}>Welcome Back!</Text>
      <Text>Please enter your email and password to sign in.</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
      />
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.disabledButton]} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>{isLoading ? 'LOGGING IN...' : 'LOGIN'}</Text>
      </TouchableOpacity>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#87CEFA',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  linkText: {
    marginTop: 15,
    color: '#87CEFA',
  },
});

export default Login;
