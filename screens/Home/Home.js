import { useEffect } from "react";
import { BackHandler, StyleSheet, Text, View } from "react-native";
import ManageDrinks from "../../components/ManageDrinks/ManageDrinks";
import { GlobalStyles } from "../../constants/styles";

// import { getItem } from "../../storage/database";
// import { ACTIVITY_KEY } from "../../constants/storage";

const Home = () => {
  const activityHandler = async () => {
    // console.log(await getItem(ACTIVITY_KEY));
  };
  useEffect(() => {
    activityHandler();
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );
    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      <ManageDrinks />
    </View>
  );
};

export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    justifyContent: 'flex-start', // Ensure children are aligned at the start
    paddingVertical: 0, // Remove any vertical padding
  },
  recordsText: {
    fontSize: 21,
    marginBottom: 20,
    color: GlobalStyles.colors.primary400,
  },
});
