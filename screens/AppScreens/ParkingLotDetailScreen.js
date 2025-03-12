import { useEffect, useState, useLayoutEffect, useCallback, useContext } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; 


import ParkingSpot from "../../components/ParkingSpot";
import { COLORS } from "../../constants/styles";
import { fetchParking } from "../../http/parkingData";
import { UserContext } from "../../store/UserContext";


// המסך של בחירת החנייה לשמירה
function ParkingLotDetailScreen({ navigation, route }) {
  const parkingLotDetail = route.params;
  const [parkingSpots, setParkingSpots] = useState([]);
  const [loading, setLoading] = useState(false);
  const userCtx = useContext(UserContext);

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
  

  useLayoutEffect(() => {
    navigation.setOptions({
      title: parkingLotDetail.name,
    });
  }, [navigation, parkingLotDetail]);

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



// import { useEffect, useState, useLayoutEffect, useCallback, useContext } from "react";
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, SafeAreaView } from "react-native";
// import { useFocusEffect } from "@react-navigation/native";
// import { Ionicons } from "@expo/vector-icons"; 

// import ParkingSpot from "../../components/ParkingSpot";
// import { COLORS } from "../../constants/styles";
// import { fetchParking } from "../../http/parkingData";
// import { UserContext } from "../../store/UserContext";

// function ParkingLotDetailScreen({ navigation, route }) {
//   const parkingLotDetail = route.params;
//   const [parkingSpots, setParkingSpots] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const userCtx = useContext(UserContext);

//   useFocusEffect(
//     useCallback(() => {
//       async function fetchData() {
//         setLoading(true);
//         try {
//           const response = await fetchParking(parkingLotDetail.id);
//           if (!response || response.error) {
//             console.log("No Parking Lots Provided");
//             setParkingSpots([]);
//             return;
//           }

//           console.log("The response: ", response);
//           setParkingSpots(response.parkings || []);
//         } catch (error) {
//           console.error("Error fetching parking spots:", error);
//           setParkingSpots([]);
//         } finally {
//           setLoading(false);
//         }
//       }

//       fetchData();
//     }, [parkingLotDetail.id])
//   );

//   useLayoutEffect(() => {
//     navigation.setOptions({
//       title: parkingLotDetail.name,
//       headerShown: false, // Hide default header since we're creating our own
//     });
//   }, [navigation, parkingLotDetail]);

//   const onParkingPress = (id, occupied, saved) => {
//     if (userCtx.isParked) {
//       Alert.alert(
//         "ParkVision",
//         `You're already parking in parking spot #${userCtx.parkingId}`,
//         [{ text: "OK", style: "default" }]
//       );
//       return;
//     }

//     if (occupied) {
//       Alert.alert(
//         "ParkVision",
//         `This spot is already occupied. Please try another one.`,
//         [{ text: "OK", style: "default" }]
//       );
//     } else if (saved) {
//       Alert.alert(
//         "ParkVision",
//         `This spot is already reserved. Please try another one.`,
//         [{ text: "OK", style: "default" }]
//       );
//     } else {
//       Alert.alert(
//         "ParkVision",
//         `Do you want to book parking spot #${id}?`,
//         [
//           {
//             text: "Book Now",
//             onPress: () =>
//               navigation.navigate("bookingParkingSpot", {
//                 parkingId: id,
//                 parkingLot: parkingLotDetail,
//               }),
//             style: "default",
//           },
//           { text: "Cancel", style: "cancel" },
//         ]
//       );
//     }
//   };

//   // Calculate available spots
//   const availableSpots = parkingSpots.filter(
//     spot => !spot.occupied && !spot.saved
//   ).length;

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <TouchableOpacity 
//             style={styles.backButton} 
//             onPress={() => navigation.goBack()}
//           >
//             <Ionicons name="chevron-back" size={24} color={COLORS.primary700} />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>{parkingLotDetail.name}</Text>
//           <View style={styles.headerRight} />
//         </View>

//         <View style={styles.infoCard}>
//           <View style={styles.infoHeader}>
//             <Ionicons name="car" size={24} color={COLORS.primary700} />
//             <Text style={styles.title}>Book a Spot</Text>
//           </View>
          
//           <View style={styles.statsContainer}>
//             <View style={styles.statItem}>
//               <Text style={styles.statValue}>{parkingLotDetail.parking_spots}</Text>
//               <Text style={styles.statLabel}>Total Spots</Text>
//             </View>
            
//             <View style={styles.statDivider} />
            
//             <View style={styles.statItem}>
//               <Text style={styles.statValue}>{availableSpots}</Text>
//               <Text style={styles.statLabel}>Available</Text>
//             </View>
            
//             <View style={styles.statDivider} />
            
//             <View style={styles.statItem}>
//               <Text style={styles.statValue}>{parkingLotDetail.parking_spots - availableSpots}</Text>
//               <Text style={styles.statLabel}>Occupied</Text>
//             </View>
//           </View>
//         </View>

//         <View style={styles.legendCard}>
//           <Text style={styles.legendTitle}>Spot Status Guide</Text>
          
//           <View style={styles.colorGuide}>
//             <View style={styles.legendContainer}>
//               <View style={[styles.legend, { backgroundColor: COLORS.primary500 }]}></View>
//               <Text style={styles.legendText}>Available</Text>
//             </View>
            
//             <View style={styles.legendContainer}>
//               <View style={[styles.legend, { backgroundColor: COLORS.gray300 }]}></View>
//               <Text style={styles.legendText}>Reserved</Text>
//             </View>
            
//             <View style={styles.legendContainer}>
//               <View style={[styles.legend, { backgroundColor: COLORS.gray700 }]}></View>
//               <Text style={styles.legendText}>Occupied</Text>
//             </View>
//           </View>
//         </View>

//         {loading ? (
//           <View style={styles.loadingContainer}>
//             <Text style={styles.loadingText}>Loading parking spots...</Text>
//           </View>
//         ) : parkingSpots.length === 0 ? (
//           <View style={styles.emptyContainer}>
//             <Ionicons name="alert-circle-outline" size={48} color={COLORS.gray500} />
//             <Text style={styles.emptyText}>No parking spots available</Text>
//           </View>
//         ) : (
//           <View style={styles.parkingGridContainer}>
//             <Text style={styles.sectionTitle}>Select a Parking Spot</Text>
//             <FlatList
//               data={parkingSpots}
//               keyExtractor={(item) => item.id.toString()}
//               numColumns={2}
//               renderItem={({ item }) => (
//                 <ParkingSpot
//                   occupied={item.occupied}
//                   saved={item.saved}
//                   id={item.id}
//                   onPress={() => {onParkingPress(item.id, item.occupied, item.saved)}}
//                 />
//               )}
//               contentContainerStyle={styles.parkingLot}
//               showsVerticalScrollIndicator={false}
//             />
//           </View>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: COLORS.gray50,
//   },
//   container: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//     backgroundColor: 'white',
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.gray200,
//     elevation: 2,
//   },
//   backButton: {
//     padding: 8,
//   },
//   headerRight: {
//     width: 40, // For balance with back button
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: COLORS.gray900,
//   },
//   infoCard: {
//     margin: 16,
//     backgroundColor: 'white',
//     borderRadius: 16,
//     padding: 16,
//     shadowColor: COLORS.gray900,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   infoHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: COLORS.primary800,
//     marginLeft: 8,
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: COLORS.primary50,
//     borderRadius: 12,
//     padding: 16,
//   },
//   statItem: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   statValue: {
//     fontSize: 24,
//     fontWeight: "700",
//     color: COLORS.primary900,
//   },
//   statLabel: {
//     fontSize: 14,
//     color: COLORS.gray700,
//     marginTop: 4,
//   },
//   statDivider: {
//     width: 1,
//     height: 40,
//     backgroundColor: COLORS.gray300,
//   },
//   legendCard: { //////////////////////////////////
//     marginHorizontal: 16,
//     marginBottom: 16,
//     backgroundColor: 'white',
//     borderRadius: 16,
//     padding: 16,
//     shadowColor: COLORS.gray900,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   legendTitle: { ////////////////////////////
//     fontSize: 16,
//     fontWeight: "600",
//     color: COLORS.gray800,
//     marginBottom: 12,
//   },
//   colorGuide: { //////////////////////////////
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingHorizontal: 8,
//   },
//   legendContainer: { /////////////////////////
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   legend: { /////////////////////////////////////
//     height: 20,
//     width: 20,
//     borderRadius: 6,
//     marginRight: 8,
//     borderWidth: 1,
//     borderColor: COLORS.gray300,
//   },
//   legendText: {
//     fontSize: 14,
//     color: COLORS.gray700,
//   },
//   parkingGridContainer: {
//     flex: 1,
//     paddingHorizontal: 16,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: COLORS.gray800,
//     marginBottom: 12,
//   },
//   parkingLot: {
//     paddingBottom: 20,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     fontSize: 16,
//     color: COLORS.gray700,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 32,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: COLORS.gray700,
//     textAlign: 'center',
//     marginTop: 16,
//   },
// });

// export default ParkingLotDetailScreen;
