import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { GlobalStyles } from '../../constants/styles';
import { useNavigation } from '@react-navigation/native';

const AddBeverageScreen = ({ route }) => {
  const [selectedBeverage, setSelectedBeverage] = useState(null);
  const [hydrationLevel, setHydrationLevel] = useState('');
  const navigation = useNavigation();
  const { addBeverage } = route.params; // Callback to update the beverage list

  const beverageOptions = [
    { name: 'Water', image: require('../../assets/drinks/cup-150ml.png') },
    { name: 'Tea', image: require('../../assets/drinks/cup-150ml.png') },
    { name: 'Orange Juice', image: require('../../assets/drinks/cup-150ml.png') },
    { name: 'Red Wine', image: require('../../assets/drinks/cup-150ml.png') },
    { name: 'Coffee', image: require('../../assets/drinks/cup-150ml.png') },
    { name: 'Milk', image: require('../../assets/drinks/cup-150ml.png') },
    { name: 'Soda', image: require('../../assets/drinks/cup-150ml.png') },
    { name: 'Yogurt', image: require('../../assets/drinks/cup-150ml.png') },
  ];

  const handleSave = () => {
    if (selectedBeverage && hydrationLevel) {
      addBeverage(selectedBeverage); // Call the function passed from the main screen
      navigation.goBack(); // Navigate back to the main screen
    } else {
      alert('Please select a beverage and enter the hydration level.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add your Beverages</Text>

      <Text style={styles.subTitle}>Enter Beverage Type</Text>
      <View style={styles.beverageGrid}>
        {beverageOptions.map((beverage, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.beverageItem,
              selectedBeverage === beverage.name && styles.selectedBeverage,
            ]}
            onPress={() => setSelectedBeverage(beverage.name)}
          >
            <Image source={beverage.image} style={styles.beverageImage} />
            <Text style={styles.beverageText}>{beverage.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.subTitle}>Enter Hydration Level</Text>
      <TextInput
        style={styles.input}
        value={hydrationLevel}
        onChangeText={setHydrationLevel}
        placeholder="Enter hydration level"
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>SAVE</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddBeverageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: GlobalStyles.colors.primary700,
    textAlign: 'center',
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 18,
    color: 'black',
    marginTop: 20,
    marginBottom: 10,
  },
  beverageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  beverageItem: {
    width: '22%',
    alignItems: 'center',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 10,
    padding: 5,
  },
  selectedBeverage: {
    borderColor: GlobalStyles.colors.primary300,
  },
  beverageImage: {
    width: 50,
    height: 50,
  },
  beverageText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: GlobalStyles.colors.primary400,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: GlobalStyles.colors.primary400,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
