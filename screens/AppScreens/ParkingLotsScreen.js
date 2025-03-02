import React, { useState, useRef, useCallback } from "react";
import { View, StyleSheet, Alert, TextInput, ActivityIndicator, FlatList, Text, TouchableOpacity, Keyboard } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useFocusEffect } from "@react-navigation/native";

import { COLORS } from "../../constants/styles";
import { fetchAllParkingLot } from "../../http/parkingData";
import Feather from "@expo/vector-icons/Feather";

//  המסך של המפה - המסך הראשי
function ParkingLotScreen({ navigation }) {
  const [userLocation, setUserLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [parkingLotLocations, setParkingLotLocations] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef(null);

  async function verifyPermissions() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "No location permissions.");
      return false;
    }
    return true;
  }

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        try {
          const response = await fetchAllParkingLot();
          if (!response || response.error) {
            console.log("No Parking Lots Provided");
            setParkingLotLocations([]);
            return;
          }
          setParkingLotLocations(response);
        } catch (error) {
          console.error("Error fetching parking lots:", error);
          setParkingLotLocations([]);
        }
      }
      fetchData();
    }, []) 
  );

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      async function getLocationHandler() {
        setIsLoading(true);

        const hasPermission = await verifyPermissions();
        if (!hasPermission) {
          setIsLoading(false);
          return;
        }

        try {
          let location = await Location.getLastKnownPositionAsync();
          if (!location) {
            location = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            });
          }

          if (isMounted) {
            setUserLocation({
              lat: location.coords.latitude,
              long: location.coords.longitude,
            });
          }
        } catch (error) {
          console.error("Error getting location:", error);
        } finally {
          if (isMounted) setIsLoading(false);
        }
      }

      getLocationHandler();

      return () => {
        isMounted = false;
      };
    }, []) 
  );

  const onPressMarkerHandler = (parkingLot) => {
    navigation.navigate("parkingLotDetail", parkingLot);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    setShowSuggestions(true);
  };

  const handleSelectSuggestion = (parkingLot) => {
    setSearchQuery(parkingLot.name);
    setShowSuggestions(false);
  };

  const handleMapPress = () => {
    setShowSuggestions(false);
    Keyboard.dismiss();
  };

  const onSearchPress = () => {
    const selectedParkingSpot = parkingLotLocations.find(
      (park) => park.name.toLowerCase() === searchQuery.toLowerCase()
    );
  
    if (!selectedParkingSpot) {
      Alert.alert("Parking lot not found");
      return;
    }

    mapRef.current.animateToRegion(
      {
        latitude: selectedParkingSpot.latitude,
        longitude: selectedParkingSpot.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      1000
    );
  };

  const filteredLocations = parkingLotLocations.filter((loc) =>
    loc.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary500} />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchField}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search parking lots..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <TouchableOpacity style={styles.searchButton} onPress={onSearchPress}>
            <Feather name="search" size={24} color={COLORS.primary500} />
          </TouchableOpacity>
        </View>
        {showSuggestions && (
          <FlatList
            data={filteredLocations}
            keyExtractor={(item) => item.name}
            style={styles.suggestionList}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelectSuggestion(item)}>
                <Text style={styles.suggestionItem}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: userLocation?.lat || 31.243873,
          longitude: userLocation?.long || 34.793990,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        ref={mapRef}
        onPress={handleMapPress}
      >
        {filteredLocations.map((loc) => (
          <Marker
            key={loc.name}
            coordinate={{
              latitude: parseFloat(loc.latitude),
              longitude: parseFloat(loc.longitude),
            }}
            title={loc.name}
            onCalloutPress={() => onPressMarkerHandler(loc)}
            pinColor={COLORS.primary500}
          />
        ))}

      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.primary500,
  },
  searchContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    zIndex: 1,
  },
  searchInput: {
    height: 40,
    borderColor: COLORS.gray100,
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  searchField: {
    position: "relative",
    justifyContent: "center",
  },
  searchButton: {
    position: "absolute",
    alignSelf: "center",
    right: 8,
  },
  suggestionList: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: COLORS.gray100,
    borderTopWidth: 0,
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
});

export default ParkingLotScreen;
