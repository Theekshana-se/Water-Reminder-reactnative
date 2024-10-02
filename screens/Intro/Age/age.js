import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import WheelPickerExpo from "react-native-wheel-picker-expo";
import { useNavigation, useRoute } from '@react-navigation/native';
import Button from "../../../components/Buttons/Button";
import IntroImage from "../../../components/Intro/IntroImage";
import { age, GENDER_SCREEN } from "../../../constants/screens";
import { GlobalStyles } from "../../../constants/styles";
import { updateUserAge } from '../../../lib/appwrite'; // Import the updateUserAge function

const AGES = Array.from({ length: 83 }, (_, i) => i + 18); // Generates ages from 18 to 100

const Age = () => {
  const [age, setAge] = useState(25);
  const navigation = useNavigation(); // Hook to access navigation
  const route = useRoute();
  const { weight, selectedGender } = route.params; // Receive data from Weight screen

  // This function handles storing age in the database and navigating to the next page
  const nextPageHandler = async () => {
    try {
      await updateUserAge(age); // Save age to Appwrite database
      console.log('Age saved successfully');
      navigation.navigate("ActivityLevelScreen", { age, weight, selectedGender });
    } catch (error) {
      console.error('Failed to save age:', error);
    }
  };

  const goBackHandler = () => {
    navigation.navigate(GENDER_SCREEN);
  };

  const ageChangeHandler = ({ item }) => {
    setAge(item.value);
  };

  const ageImage =
    selectedGender === "male"
      ? require("../../../assets/weights/weight-male.png")
      : require("../../../assets/weights/weight-female.png");

  const textColorAge =
    selectedGender === "male"
      ? styles.maleActiveTextColor
      : styles.femaleActiveTextColor;

  return (
    <View style={styles.container}>
      <View style={styles.genderContainer}>
        <IntroImage
          mainImageSrc={ageImage}
          textImageSrc={null}
          text="How old are you?"
          activeColor={textColorAge}
        />
        <View style={styles.imageContainer}>
          <WheelPickerExpo
            backgroundColor="#F2F2F2"
            height={180}
            width={60}
            renderItem={(props) => (
              <View>
                <Text style={[styles.text, textColorAge]}>{props.label}</Text>
              </View>
            )}
            initialSelectedIndex={7}
            onChange={ageChangeHandler}
            items={AGES.map((value) => ({ label: value, value: value }))}
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

export default Age;

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
