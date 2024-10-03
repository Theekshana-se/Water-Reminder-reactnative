import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Dimensions, StatusBar } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';

const LocationMapScreen = () => {
  const navigation = useNavigation();

  // Initial region centered on Sri Lanka
  const [region, setRegion] = useState({
    latitude: 7.8731,
    longitude: 80.7718,
    latitudeDelta: 2.0,
    longitudeDelta: 2.0,
  });

  // Random water shop locations
  const waterShops = [
    { id: 1, name: 'Water Shop Kagalle', latitude: 7.2508, longitude: 80.3451 },
    { id: 2, name: 'Water Shop Galle', latitude: 6.0535, longitude: 80.221 },
    { id: 3, name: 'Water Shop Kurunegala', latitude: 7.4866, longitude: 80.3657 },
    { id: 4, name: 'Water Shop Monaragala', latitude: 6.8724, longitude: 81.3501 },
    { id: 5, name: 'Water Shop Matara', latitude: 5.9485, longitude: 80.5484 },
  ];

  const onMarkerPress = (shop) => {
    // Navigate to shop details when a marker is clicked
    navigation.navigate('ShopDetails', { shop });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent={false} backgroundColor="#fff" />
      {/* Search bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Find Location"
        // Add search functionality here using Google Places API or similar
      />

      {/* Map with markers */}
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {waterShops.map((shop) => (
          <Marker
            key={shop.id}
            coordinate={{ latitude: shop.latitude, longitude: shop.longitude }}
            title={shop.name}
            onPress={() => onMarkerPress(shop)}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default LocationMapScreen;
