import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";

import { COLORS } from "../../constants/styles";
import Button from "../../components/Button";

function BookSpotScreen({ navigation, route }) {
    
  const { parkingId, parkingLot } = route.params;
  const [isSelected, setIsSelected] = useState("Immediate");

    const handleOptionSelection = (selectedOption) => {
        setIsSelected(selectedOption);
    };

    const onBookParking = () => {

      let extraMinutes = 0;

      if (isSelected === '1/2 hour') {
        extraMinutes = 30;
      }
      else if (isSelected === '1 hour') {
        extraMinutes = 60;
      }

      const time = new Date();
      let estimated = {hours: time.getHours(), minutes: time.getMinutes()}
      estimated.minutes += extraMinutes;
      
      if (estimated.minutes >= 60) {
        estimated.minutes = estimated.minutes % 60;
        estimated.hours += 1;
      }

      const formattedTime = `${estimated.hours < 10 ? '0' + estimated.hours : estimated.hours}:${estimated.minutes < 10 ? '0' + estimated.minutes : estimated.minutes}`

      Alert.alert(
        "Booking Confirmation",
        `Estimated arriving time: ${formattedTime}`,
        [
          {text: 'Confirm', onPress: () => navigation.navigate('home', {...route.params})},
          {text: 'Cancel', onPress: () => {}}
        ]
        );
      
    };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parking {parkingId}</Text>
      <Text style={styles.parkingLotName}>{parkingLot.name}</Text>
      <View style={styles.content}>
        <Text style={styles.subtitle}>Arriving Time</Text>
        <View style={styles.options}>
          <TouchableOpacity 
                style={[styles.defaultContainer, isSelected === 'Immediate' && styles.selected]}
                onPress={() => handleOptionSelection('Immediate')}
            >
                <Text style={styles.textContainer}>Immediate</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.defaultContainer, isSelected === '1/2 hour' && styles.selected]}
                onPress={() => handleOptionSelection('1/2 hour')}
            >
                <Text style={styles.textContainer}>1/2 hour</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.defaultContainer, isSelected === '1 hour' && styles.selected]}
                onPress={() => handleOptionSelection('1 hour')}
            >
                <Text style={styles.textContainer}>1 hour</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.paymentContainer}>
          <Text style={styles.subtitle}>Payment</Text> 
          <ScrollView contentContainerStyle={styles.paymentContent}>
            <Text style={styles.paymentText}>First Hour:</Text>
            <Text style={styles.paymentText}>Second Hour:</Text>
            <Text style={styles.paymentText}>From Third Hour:</Text>
          </ScrollView>
        </View>
        <View style={styles.buttonContainer}>
            <Button onPress={onBookParking} buttonStyle={{backgroundColor: COLORS.primary800}}>Book Now</Button>
        </View>
        <Text style={styles.paymentMessage}>* The payment starts at the moment you book the parking spot.</Text>
      </View>
    </View>
  );
}

export default BookSpotScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 30,
    textAlign: "center",
    marginBottom: 8,
  },
  parkingLotName: {
    fontSize: 16,
    color: COLORS.gray700,
    marginBottom: 10,
    textAlign: 'center'
  },
  content: {
    flex: 1,
    alignItems: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
    alignSelf: "flex-start",
    color: COLORS.primary800,
  },
  options: {
    marginVertical: 0,
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    flexWrap: "wrap",
  },
  paymentContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: COLORS.primary100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: "95%",
  },
  paymentContent: {
    paddingVertical: 10,
  },
  paymentText: {
    fontSize: 16,
    color: COLORS.gray800,
    marginBottom: 6,
    textAlign: "center",
    fontWeight: '700',
  },
  buttonContainer: {
    alignSelf: 'stretch',
    marginVertical: 20
  },
  defaultContainer: {
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    backgroundColor: COLORS.gray300,
    borderRadius: 10,
    paddingVertical: 15,
    margin: 8,
  },
  textContainer: {
    color: COLORS.gray50,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600'
  },
  selected: {
    backgroundColor: COLORS.primary500,
    borderWidth: 2,
    borderColor: COLORS.primary700,
  },
  paymentMessage: {
    fontSize: 14
  }
});
