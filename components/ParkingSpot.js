
import { TouchableOpacity, Text, StyleSheet, Image } from "react-native";

import { COLORS } from "../constants/styles";

function ParkingSpot({ id, occupied, parkingLot, onPress, license_number }) {
    const onParkingSelection = () => {
        onPress(id, occupied, parkingLot, license_number);
    };

    return (
        <TouchableOpacity
            style={[
                styles.spot,
                occupied ? styles.occupiedSpot : styles.availableSpot,
            ]}
            onPress={onParkingSelection}
        >
            {
                occupied ? (
                    <Image source={require('../images/timer-car.png')} style={{height: 120, width: 120, resizeMode: 'contain', transform: [{rotate: '90deg'}]}}/>
                ) : (
                    <Text style={styles.spotText}>{id}</Text> 
                )
            }
          
            
        </TouchableOpacity>
    );
}

export default ParkingSpot;

const styles = StyleSheet.create({
    spot: {
        width: 160,
        height: 75,
        margin: 5,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
      },
      availableSpot: {
        backgroundColor: COLORS.primary400, 
        borderColor: COLORS.primary600,
        borderWidth: 1
      },
      occupiedSpot: {
        backgroundColor: COLORS.gray200,
        borderColor: COLORS.gray400,
        borderWidth: 2
      },
      spotText: {
        color: "#fff",
        fontWeight: "bold",
      },
});