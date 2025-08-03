import { useContext, useCallback, useState } from "react";
import { Text, View, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, StatusBar } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; 

import { COLORS } from "../../constants/styles";
import { UserContext } from "../../store/UserContext";
import { fetchOwnerParkingLots } from "../../http/parkingData";
import { TouchableOpacity } from "react-native";


/**
 * ParkingManage
 * 
 * Admin screen to view the list of parking lots owned by the current admin.
 * Displays a welcome message, fetches the parking data on focus,
 * and allows navigating into each parking lot to manage it.
 * 
 * @component
 * @param {object} props - Props passed by React Navigation.
 * @param {object} props.navigation - Navigation object for navigating between screens.
 */

function ParkingManage({ navigation }) {
  const userCtx = useContext(UserContext);
  const [parkingLots, setParkingLots] = useState([]);  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null); 

   /**
   * ParkingItem
   * 
   * A single item component that represents a parking lot in the list.
   * 
   * @param {object} props
   * @param {object} props.parkingLot - The parking lot data object.
   * @param {function} props.onPress - Callback function to invoke on press.
   */

  const ParkingItem = ({ parkingLot, onPress}) => {
    return (
      <TouchableOpacity style={styles.parkingItemContainer} onPress={onPress}>
        <View style={styles.parkingItemContentContainer}>
          <View style={styles.iconContainer}>
              <Ionicons name="car" size={28} color={COLORS.primary500} />
          </View>
          <View style={styles.parkingItemTextContainer}>
              <Text style={styles.parkingNameText}>{parkingLot.name}</Text>
              <Text style={styles.parkingSubText}>{parkingLot.parking_spots + " parking spots"}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="chevron-forward" size={24} color={COLORS.gray400} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  useFocusEffect(
    useCallback(() => {
       /**
       * Fetches the list of parking lots for the current admin.
       * Updates the `parkingLots` state or sets error on failure.
       */
      async function getParkingLots() {
        try {
          setLoading(true);
          const response = await fetchOwnerParkingLots(userCtx.user.id);
          if (response.error) {
            setError(response.error);
          } else {
            setParkingLots(response);
            console.log(response);
          }
        } catch (err) {
          setError("Failed to fetch parking lots.");
        } finally {
          setLoading(false);
        }
      }
      getParkingLots();
    }, [userCtx.user.id]) 
  );

  return (
    <>
    <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerSubText}>Welcome back,</Text>
        <Text style={styles.headerText}>{userCtx.user.fname}</Text>
      </View>
      <View style={styles.listTitleContainer}>
        <Text style={styles.listTitle}>Your Parking Areas</Text>
        <View style={styles.separator}></View>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary500} style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          
          <View style={styles.buttonContainer}>
            {parkingLots.length > 0 ? (
              parkingLots.map((park) => (
                <ParkingItem
                  key={park.id}
                  parkingLot={park}
                  onPress={() => {
                    navigation.navigate('ParkingManage', { parkingLotDetail: park, parkings: park.parkings });
                  }}
                />
              ))
            ) : (
              <Text style={styles.noDataText}>No parking lots available</Text>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
    </>
  );
}

export default ParkingManage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray100,
  },
  headerContainer: {
    padding: 28,
    backgroundColor: COLORS.primary800,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    marginBottom: 10,
    shadowColor: COLORS.gray900,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.gray50,
    marginTop: 8,
  },
  headerSubText: {
    fontSize: 18,
    color: COLORS.primary100,
  },
  listTitleContainer: {
    padding: 20
  },
  listTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  separator: {
    width: 50,
    height: 4,
    backgroundColor: COLORS.primary500,
    borderRadius: 10,
    marginVertical: 10
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  parkingItemContainer: {
    padding: 16,
    backgroundColor: COLORS.gray50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 16,
    shadowColor: COLORS.gray900,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginVertical: 6
  },
  parkingItemContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    padding: 12,
    backgroundColor: COLORS.primary50,
    borderRadius: 11,
    marginRight: 12
  },
  parkingItemTextContainer: {
    gap: 4
  },
  parkingNameText: {
    fontWeight: '600',
    fontSize: 18
  },
  parkingSubText: {
    fontSize: 15,
    color: COLORS.gray500
  },
  loader: {
    marginTop: 50,
    alignSelf: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  noDataText: {
    fontSize: 16,
    textAlign: "center",
    color: COLORS.gray500,
  },
});
