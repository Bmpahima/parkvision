import { useContext, useCallback, useState } from "react";
import { Text, View, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import Button from "../../components/Button";
import { COLORS } from "../../constants/styles";
import { UserContext } from "../../store/UserContext";
import { fetchOwnerParkingLots } from "../../http/parkingData";


// זה המסך שבו רואים את רשימת החניונים של אותו admin
function ParkingManage({ navigation }) {
  const userCtx = useContext(UserContext);
  const [parkingLots, setParkingLots] = useState([]);  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null); 

  useFocusEffect(
    useCallback(() => {
      async function getParkingLots() {
        try {
          setLoading(true);
          const response = await fetchOwnerParkingLots(userCtx.user.id);
          if (response.error) {
            setError(response.error);
          } else {
            setParkingLots(response);
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Hello, {userCtx.user.fname}</Text>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary500} style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.sectionTitle}>Select Parking Area</Text>
          <View style={styles.buttonContainer}>
            {parkingLots.length > 0 ? (
              parkingLots.map((park) => (
                <Button
                  key={park.name}
                  onPress={() => {
                    navigation.navigate('ParkingManage', { parkingLotDetail: park, parkings: park.parkings });
                  }}
                  buttonStyle={styles.button}
                  labelStyle={styles.buttonText}
                >
                  {park.name}
                </Button>
              ))
            ) : (
              <Text style={styles.noDataText}>No parking lots available</Text>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

export default ParkingManage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray100,
  },
  header: {
    paddingVertical: 20,
    alignItems: "center",
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.gray700,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    gap: 15,
  },
  button: {
    backgroundColor: COLORS.primary500,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.gray50,
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
