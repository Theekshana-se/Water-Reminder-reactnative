import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { updateUserWaterConsumption } from '../../../lib/appwrite'; // Your new function

const WaterConsumptionScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  
  const { age, weight, activityLevel } = route.params;

  const [waterIntake, setWaterIntake] = useState(0);

  const activityModifiers = {
    Sedentary: 0,
    'Light Active': 0.1,
    'Moderate Active': 0.2,
    'Very Active': 0.3,
    'Extra Active': 0.4,
  };

  const getAgeModifier = (age) => {
    if (age >= 18 && age <= 30) {
      return 0;
    } else if (age >= 31 && age <= 55) {
      return 0.1;
    } else {
      return 0.2;
    }
  };

  useEffect(() => {
    const baseIntake = weight * 35;
    const ageModifier = getAgeModifier(age);
    const activityModifier = activityModifiers[activityLevel];

    const finalIntake = baseIntake * (1 - ageModifier) * (1 + activityModifier);
    setWaterIntake(Math.round(finalIntake));
  }, [age, weight, activityLevel]);

  const continueHandler = async () => {
    try {
      // Save water consumption to the database
      await updateUserWaterConsumption(waterIntake);
      console.log('Water consumption saved successfully');
      navigation.navigate('TimeSelection');
    } catch (error) {
      console.error('Failed to save water consumption:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
      
      <Text style={styles.title}>Set Your Daily Water Goal</Text>

      <Text style={styles.waterIntakeText}>{waterIntake}ml</Text>

      <Image style={styles.waterImage} source={require('../../../assets/weights/weight-male.png')} />
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.buttonText}>EDIT</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.recalculateButton}>
          <Text style={styles.buttonText}>RECALCULATE</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.continueButton} onPress={continueHandler}>
        <Text style={styles.continueButtonText}>CONTINUE</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WaterConsumptionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 24,
    color: '#87CEFA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#87CEFA',
    marginBottom: 20,
  },
  waterIntakeText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  waterImage: {
    width: 100,
    height: 100,
    marginVertical: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginBottom: 30,
  },
  editButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  recalculateButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#87CEFA',
    padding: 15,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
