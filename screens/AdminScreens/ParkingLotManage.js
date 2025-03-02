import React, { useEffect, useState, useLayoutEffect, useCallback } from "react";
import { Text, View, FlatList, StyleSheet, SafeAreaView, StatusBar, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import ParkingSpot from "../../components/ParkingSpot";
import { COLORS } from "../../constants/styles";
import Button from "../../components/Button";
import { fetchParkingLotUsers } from "../../http/parkingData";


// המסך בו אפשר לראות את כל החניות בחניון מסויים במסך האדמין
function ParkingLotManage({ route, navigation }) {
    const { parkingLotDetail, parkings } = route.params;
    const freeSpots = parkingLotDetail.freeSpots;
    const occupiedSpots = parkingLotDetail.parking_spots - freeSpots;
    const [parkingSpots, setParkingSpots] = useState(parkings);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useFocusEffect(
        useCallback(() => {
            async function getParkingData() {
                console.log(parkingSpots)
                try {
                    setLoading(true);
                    const response = await fetchParkingLotUsers(parkingLotDetail.id);
                    if (response.error) {
                        setError(response.error);
                    } else {
                        setParkingSpots(response.parkings);
                        console.log(response.parkings);
                    }
                } catch (err) {
                    setError("Failed to fetch parking data.");
                } finally {
                    setLoading(false);
                }
            }
            getParkingData();
        }, [parkingLotDetail.id])
    );

    useLayoutEffect(() => {
        navigation.setOptions({
            title: parkingLotDetail.name
        });
    }, [navigation, parkingLotDetail]);

    const onParkingPress = (id, occupied, saved, driver = null) => {
        if (occupied && driver) {
            navigation.navigate("ParkingUserManager", { user: driver }); 
        } else if (saved && driver) {
            navigation.navigate("ParkingUserManager", { user: driver }); 
        } else {
            Alert.alert("ParkVision", `This Parking is free`, [{ text: "Cancel", onPress: () => {} }]);
        }
    };
    

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{parkingLotDetail.name}</Text>
                <View style={styles.statusBar}>
                    <Text style={styles.statusText}>
                        Free: <Text style={styles.statusNumber}>{freeSpots}</Text>
                    </Text>
                    <Text style={styles.statusText}>
                        Occupied: <Text style={styles.statusNumber}>{occupiedSpots}</Text>
                    </Text>
                </View>
            </View>
            <FlatList
                data={parkingSpots}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                renderItem={({ item }) => (
                    <ParkingSpot
                        occupied={item.occupied}
                        saved={item.saved}
                        id={item.id}
                        onPress={() => onParkingPress(item.id, item.occupied, item.saved, item.user)}
                    />
                )}
                contentContainerStyle={styles.parkingLot}
            />
            <View style={styles.buttonWrapper}>
                <Button buttonStyle={styles.goBackButton} onPress={navigation.goBack}>Go Back</Button>
            </View>
        </SafeAreaView>
    );
}

export default ParkingLotManage;


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f0f0f0",
    },
    header: {
      padding: 20,
      backgroundColor: "#ffffff",
      borderBottomWidth: 1,
      borderBottomColor: "#e0e0e0",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 10,
    },
    statusBar: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    statusText: {
      fontSize: 16,
      color: "#666",
    },
    statusNumber: {
      fontWeight: "bold",
      color: "#333",
    },
    parkingLot: {
      padding: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    buttonWrapper: {
        alignItems: "center", 
        justifyContent: "center", 
        marginVertical: 20, 
    },
    goBackButton: {
        backgroundColor: COLORS.primary800,
        paddingVertical: 12, 
        borderRadius: 10, 
        alignItems: "center", 
    },
  });
  

