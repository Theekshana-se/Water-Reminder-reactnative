import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";

import Home from "../screens/Home/Home";
import History from "../screens/History/History";
import Settings from "../screens/Settings/Settings";
import Profile from "../screens/Profile/Profile"; // New screen for Profile
import Location from "../screens/Location/Location"; // New screen for Location
import { GlobalStyles } from "../constants/styles";
import AddBeverageScreen from '../screens/Beverage/AddBeverageScreen';

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
      <BottomTab.Screen name="Location" component={Location} />
      <BottomTab.Screen
        name="Alarm"
        component={History}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={styles.floatingIcon}>
              <Ionicons name="alarm" size={30} color={focused ? "#00aaff" : "#00aafff"} />
            </View>
          ),
        }}
      />
      <BottomTab.Screen name="Settings" component={Settings} />
      <BottomTab.Screen name="Profile" component={Profile} />
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
        <Stack.Screen name="HomeOverview" component={HomeOverview} />
        <Stack.Screen name="AddBeverageScreen" component={AddBeverageScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
