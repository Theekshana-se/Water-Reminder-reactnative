import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ShopDetailsScreen = ({ route }) => {
  const { shop } = route.params;
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack(); // Navigate back to the previous screen (Location page)
  };

  return (
    <View style={styles.container}>
      {/* StatusBar for visibility */}
      <StatusBar barStyle="dark-content" translucent={false} backgroundColor="#fff" />

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.shopName}>{shop.name}</Text>
      <Image source={{ uri: 'https://www.perfectwater.co.za/wp-content/uploads/2013/07/2.jpg' }} style={styles.shopImage} />
      <Text style={styles.shopAddress}>No 12, Galle Rd, {shop.name}</Text>
      <Text style={styles.shopInfo}>📞 0772811676 / 011435787</Text>
      <Text style={styles.shopInfo}>⏰ Open until 10:30 PM</Text>
      <Text style={styles.shopInfo}>📄 License: CFA/BW/01/2021-01</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  shopName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 60, // Adjust for back button space
  },
  shopImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  shopAddress: {
    fontSize: 18,
    marginBottom: 5,
  },
  shopInfo: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default ShopDetailsScreen;
