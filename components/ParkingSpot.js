
import { TouchableOpacity, Text, StyleSheet, Image } from "react-native";

import { COLORS } from "../constants/styles";


function ParkingSpot({ id, occupied, saved, onPress }) {
    const onParkingSelection = () => {
        onPress();
    };

    let currentStyle = styles.availableSpot;

    if (occupied) {
        currentStyle = styles.occupiedSpot
    }
    else if (saved) {
        currentStyle = styles.savedSpot
    }

    return (
        <TouchableOpacity
            style={[
                styles.spot,
                currentStyle
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
        backgroundColor: COLORS.primary500, 
        borderColor: COLORS.primary700,
        borderWidth: 1
      },
      occupiedSpot: {
        backgroundColor: COLORS.gray700,
        borderColor: COLORS.gray900,
        borderWidth: 2
      },
      savedSpot: {
        backgroundColor: COLORS.gray300,
        borderColor: COLORS.gray400,
        borderWidth: 2
      },
      spotText: {
        color: "#fff",
        fontWeight: "bold",
      },
});