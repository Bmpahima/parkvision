import { useState, useRef, useCallback, useEffect } from "react";
import { View, StyleSheet, Alert, TextInput, ActivityIndicator, FlatList, Text, TouchableOpacity, Keyboard, StatusBar, Dimensions, Platform, SafeAreaView } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps"; 
import * as Location from "expo-location";
import { useFocusEffect } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getDistance } from 'geolib';


import { COLORS } from "../../constants/styles";
import { fetchAllParkingLot } from "../../http/parkingData";
import Card from "../../components/Card";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;


function ParkingLotScreen({ navigation }) {
  const [userLocation, setUserLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [parkingLotLocations, setParkingLotLocations] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [distances, setDistances] = useState({});
  
  const mapRef = useRef(null);
  const flatListRef = useRef(null);
  const searchInputRef = useRef(null);
  const scrollOffsetRef = useRef(0);

  // זו הפונקציה שמבקשת מהמשתמש הרשאות לקבל את המיקום שלו.
  const verifyPermissions = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Location Permission Required",
        [{ text: "OK" }]
      );
      return false;
    }
    return true;
  }, []);

  // בקשת מידע מעודכן כל פעם שהמסך מתעדכן.
  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        try {
          const response = await fetchAllParkingLot();
          if (!response || response.error) {
            setParkingLotLocations([]);
            return;
          }
          setParkingLotLocations(response);
        } catch (error) {
          console.log("Error fetching parking lots:", error);
          setParkingLotLocations([]);
          Alert.alert(
            "Connection Error",
            "Unable to load parking lots.",
            [{ text: "Retry", onPress: fetchData }]
          );
        }
      }
      fetchData();
    }, [])
  );

  // השגת המקום של המשתמש במידה וקיבלנו הרשאה לכך בזמן אמת
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      async function getLocationHandler() {
        setIsLoading(true);

        const hasPermission = await verifyPermissions();
        if (!hasPermission) {
          if (isMounted) setIsLoading(false);
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
          if (isMounted) {
            Alert.alert(
              "Location Error",
              "Unable to determine your location.",
              [{ text: "OK" }]
            );
          }
        } finally {
          if (isMounted) setIsLoading(false);
        }
      }

      getLocationHandler();

      return () => {
        isMounted = false;
      };
    }, [verifyPermissions])
  );


  // כל פעם שהמיקום של המשתמש משתנה או שהחניונים משתמנים, נחשב את המרחקים של המשתמש מכולם
  useEffect(() => {
    if (userLocation && parkingLotLocations.length > 0) {
      const calculatedDistances = {};
      
      const userCoords = { latitude: userLocation.lat, longitude: userLocation.long };

      parkingLotLocations.forEach((lot) => {
        const lotCoords = { latitude: parseFloat(lot.latitude), longitude: parseFloat(lot.longitude) };
        const distance = getDistance(lotCoords, userCoords) / 1000; // מחשב את המרחק בין שתי נקודות ציון
        
        calculatedDistances[lot.name] = distance;
      });

      setDistances(calculatedDistances);
    }
  }, [userLocation, parkingLotLocations]);

  // אם לחצתי על המידע של המרקר
  const onPressMarkerHandler = useCallback((parkingLot) => {
    navigation.navigate("parkingLotDetail", parkingLot);
  }, [navigation]);

  // כל פעם שהטקסט משתנה, נעדכן את השאילתא 
  const handleSearch = useCallback((text) => {
    setSearchQuery(text);
    setShowSuggestions(!!text);
  }, []);

  // פונקציה לגלילה של הרשימה
  const safeScrollToIndex = useCallback((index) => {
    if (!flatListRef.current) return;
    
    const currentFilteredLength = filteredLocations.length;
    
    if (index >= 0 && index < currentFilteredLength) {
      flatListRef.current.scrollToIndex({ index, animated: true });
    } else if (currentFilteredLength > 0) {
      flatListRef.current.scrollToIndex({ index: 0, animated: true });
    }
  }, [filteredLocations]);

  // בבחירה של אופציה מתוך רשימת האופציות, נלך לחניון הזה במפה
  const handleSelectSuggestion = useCallback((parkingLot) => {
    setSearchQuery(parkingLot.name);
    setShowSuggestions(false);
    Keyboard.dismiss();
    
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: parseFloat(parkingLot.latitude),
          longitude: parseFloat(parkingLot.longitude),
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        1000
      );
    }
    
    const index = parkingLotLocations.findIndex( // מציאת האינדקס של אותו איבר
      (item) => item.name === parkingLot.name
    );
    
    if (index !== -1) {
      safeScrollToIndex(index);
    }
    
    setSelectedMarker(parkingLot);
  }, [parkingLotLocations, safeScrollToIndex]);


  // בלחיצה סתם על המפה נעיף את רשימת ההצעות ואת המקלדת
  const handleMapPress = useCallback(() => {
    setShowSuggestions(false);
    Keyboard.dismiss();
  }, []);

  // בלחיצה על כפתור החיפוש
  const onSearchPress = useCallback(() => {
    const selectedParkingSpot = parkingLotLocations.find(
      (park) => park.name.toLowerCase() === searchQuery.toLowerCase()
    );
  
    if (!selectedParkingSpot) {
      Alert.alert(
        "Not Found",
        "No parking lot matches your search. Please try again.",
        [{ text: "OK" }]
      );
      return;
    }

    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: parseFloat(selectedParkingSpot.latitude),
          longitude: parseFloat(selectedParkingSpot.longitude),
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        1000
      );
    }
    
    const index = parkingLotLocations.findIndex(
      (item) => item.name === selectedParkingSpot.name
    );
    
    // Use the safe scroll function
    if (index !== -1) {
      safeScrollToIndex(index);
    }
    
    setSelectedMarker(selectedParkingSpot);
    Keyboard.dismiss();
  }, [parkingLotLocations, searchQuery, safeScrollToIndex]);

  // בלחיצה על מרקר
  const onMarkerPress = useCallback((parkingLot, index) => {
    // Use the safe scroll function
    safeScrollToIndex(index);
    setSelectedMarker(parkingLot);
  }, [safeScrollToIndex]);

  // בלחיצה על כרטיסיה נעבור אל עמוד החניות
  const onCardPress = useCallback((parkingLot) => {
    navigation.navigate("parkingLotDetail", parkingLot);
  }, [navigation]);

  // בלחיצה על כפתור החזרה
  const goToUserLocation = useCallback(() => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: userLocation.lat,
          longitude: userLocation.long,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        1000
      );
    } else {
      Alert.alert(
        "Location Unavailable",
        "Unable to determine your current location.",
        [{ text: "OK" }]
      );
    }
  }, [userLocation]);

  // מעדכן את מיקום הגלילה 
  const handleScroll = useCallback((event) => {
    scrollOffsetRef.current = event.nativeEvent.contentOffset.x;
  }, []);

  // החניונים המעודכנים בהתאם לשאילתא
  let filteredLocations = parkingLotLocations.filter((loc) =>
    loc.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  filteredLocations = filteredLocations.sort((p1, p2) => {
    const d1 = distances[p1.name] ?? Infinity;
    const d2 = distances[p2.name] ?? Infinity;
    return d1 - d2;
  })

  // אם אנחנו טוענים מידע 
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent
        />
        <ActivityIndicator size="large" color={COLORS.primary500} />
          <Text style={styles.loadingText}>
            Finding parking spots near you...
          </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
      />

      <View style={styles.searchContainer}>
        <BlurView intensity={50} tint="light" style={styles.blurContainer}>
          <View style={styles.searchField}>
            <Feather name="search" size={20} color={COLORS.gray600} style={styles.searchIcon} />
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder="Search parking lots..."
              placeholderTextColor={COLORS.gray400}
              value={searchQuery}
              onChangeText={handleSearch}
              onFocus={() => {
                setShowSuggestions(!!searchQuery);
              }}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  setSearchQuery("");
                  setShowSuggestions(false);
                }}
              >
                <Feather name="x" size={18} color={COLORS.gray400} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.searchButton}
              onPress={onSearchPress}
            >
              <LinearGradient
                colors={[COLORS.primary400 , COLORS.primary600]}
                style={styles.searchButtonGradient}
              >
                <Feather name="arrow-right" size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {showSuggestions && (
            <FlatList
              data={filteredLocations}
              keyExtractor={(item) => item.id}
              style={styles.suggestionList}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => handleSelectSuggestion(item)}
                >
                  <Feather
                    name="map-pin"
                    size={16}
                    color={COLORS.primary500}
                    style={styles.suggestionIcon}
                  />
                  <Text style={styles.suggestionText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No parking lots found</Text>
                </View>
              )}
            />
          )}
        </BlurView>
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
        showsMyLocationButton={false}
        mapPadding={{ top: 0, right: 0, bottom: 180, left: 0 }}
      >
        {filteredLocations.map((loc, index) => (
          <Marker
            key={loc.id}
            coordinate={{
              latitude: parseFloat(loc.latitude),
              longitude: parseFloat(loc.longitude),
            }}
            title={loc.name}
            description={loc.address}
            onPress={() => onMarkerPress(loc, index)}
            pinColor={
              selectedMarker?.name === loc.name
                ? 'red' 
                : COLORS.primary500
            }
          >
            <Callout tooltip onPress={() => onPressMarkerHandler(loc)}>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{loc.name}</Text>
                {loc.freeSpots !== undefined && (
                  <Text style={styles.calloutSubtitle}>
                    {loc.freeSpots > 0
                      ? `${loc.freeSpots} spots available`
                      : "No spots available"}
                  </Text>
                )}
                <Text style={styles.calloutAction}>Tap for details</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <TouchableOpacity style={styles.locationButton} onPress={goToUserLocation}>
        <LinearGradient
          colors={["#ffffff", "#f5f5f5"]}
          style={styles.locationButtonGradient}
        >
          <Ionicons name="locate" size={22} color={COLORS.primary500} />
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.carouselContainer}>
        {filteredLocations.length > 0 ? (
          <FlatList
            ref={flatListRef}
            data={filteredLocations}
            horizontal
            pagingEnabled
            snapToInterval={CARD_WIDTH + 20}
            snapToAlignment="center"
            contentInset={{
              top: 0,
              left: SPACING_FOR_CARD_INSET,
              bottom: 0,
              right: SPACING_FOR_CARD_INSET,
            }}
            contentContainerStyle={{
              paddingHorizontal:
                Platform.OS === "android" ? SPACING_FOR_CARD_INSET : 0,
            }}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => 
                        <Card 
                          parkingLot={item}
                          onCardPress={onCardPress}
                          distance={distances[item.name]}
                        />}
            keyExtractor={(item) => item.id}
            onScroll={handleScroll}
            getItemLayout={(data, index) => ({
              length: CARD_WIDTH + 20,
              offset: (CARD_WIDTH + 20) * index,
              index,
            })}
          />
        ) : (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>No parking lots found</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray50,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.gray50,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.primary500,
    fontWeight: "500",
  },
  searchContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    zIndex: 5,
    borderRadius: 12,
    overflow: "hidden",
    
  },
  blurContainer: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: 12,
  },
  searchField: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    paddingHorizontal: 15,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: COLORS.gray800,
  },
  clearButton: {
    padding: 5,
  },
  searchButton: {
    marginLeft: 10,
  },
  searchButtonGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  suggestionList: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    maxHeight: 200,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  suggestionIcon: {
    marginRight: 10,
  },
  suggestionText: {
    fontSize: 15,
    color: COLORS.gray800,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    color: COLORS.gray400,
    fontSize: 14,
  },
  locationButton: {
    position: "absolute",
    bottom: 220,
    right: 20,
    zIndex: 3,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  locationButtonGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  calloutContainer: {
    width: 160,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calloutTitle: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
    color: COLORS.gray800,
  },
  calloutSubtitle: {
    fontSize: 12,
    color: COLORS.gray600,
    marginBottom: 4,
  },
  calloutAction: {
    fontSize: 11,
    color: COLORS.primary500,
    fontWeight: "500",
    marginTop: 4,
  },
  carouselContainer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  noResultsContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noResultsText: {
    fontSize: 16,
    color: COLORS.gray600,
  },
});

export default ParkingLotScreen;