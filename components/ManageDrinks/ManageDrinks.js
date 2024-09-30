import { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, Image, Animated, TouchableOpacity } from "react-native";
import { ACTIVITY_KEY, WEIGHT_KEY } from "../../constants/storage";
import { GlobalStyles } from "../../constants/styles";
import { getItem } from "../../storage/database";
import { calcDailyGoal, calculateDrinkProgress } from "../../utils/Drinks";
import Button from "../Buttons/Button";
import UIModal from "../UI/UIModal";
import { useNavigation } from "@react-navigation/native"; // For navigation between screens

const ManageDrinks = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [drinkProgress, setDrinkProgress] = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState(0);
  const [selectedBeverage, setSelectedBeverage] = useState('Water'); // Default to Water
  const [beverageOptions, setBeverageOptions] = useState(['Water', 'Coffee']); // Initial options
  const [dailyGoal, setDailyGoal] = useState();
  
  // Animated value for the water height
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation(); // Initialize navigation hook

  useEffect(() => {
    const getUserInfo = async () => {
      const weight = await getItem(WEIGHT_KEY);
      const activity = await getItem(ACTIVITY_KEY);
      const calcDailyIntake = calcDailyGoal(weight, activity);
      setDailyGoal(calcDailyIntake);
    };
    getUserInfo();
  }, []);

  const openModalHandler = () => {
    setModalVisible(true);
  };

  const closeModalHandler = () => {
    setModalVisible(false);
  };

  const confirmModalHandler = async (selectedQuantity) => {
    if (selectedQuantity) {
      setModalVisible(false);
      let [height, progress] = await calculateDrinkProgress(selectedQuantity);
      if (progress >= 100) {
        progress = 100;
      }

      // Animate the water fill inside the glass
      Animated.timing(animatedHeight, {
        toValue: height, // height value from calculateDrinkProgress
        duration: 1500,  // duration of the animation
        useNativeDriver: false, // We're animating height, so no native driver here
      }).start();

      setDrinkProgress(progress);
    }
  };

  const selectQuantityHandler = (selectedItem) => {
    setSelectedQuantity(selectedItem);
    confirmModalHandler(selectedItem);
  };

  const addBeverageHandler = () => {
    // Navigate to the Add Beverage screen and pass a callback to update the beverages
    navigation.navigate('AddBeverageScreen', {
      addBeverage: (newBeverage) => {
        setBeverageOptions([...beverageOptions, newBeverage]);
      }
    });
  };

  const selectBeverageHandler = (beverage) => {
    setSelectedBeverage(beverage);
  };

  return (
    <>
      <View style={styles.container}>
        {/* Glass Image with Water Overlay */}
        <View style={styles.glassContainer}>
          <Image 
            source={require('../../assets/glass.png')} 
            style={styles.glassImage}
            resizeMode="contain"
          />
          
          {/* Water fill animation */}
          <Animated.View style={[styles.water, { height: animatedHeight }]}></Animated.View>
          
          {/* Percentage text */}
          <Text style={styles.waterText}>{drinkProgress} %</Text>
        </View>

        {/* Beverage Selection */}
        <Text style={styles.beveragePrompt}>How much water do you want to drink at this time?</Text>
        <View style={styles.beverageSelection}>
          {beverageOptions.map((beverage, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.beverageButton}
              onPress={() => selectBeverageHandler(beverage)}
            >
              <Image 
                source={
                  beverage === 'Water' 
                    ? require('../../assets/drinks/big-cup-50ml.png')
                    : beverage === 'Coffee'
                    ? require('../../assets/drinks/big-cup-50ml.png')
                    : require('../../assets/drinks/big-cup-50ml.png') // Default beverage icon for new ones
                }
                style={styles.beverageIcon}
              />
              <Text style={styles.beverageText}>{beverage}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity 
            style={styles.beverageButton}
            onPress={addBeverageHandler}
          >
            <Image 
              source={require('../../assets/beverages/add-button.png')} // Add beverage icon
              style={styles.beverageIcon}
            />
            <Text style={styles.beverageText}>+ Add Beverage</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.center}>
        <Button
          icon="add"
          size={22}
          buttonStyles={styles.button}
          color={GlobalStyles.colors.white}
          onPress={openModalHandler}
        >
          <Text style={styles.buttonText}>Drink</Text>
        </Button>
      </View>

      <View style={styles.modalContainer}>
        <UIModal
          isVisible={isModalVisible}
          onSelect={selectQuantityHandler}
          onClose={closeModalHandler}
          onConfirm={confirmModalHandler}
        />
      </View>
    </>
  );
};

export default ManageDrinks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  glassContainer: {
    position: "relative",
    width: 100,
    height: 250,
    marginTop: -30, 
    alignItems: "center",
    justifyContent: "center",
  },
  glassImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  water: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: GlobalStyles.colors.primary300,
    borderBottomLeftRadius: 10, 
    borderBottomRightRadius: 10,
    overflow: "hidden",
  },
  waterText: {
    position: "absolute",
    bottom: 10,
    left: "35%",
    fontSize: 20,
    color: GlobalStyles.colors.primary700,
    fontWeight: "bold",
  },
  beveragePrompt: {
    fontSize: 16,
    color: 'black',
    marginTop: 20,
    textAlign: "left",
  },
  beverageSelection: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginTop: 20,
  },
  beverageButton: {
    alignItems: "center",
  },
  beverageIcon: {
    width: 50,
    height: 50,
  },
  beverageText: {
    fontSize: 14,
    color: GlobalStyles.colors.primary700,
  },
  center: {
    marginTop: "auto",
    marginBottom: "auto",
  },
  button: {
    width: 250,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: GlobalStyles.colors.primary400,
    borderRadius: 25,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 4,
  },
  buttonText: {
    color: GlobalStyles.colors.white,
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: 4,
  },
});
