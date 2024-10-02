import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const activityLevels = [
  'Sedentary',
  'Light Active',
  'Moderate Active',
  'Very Active',
  'Extra Active'
];

const ActivityLevelScreen = () => {
  const [selectedLevel, setSelectedLevel] = useState(0);
  const navigation = useNavigation();
  const route = useRoute();
  const { age, weight, selectedGender } = route.params; // Receive age, weight, and selectedGender

  const continueHandler = () => {
    navigation.navigate('WaterConsumptionScreen', { age, weight, selectedGender, activityLevel: activityLevels[selectedLevel] });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activity Level</Text>
      {activityLevels.map((level, index) => (
        <TouchableOpacity
          key={level}
          style={styles.optionContainer}
          onPress={() => setSelectedLevel(index)}
        >
          <View style={[styles.radio, selectedLevel === index && styles.radioSelected]} />
          <Text style={styles.optionText}>{level}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.continueButton} onPress={continueHandler}>
        <Text style={styles.continueButtonText}>CONTINUE</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
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
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  radio: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#87CEFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioSelected: {
    backgroundColor: '#87CEFA',
  },
  optionText: {
    fontSize: 16,
  },
  continueButton: {
    backgroundColor: '#87CEFA',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ActivityLevelScreen;
