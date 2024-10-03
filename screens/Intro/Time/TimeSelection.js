import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Alert, StatusBar } from 'react-native';
import WheelPickerExpo from 'react-native-wheel-picker-expo';
import Button from '../../../components/Buttons/Button';
import { GlobalStyles } from '../../../constants/styles';
import { updateWakeUpTime, updateBedtime } from '../../../lib/appwrite';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TIMES = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 === 0 ? 12 : i % 12;
  const period = i < 12 ? 'a.m.' : 'p.m.';
  return `${hour}:00 ${period}`;
});

const TimeSelection = ({ selectedGender }) => {
  const [wakeUpTime, setWakeUpTime] = useState('6:00 a.m.');
  const [bedtime, setBedtime] = useState('10:00 p.m.');
  const navigation = useNavigation(); 

  const nextPageHandler = async () => {
    try {
      await updateWakeUpTime(wakeUpTime); 
      await updateBedtime(bedtime); 
      Alert.alert('Success', 'Times saved successfully!');
      
      // Call completeOnboarding to store the onboarding completion status
      completeOnboarding();
      
    } catch (error) {
      console.error('Failed to save times:', error);
      Alert.alert('Error', 'Failed to save times. Please try again.');
    }
  };

  const completeOnboarding = async () => {
    try {
      // Save onboarding completion status to AsyncStorage
      await AsyncStorage.setItem('onboardingCompleted', 'true');
      
      // Navigate to Home after completing onboarding
      navigation.navigate('HomeOverview');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  const goBackHandler = () => {
    navigation.goBack();
  };

  const wakeUpTimeChangeHandler = ({ item }) => {
    setWakeUpTime(item.value);
  };

  const bedtimeChangeHandler = ({ item }) => {
    setBedtime(item.value);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent={false} backgroundColor="#fff" />
      {/* Wake-up Time Section */}
      <View style={styles.timeContainer}>
        <Image source={require('../../../assets/defaultprofilepic.jpg')} style={styles.timeImage} />
        <Text style={[styles.timeTitle, styles.textColor]}>Wake-up Time</Text>
        <View style={styles.wheelPickerContainer}>
          <WheelPickerExpo
            backgroundColor="#F2F2F2"
            height={180}
            width={60}
            renderItem={(props) => (
              <View>
                <Text style={styles.text}>{props.label}</Text>
              </View>
            )}
            initialSelectedIndex={6}
            onChange={wakeUpTimeChangeHandler}
            items={TIMES.map((value) => ({ label: value, value: value }))}
          />
        </View>
      </View>

      {/* Bedtime Section */}
      <View style={styles.timeContainer}>
        <Image source={require('../../../assets/defaultprofilepic.jpg')} style={styles.timeImage} />
        <Text style={[styles.timeTitle, styles.textColor]}>Bedtime</Text>
        <View style={styles.wheelPickerContainer}>
          <WheelPickerExpo
            backgroundColor="#F2F2F2"
            height={180}
            width={60}
            renderItem={(props) => (
              <View>
                <Text style={styles.text}>{props.label}</Text>
              </View>
            )}
            initialSelectedIndex={16}
            onChange={bedtimeChangeHandler}
            items={TIMES.map((value) => ({ label: value, value: value }))}
          />
        </View>
      </View>

      {/* Button Section */}
      <View style={styles.buttonContainer}>
        <Button
          buttonStyles={styles.button}
          icon="chevron-back-outline"
          size={24}
          color={GlobalStyles.colors.white}
          onPress={goBackHandler}
        />
        <Button buttonStyles={styles.button} onPress={nextPageHandler}>
          <Text style={styles.buttonText}>Next</Text>
        </Button>
      </View>
    </View>
  );
};

export default TimeSelection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timeImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  timeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  wheelPickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 'auto',
  },
  button: {
    backgroundColor: GlobalStyles.colors.primary400,
    marginTop: 40,
    marginBottom: 40,
    paddingVertical: 10,
    width: '30%',
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: GlobalStyles.colors.white,
    fontWeight: 'bold',
    fontSize: 18,
    textTransform: 'uppercase',
  },
});
