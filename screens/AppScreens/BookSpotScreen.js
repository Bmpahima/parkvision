import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useEffect, useState } from "react";
import { COLORS } from "../../constants/styles";
import Button from "../../components/Button";

function BookSpotScreen({ navigation, route }) {
  const { parkingId, parkingLot } = route.params;
  const [isSelected, setIsSelected] = useState("Immediate");

  useEffect(() => {
    console.log(route.params);
  }, [route]);

  const handleOptionSelection = (selectedOption) => {
    setIsSelected(selectedOption);
  };

  const onBookParking = () => {
    let extraMinutes = 0;
    let request_time = "immediate";

    if (isSelected === "1/2 hour") {
      extraMinutes = 30;
      request_time = "half";
    } else if (isSelected === "1 hour") {
      extraMinutes = 60;
      request_time = "hour";
    }

    const time = new Date();
    let estimated = { hours: time.getHours(), minutes: time.getMinutes() };
    estimated.minutes += extraMinutes;

    if (estimated.minutes >= 60) {
      estimated.minutes = estimated.minutes % 60;
      estimated.hours += 1;
    }

    const formattedTime = `${estimated.hours < 10 ? "0" + estimated.hours : estimated.hours}:${estimated.minutes < 10 ? "0" + estimated.minutes : estimated.minutes}`;

    Alert.alert(
      "Booking Confirmation",
      `Estimated arriving time: ${formattedTime}`,
      [
        { text: "Confirm", onPress: () => navigation.navigate("home", { ...route.params, request_time, cameFromBooking: true }) },
        { text: "Cancel", onPress: () => {} },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reserve Your Spot</Text>

      <View style={styles.detailsContainer}>
        <Text style={styles.parkingTitle}>{parkingLot.name}</Text>
        <Text style={styles.parkingSubtitle}>Parking ID: {parkingId}</Text>
      </View>

      <View style={styles.selectionContainer}>
        <Text style={styles.sectionTitle}>Choose Arrival Time</Text>
        <View style={styles.optionWrapper}>
          {["Immediate", "1/2 hour", "1 hour"].map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.optionButton, isSelected === option && styles.selectedOption]}
              onPress={() => handleOptionSelection(option)}
            >
              <Text style={[styles.optionText, isSelected === option && styles.selectedText]}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.paymentContainer}>
        <Text style={styles.sectionTitle}>Payment</Text>
        <ScrollView contentContainerStyle={styles.paymentContent}>
          <Text style={styles.paymentText}>First Hour: 10₪</Text>
          <Text style={styles.paymentText}>Second Hour: 8₪</Text>
          <Text style={styles.paymentText}>From Third Hour: 5₪</Text>
        </ScrollView>
      </View>

      <View style={styles.buttonWrapper}>
        <Button onPress={onBookParking} buttonStyle={styles.bookButton}>Confirm Booking</Button>
      </View>

      <Text style={styles.note}>
        * The payment starts as soon as you book the parking spot.
      </Text>
    </View>
  );
}

export default BookSpotScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.primary900,
    marginBottom: 20,
  },
  detailsContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  parkingTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.primary700,
  },
  parkingSubtitle: {
    fontSize: 16,
    color: COLORS.gray700,
    marginTop: 4,
  },
  selectionContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.primary800,
    marginBottom: 10,
  },
  optionWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  optionButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: COLORS.gray300,
    borderRadius: 12,
    marginHorizontal: 6,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.gray800,
  },
  selectedOption: {
    backgroundColor: COLORS.primary500,
    borderWidth: 2,
    borderColor: COLORS.primary800,
  },
  selectedText: {
    color: COLORS.gray50,
  },
  paymentContainer: {
    width: "100%",
    backgroundColor: COLORS.primary100,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentContent: {
    width: "100%",
    alignItems: "center",
  },
  paymentText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.gray900,
    marginVertical: 5,
  },
  buttonWrapper: {
    width: "100%",
    marginVertical: 20,
  },
  bookButton: {
    backgroundColor: COLORS.primary800,
    paddingVertical: 14,
    borderRadius: 15,
    elevation: 4,
  },
  note: {
    fontSize: 14,
    color: COLORS.gray600,
    textAlign: "center",
    fontStyle: "italic",
  },
});


