import React, { useEffect, useState, useLayoutEffect, useCallback } from "react";
import { Text, View, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons"; 


import ParkingSpot from "../../components/ParkingSpot";
import { COLORS } from "../../constants/styles";
import Button from "../../components/Button";
import { fetchParkingLotUsers } from "../../http/parkingData";


// המסך בו אפשר לראות את כל החניות בחניון מסויים במסך האדמין
function ParkingLotManage({ route, navigation }) {
    const { parkingLotDetail, parkings } = route.params;
    const [parkingSpots, setParkingSpots] = useState(parkings);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useFocusEffect(
        useCallback(() => {
            async function getParkingData() {
                try {
                    setLoading(true);
                    const response = await fetchParkingLotUsers(parkingLotDetail.id);
                    if (response.error) {
                        setError(response.error);
                    } else {
                        setParkingSpots(response.parkings);
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
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.innerHeader}>
                    <FontAwesome5 name="parking" size={24} color={COLORS.primary700} />
                    <Text style={styles.titleText}>{parkingLotDetail.name}</Text>
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
                    </View>
                )
            }    
            <View style={styles.buttonWrapper}>
                <TouchableOpacity style={styles.goBackButton} onPress={navigation.goBack}>
                    <Ionicons name="arrow-back" size={20} color={COLORS.gray50} />
                    <Text style={styles.buttonText}>Go Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.goBackButton, styles.historyButton]} onPress={() => { navigation.navigate('AdminHistoryScreen', { parkingLotDetail }) }}>
                    <Ionicons name="archive-outline" size={20} color={COLORS.gray50} />
                    <Text style={styles.buttonText}>History</Text>
                </TouchableOpacity>
            </View>
            </View>
        </SafeAreaView>
    );
}

export default ParkingLotManage;


const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
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
    },
    parkingLot: {
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center", 
        padding: 16,
        gap: 16
    },
    goBackButton: {
        flex: 1,
        backgroundColor: COLORS.primary400,
        borderRadius: 10, 
        flexDirection: "row",  
        alignItems: "center", 
        justifyContent: "center",  
        padding: 14,        
        shadowColor: COLORS.gray700,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        fontSize: 18,
        color: COLORS.gray50,
        fontWeight: '600',
        marginLeft: 8
    },
    historyButton: {
        backgroundColor: COLORS.gray400
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
  });
  

//   import React, { useEffect, useState, useLayoutEffect, useCallback } from "react";
// import { Text, View, FlatList, StyleSheet, SafeAreaView, StatusBar, Alert } from "react-native";
// import { useFocusEffect } from "@react-navigation/native";

// import ParkingSpot from "../../components/ParkingSpot";
// import { COLORS } from "../../constants/styles";
// import Button from "../../components/Button";
// import { fetchParkingLotUsers } from "../../http/parkingData";


// // המסך בו אפשר לראות את כל החניות בחניון מסויים במסך האדמין
// function ParkingLotManage({ route, navigation }) {
//     const { parkingLotDetail, parkings } = route.params;
//     const freeSpots = parkingLotDetail.freeSpots;
//     const occupiedSpots = parkingLotDetail.parking_spots - freeSpots;
//     const [parkingSpots, setParkingSpots] = useState(parkings);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useFocusEffect(
//         useCallback(() => {
//             async function getParkingData() {
//                 try {
//                     setLoading(true);
//                     const response = await fetchParkingLotUsers(parkingLotDetail.id);
//                     if (response.error) {
//                         setError(response.error);
//                     } else {
//                         setParkingSpots(response.parkings);
//                     }
//                 } catch (err) {
//                     setError("Failed to fetch parking data.");
//                 } finally {
//                     setLoading(false);
//                 }
//             }
//             getParkingData();
//         }, [parkingLotDetail.id])
//     );

//     useLayoutEffect(() => {
//         navigation.setOptions({
//             title: parkingLotDetail.name
//         });
//     }, [navigation, parkingLotDetail]);

//     const onParkingPress = (id, occupied, saved, driver = null) => {
//         if (occupied && driver) {
//             navigation.navigate("ParkingUserManager", { user: driver }); 
//         } else if (saved && driver) {
//             navigation.navigate("ParkingUserManager", { user: driver }); 
//         } else {
//             Alert.alert("ParkVision", `This Parking is free`, [{ text: "Cancel", onPress: () => {} }]);
//         }
//     };
    

//     return (
//         <SafeAreaView style={styles.safeArea}>
//             <View style={styles.container}>
//                 <View style={styles.header}>
//                     <Text style={styles.title}>{parkingLotDetail.name}</Text>
//                     <View style={styles.statusBar}>
//                         <Text style={styles.statusText}>
//                             Free: <Text style={styles.statusNumber}>{freeSpots}</Text>
//                         </Text>
//                         <Text style={styles.statusText}>
//                             Occupied: <Text style={styles.statusNumber}>{occupiedSpots}</Text>
//                         </Text>
//                     </View>
//                 </View>
//                 <FlatList
//                     data={parkingSpots}
//                     keyExtractor={(item) => item.id.toString()}
//                     numColumns={2}
//                     renderItem={({ item }) => (
//                         <ParkingSpot
//                             occupied={item.occupied}
//                             saved={item.saved}
//                             id={item.id}
//                             onPress={() => onParkingPress(item.id, item.occupied, item.saved, item.user)}
//                         />
//                     )}
//                     contentContainerStyle={styles.parkingLot}
//                 />
//                 <View style={styles.buttonWrapper}>
//                     <Button buttonStyle={styles.goBackButton} onPress={navigation.goBack}>Go Back</Button>
//                 </View>
//             </View>
//         </SafeAreaView>
//     );
// }

// export default ParkingLotManage;


// const styles = StyleSheet.create({
//     safeArea: {
//       flex: 1,
//     },
//     container: {
//         flex: 1,
//     },
//     header: {
//       padding: 20,
//       backgroundColor: "#ffffff",
//       borderBottomWidth: 1,
//       borderBottomColor: "#e0e0e0",
//     },
//     title: {
//       fontSize: 24,
//       fontWeight: "bold",
//       marginBottom: 10,
//     },
//     statusBar: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//     },
//     statusText: {
//       fontSize: 16,
//       color: "#666",
//     },
//     statusNumber: {
//       fontWeight: "bold",
//       color: "#333",
//     },
//     parkingLot: {
//       padding: 10,
//       justifyContent: "center",
//       alignItems: "center",
//     },
//     buttonWrapper: {
//         alignItems: "center", 
//         justifyContent: "center", 
//         marginVertical: 20, 
//     },
//     goBackButton: {
//         backgroundColor: COLORS.primary800,
//         paddingVertical: 12, 
//         borderRadius: 10, 
//         alignItems: "center", 
//     },
//   });
  


