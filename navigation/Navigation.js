import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";

import Home from "../screens/Home/Home";
import History from "../screens/History/History";
import Settings from "../screens/Settings/Settings";
import Profile from "../screens/Profile/ProfileScreen"; // New screen for Profile
import Location from "../screens/Location/LocationMapScreen"; // New screen for Location
import { GlobalStyles } from "../constants/styles";
import AddBeverageScreen from '../screens/Beverage/AddBeverageScreen';
import Intro from '../screens/Intro/Intro';
import Registration from '../screens/Intro/Register/Register';
import Login from '../screens/Intro/Login/login';
import Age from '../screens/Intro/Age/age'
import ActivityLevelScreen from "../screens/Intro/ActivityLevel/ActivityLevelScreen";
import WaterConsumptionScreen from "../screens/Intro/WaterConsumptionScreen/WaterConsumptionScreen"
import ProfileScreen from "../screens/Profile/ProfileScreen";
import EditProfile from "../screens/Profile/EditProfileScreen";
import TimeSelection from "../screens/Intro/Time/TimeSelection";
import NotificationScreen from "../screens/NotificationScreen/NotificationScreen"
import LocationMapScreen from "../screens/Location/LocationMapScreen";
import ShopDetails from "../screens/Location/ShopDetailsScreen";
import WeeklyProgress from "../screens/WeeklyProgress/WeeklyProgress"


const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();

function HomeOverview() {
  return (
    <BottomTab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          height: 70,
          backgroundColor: "white",
          borderTopColor: "transparent",
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 10 },
          shadowRadius: 20,
          elevation: 20,
        },
        tabBarShowLabel: false, // Remove labels under icons
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
            color = focused ? "#00aaff" : "#8e8e93";
          } else if (route.name === "Location") {
            iconName = focused ? "location" : "location-outline";
            color = focused ? "#00aaff" : "#8e8e93";
          } else if (route.name === "Alarm") {
            iconName = focused ? "alarm" : "alarm-outline";
            color = focused ? "#00aaff" : "#8e8e93";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
            color = focused ? "#00aaff" : "#8e8e93";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
            color = focused ? "#00aaff" : "#8e8e93";
          }

          return (
            <View style={focused ? styles.focusedTab : null}>
              <Ionicons name={iconName} size={focused ? 30 : 24} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: GlobalStyles.colors.primary500,
        tabBarInactiveTintColor: "#8e8e93",
      })}
    >
      <BottomTab.Screen name="Home" component={Home} />
      <BottomTab.Screen name="Location" component={LocationMapScreen} />
      <BottomTab.Screen
        name="Alarm"
        component={NotificationScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={styles.floatingIcon}>
              <Ionicons name="alarm" size={30} color={focused ? "#ffffff" : "#8e8e93"} />
            </View>
          ),
        }}
      />
      <BottomTab.Screen name="Settings" component={WeeklyProgress} />
      <BottomTab.Screen name="Profile" component={ProfileScreen} />
    </BottomTab.Navigator>
  );
}

const styles = StyleSheet.create({
  focusedTab: {
    backgroundColor: "#f5f5f5",
    borderRadius: 50,
    padding: 10,
    elevation: 10,
  },
  floatingIcon: {
    position: "absolute",
    bottom: 20,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#00aaff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 20,
  },
});

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Registration" component={Registration} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Intro" component={Intro} />
      <Stack.Screen name="Age" component={Age} />
      <Stack.Screen name="ActivityLevelScreen" component={ActivityLevelScreen} />
      <Stack.Screen name="WaterConsumptionScreen" component={WaterConsumptionScreen} />
        <Stack.Screen name="HomeOverview" component={HomeOverview} />
        <Stack.Screen name="AddBeverageScreen" component={AddBeverageScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="TimeSelection" component={TimeSelection} />
        <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
        <Stack.Screen name="LocationMapScreen" component={LocationMapScreen} />
        <Stack.Screen name="ShopDetails" component={ShopDetails} />
        <Stack.Screen name="WeeklyProgress" component={WeeklyProgress} />

        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
