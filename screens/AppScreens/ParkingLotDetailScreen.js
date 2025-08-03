import { useEffect, useState, useLayoutEffect, useCallback, useContext } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; 


import ParkingSpot from "../../components/ParkingSpot";
import { COLORS } from "../../constants/styles";
import { fetchParking } from "../../http/parkingData";
import { UserContext } from "../../store/UserContext";


/**
 * ParkingLotDetailScreen allows users to view and select a parking spot
 * in a specific parking lot. It fetches spot availability and handles booking.
 *
 * @param {object} props - Component props
 * @param {object} props.navigation - React Navigation object
 * @param {object} props.route - Contains parking lot details (id, name, etc.)
 */

function ParkingLotDetailScreen({ navigation, route }) {
  const parkingLotDetail = route.params;
  const [parkingSpots, setParkingSpots] = useState([]);
  const [loading, setLoading] = useState(false);
  const userCtx = useContext(UserContext);

  /**
   * Fetches parking spot data for the selected parking lot when the screen is focused.
   * Updates loading state and spot data accordingly.
   */
  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        try {
          setLoading(true);
          const response = await fetchParking(parkingLotDetail.id); 
          if (!response || response.error) {
            console.log("No Parking Lots Provided");
            setParkingSpots([]);
            return;
          }
  
          console.log("The response: ", response);
          setParkingSpots(response.parkings || []); 
        } catch (error) {
          console.error("Error fetching parking spots:", error);
          setParkingSpots([]);
        } finally {
          setLoading(false);
        }
      }
  
      fetchData();
    }, [parkingLotDetail.id]) 
  );
  
  /**
   * Sets the screen title in the navigation bar to the name of the parking lot.
   */
  useLayoutEffect(() => {
    navigation.setOptions({
      title: parkingLotDetail.name,
    });
  }, [navigation, parkingLotDetail]);

  /**
   * Handles what happens when a user taps on a parking spot.
   * Prevents booking if already parked, spot is taken, or confirms navigation to booking screen.
   *
   * @param {number} id - ID of the selected parking spot
   * @param {boolean} occupied - Whether the spot is currently occupied
   * @param {boolean} saved - Whether the spot is already reserved
   */
  const onParkingPress = (id, occupied, saved) => {
    if (userCtx.isParked) {
      Alert.alert(
        "ParkVision",
        `Your'e already parking in parking no. ${userCtx.parkingId}`,
        [{ text: "Cancel", onPress: () => {} }]
      );
      return;
    }

    if (occupied) {
      Alert.alert(
        "ParkVision",
        `This spot is already occupied. Try another one.`,
        [{ text: "Cancel", onPress: () => {} }]
      );
    } 
    else if (saved) {
      Alert.alert(
        "ParkVision",
        `This spot is already occupied. Try another one.`,
        [
          { text: "Cancel", onPress: () => {} },
        ]
      );
    }
    else {
      Alert.alert(
        "ParkVision",
        `Do you want to book parking ${id}?`,
        [
          {
            text: "Confirm",
            onPress: () =>
              navigation.navigate("bookingParkingSpot", {
                parkingId: id,
                parkingLot: parkingLotDetail,
              }),
          },
          { text: "Cancel", onPress: () => {} },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.innerHeader}>
          <Ionicons name="car" size={24} color={COLORS.primary700} />
          <Text style={styles.titleText}>Book a Spot</Text>
        </View>
        <View style={styles.availableContainer}>
          <View style={styles.outerStat}>
            <Text style={styles.stat}>{parkingLotDetail.parking_spots}</Text>
            <Text style={styles.subStat}>Total Spots</Text>
          </View>
          <View style={styles.horLine}></View>
          <View style={styles.outerStat}>
            <Text style={styles.stat}>{parkingLotDetail.freeSpots}</Text>
            <Text style={styles.subStat}>Available</Text>
          </View>
          <View style={styles.horLine}></View>
          <View style={styles.outerStat}>
            <Text style={styles.stat}>{parkingLotDetail.parking_spots - parkingLotDetail.freeSpots}</Text>
            <Text style={styles.subStat}>Occupied</Text>
          </View>
        </View>
      </View>
      <View style={styles.colorGuideContainer}>
          <Text style={styles.guideHeader}>Spot Status Guide</Text>
        <View style={styles.colorGuide}>
            <View style={styles.legendContainer}>
              <View style={styles.legend}></View>
              <Text style={styles.legendText}>Available</Text>
            </View>
            <View style={styles.legendContainer}>
              <View style={[styles.legend, { backgroundColor: COLORS.gray300 }]}></View>
              <Text style={styles.legendText}>Saved</Text>
            </View>
            <View style={styles.legendContainer}>
              <View style={[styles.legend, { backgroundColor: COLORS.gray700 }]}></View>
              <Text style={styles.legendText}>Occupied</Text>
            </View>
          </View>
      </View>
      {
        loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary500} style={styles.loader} />
            <Text style={styles.loadingText}>Loading Parking Spots...</Text>
          </View>
        ) : (
          <View style={styles.parkingSpotsContainer}>
            <Text style={styles.selectionHeader}>
              Select a Parking Spot
            </Text>
            <FlatList
              data={parkingSpots}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              renderItem={({ item }) => (
                <ParkingSpot
                  occupied={item.occupied}
                  saved={item.saved}
                  id={item.id}
                  onPress={() => {onParkingPress(item.id, item.saved, item.occupied, )}}
                />
              )}
              contentContainerStyle={styles.parkingLot}
              style={styles.spotList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )
      }
      
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.gray100,
  },
  container: {
    flex: 1,
  },
  header: {
    margin: 16,
    backgroundColor: COLORS.gray50,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.gray900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  innerHeader: {
    flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.primary800,
    marginLeft: 8,
  },
  availableContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primary50,
    borderRadius: 12,
    padding: 16,
  },
  horLine: {
    height: 40,
    width: 1,
    backgroundColor: COLORS.gray300
  },
  outerStat: {
    flex: 1,
    alignItems: 'center'
  },
  stat: {
    color: COLORS.primary900,
    fontSize: 24,
    fontWeight: '700',
  },
  subStat: {
    fontSize: 14,
    color: COLORS.gray700,
    marginTop: 4
  },
  colorGuideContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: COLORS.gray50,
    padding: 16,
    shadowColor: COLORS.gray900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  guideHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.gray800,
    marginBottom: 12,
  },
  colorGuide: {
    flexDirection: "row",
    justifyContent: 'space-between',
    paddingHorizontal: 8
  },
  legendContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  legend: {
    height: 20,
    width: 20,
    backgroundColor: COLORS.primary500,
    borderRadius: 5,
    margin: 5,
  },
  legendText: {
    fontSize: 15,
    color: COLORS.gray700,
  },
  parkingSpotsContainer: {
    flex: 1,
    paddingBottom: 16,    
  },
  selectionHeader: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.gray800,
    marginBottom: 12,
    paddingLeft: 16
  },
  spotList: {
    alignSelf: 'center',
    marginHorizontal: 20
  },
  parkingLot: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 50
  },
  loadingText: {
    color: COLORS.primary500,
    fontSize: 16
  }
});

export default ParkingLotDetailScreen;
