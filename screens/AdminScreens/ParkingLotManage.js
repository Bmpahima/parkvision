import React from "react"
import { Text, View, FlatList, StyleSheet, SafeAreaView, StatusBar, Alert } from "react-native"
import { useEffect, useState, useLayoutEffect } from "react";
import ParkingSpot from "../../components/ParkingSpot"
import { COLORS } from "../../constants/styles";
import Button from "../../components/Button";


function ParkingLotManage({ route, navigation }) {
    const { parkingLotDetail, parkings } = route.params;
    const freeSpots = parkingLotDetail.freeSpots
    const occupiedSpots = parkingLotDetail.parking_spots - freeSpots;

    const [parkingSpots, setParkingSpots] = useState(parkings);
    
        // useEffect(() => {
        //   fetchParking();
        // }, []); 
    
        useLayoutEffect(() => {
            navigation.setOptions({
                title: parkingLotDetail.name
            });
        }, [navigation, parkingLotDetail])


        const onParkingPress = (id, occupied, parkingLot, license_number=null) => {
                if ( !occupied ) {
                    Alert.alert('ParkVision', `This Parking is free`,[
                        {text: 'Cancel', onPress: () => {}}
                    ]); 
                }
                else {
                    Alert.alert('ParkVision', `This spot is occupied by: \n User Details: \n ${license_number && license_number} `,[
                        {text: 'Cancel', onPress: () => {}}
                    ]);
                }
            }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Parking Lot 01</Text>
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
                      id={item.id} 
                      parkingLot={parkingLotDetail} 
                      license_number={item.license_number}
                      onPress={onParkingPress}
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

export default ParkingLotManage

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
  

