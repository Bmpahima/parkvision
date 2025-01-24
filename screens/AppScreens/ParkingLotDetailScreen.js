import { useEffect, useState, useLayoutEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";

import ParkingSpot from "../../components/ParkingSpot";
import { COLORS } from "../../constants/styles";
import { fetchParking } from "../../http/parkingData";

function ParkingLotDetailScreen({ navigation, route }) {
  const parkingLotDetail = route.params;
  const [parkingSpots, setParkingSpots] = useState([]);

  // Fetch parking spots data
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetchParking(parkingLotDetail.id);
        if (!response || response.error) {
          console.log("No Parking Lots Provided");
          setParkingSpots([]);
          return;
        }

        console.log("The response: ", response);
        setParkingSpots(response.parkings || []); // Default to an empty array if no parkings
      } catch (error) {
        console.error("Error fetching parking spots:", error);
        setParkingSpots([]);
      }
    }

    fetchData();
  }, [parkingLotDetail]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: parkingLotDetail.name,
    });
  }, [navigation, parkingLotDetail]);

  const onParkingPress = (id, occupied, parkingLot) => {
    if (!occupied) {
      Alert.alert(
        "ParkVision",
        `Do you want to book parking ${id}?`,
        [
          {
            text: "Confirm",
            onPress: () =>
              navigation.navigate("bookingParkingSpot", {
                parkingId: id,
                parkingLot,
              }),
          },
          { text: "Cancel", onPress: () => {} },
        ]
      );
    } else {
      Alert.alert(
        "ParkVision",
        `This spot is already occupied. Try another one.`,
        [{ text: "Cancel", onPress: () => {} }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book a Spot</Text>
      <Text style={styles.subtitle}>Total Spots: {parkingLotDetail.parking_spots}</Text>

      <View style={styles.colorGuide}>
        <View style={styles.legendContainer}>
          <View style={styles.legend}></View>
          <Text style={styles.legendText}>available</Text>
        </View>
        <View style={styles.legendContainer}>
          <View style={[styles.legend, { backgroundColor: COLORS.gray200 }]}></View>
          <Text style={styles.legendText}>occupied</Text>
        </View>
      </View>

      <FlatList
        data={parkingSpots}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          <ParkingSpot
            occupied={item.occupied}
            id={item.id}
            parkingLot={parkingLotDetail}
            onPress={onParkingPress}
          />
        )}
        contentContainerStyle={styles.parkingLot}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  colorGuide: {
    flexDirection: "row",
    justifyContent: "center",
  },
  legendContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
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
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: COLORS.primary500,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  parkingLot: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ParkingLotDetailScreen;
