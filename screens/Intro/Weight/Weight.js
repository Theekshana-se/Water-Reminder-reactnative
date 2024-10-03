import { useState } from "react";
import { Image, StyleSheet, Text, View, StatusBar } from "react-native";
import { useNavigation } from '@react-navigation/native';
import WheelPickerExpo from "react-native-wheel-picker-expo";
import Button from "../../../components/Buttons/Button";
import IntroImage from "../../../components/Intro/IntroImage";
import { GlobalStyles } from "../../../constants/styles";
import { updateUserWeight } from '../../../lib/appwrite'; // Import the function

const WEIGHTS = [
  40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120,
];

const Weight = ({ selectedGender }) => {
  const [weight, setWeight] = useState(70);
  const navigation = useNavigation(); // Hook to access navigation

  const nextPageHandler = async () => {
    try {
      await updateUserWeight(weight); // Save weight to Appwrite database
      console.log('Weight saved successfully');
      navigation.navigate('Age', { weight, selectedGender });
    } catch (error) {
      console.error('Failed to save weight:', error);
    }
  };

  const goBackHandler = () => {
    navigation.navigate('GenderScreen');
  };

  const weightChangeHandler = ({ item }) => {
    setWeight(item.value);
  };

  const weightImage =
    selectedGender === "male"
      ? require("../../../assets/weights/weight-male.png")
      : require("../../../assets/weights/weight-female.png");

  const textColorWeight =
    selectedGender === "male"
      ? styles.maleActiveTextColor
      : styles.femaleActiveTextColor;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent={false} backgroundColor="#fff" />
      <View style={styles.genderContainer}>
        <IntroImage
          mainImageSrc={weightImage}
          textImageSrc={null}
          text="How much do you weigh?"
          activeColor={textColorWeight}
        />
        <View style={styles.imageContainer}>
          <WheelPickerExpo
            backgroundColor="#F2F2F2"
            height={180}
            width={60}
            renderItem={(props) => (
              <View>
                <Text style={[styles.text, textColorWeight]}>{props.label}</Text>
              </View>
            )}
            initialSelectedIndex={6}
            onChange={weightChangeHandler}
            items={WEIGHTS.map((value) => ({ label: value, value: value }))}
          />
        </View>
      </View>
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

export default Weight;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  genderContainer: {
    marginTop: "auto",
    alignItems: "center",
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  maleActiveTextColor: {
    color: GlobalStyles.colors.primary400,
  },
  femaleActiveTextColor: {
    color: "#FF4593",
  },
  text: {
    fontSize: 28,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginTop: "auto",
  },
  button: {
    backgroundColor: GlobalStyles.colors.primary400,
    marginTop: 40,
    marginBottom: 40,
    paddingVertical: 10,
    width: "30%",
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: GlobalStyles.colors.white,
    fontWeight: "bold",
    fontSize: 18,
    textTransform: "uppercase",
  },
});
