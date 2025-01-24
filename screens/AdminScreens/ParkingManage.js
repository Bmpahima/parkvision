import { useContext } from "react";
import { Text, View, StyleSheet, SafeAreaView, ScrollView } from "react-native";

import Button from "../../components/Button";
import { COLORS } from "../../constants/styles";
import { UserContext } from "../../store/UserContext";
import { DUMMY_DATA } from "../../constants/data";

function ParkingManage({ navigation }) {

    const userCtx = useContext(UserContext);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>hello, {userCtx.user.fname}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Select Parking Area</Text>
        <View style={styles.buttonContainer}>
           {
              DUMMY_DATA.map((park) => {
                  return (
                      <Button 
                          key={park.name} 
                          onPress={() => {
                              navigation.navigate('ParkingManage', { parkingLotDetail: park, parkings: park.parkings })
                          }} 
                          buttonStyle={styles.button} 
                          labelStyle={styles.buttonText}
                      >
                          {park.name}
                      </Button>
                  );
              })
           } 
        </View>
      </ScrollView>
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
});
