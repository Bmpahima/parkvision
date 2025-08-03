import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView } from "react-native";
import { useEffect, useState } from "react";
import { Ionicons, AntDesign } from "@expo/vector-icons"; 

import { COLORS } from "../../constants/styles";
import Button from "../../components/Button";

/**
 * BookSpotScreen
 * 
 * This screen allows users to book a parking spot from a parking lot.
 * Users can select an arrival time and confirm their booking.
 * Displays basic payment info and estimated arrival time.
 * 
 * @component
 * @param {object} props
 * @param {object} props.navigation - Navigation object for navigation actions.
 * @param {object} props.route - Route object that includes params: parkingId, parkingLot.
 */


function BookSpotScreen({ navigation, route }) {
  const { parkingId, parkingLot } = route.params;

  /**
   * The selected arrival time option from the user.
   * Possible values: "Immediate", "1/2 hour", "1 hour"
   * 
   * @type {string}
   */

  const [isSelected, setIsSelected] = useState("Immediate");

  useEffect(() => {
    console.log(route.params);
  }, [route]);

  /**
   * Handle user selection of arrival time.
   * Updates state based on selected option.
   * 
   * @param {string} selectedOption - Selected time option.
   */

  const handleOptionSelection = (selectedOption) => {
    setIsSelected(selectedOption);
  };

  /**
   * Triggered when the user presses "Confirm Booking".
   * Calculates estimated arrival time based on selected option.
   * Displays a confirmation Alert, and on confirmation, navigates back to home.
   */

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

    if (estimated.hours >= 24) {
      estimated.hours = estimated.hours % 24;
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.headerIconContainer}>
            <Ionicons name="car" size={24} color={COLORS.primary500} style={styles.backIcon} />
          </View>
          <View>
            <Text style={styles.parkingTitle}>{parkingLot.name}</Text>
            <View style={styles.headerSubtitleContainer}>
              <Ionicons name="pricetag-outline" size={18} color={COLORS.primary500} />
              <Text style={styles.parkingSubtitle}>Parking ID: {parkingId}</Text>
            </View>
          </View>
        </View>
        <View style={styles.selectionContainer}>
          <View style={styles.selectionTitleContainer}>
            <Ionicons name="time-outline" size={24} color={COLORS.primary500} style={styles.backIcon} />
            <Text style={styles.selectionTitle}>Choose Arrival Time</Text>
          </View>
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
          <View style={styles.paymentTitleContainer}>
          <Ionicons name="cash-outline" size={24} color={COLORS.primary500} style={styles.backIcon} />
            <Text style={styles.selectionTitle}>Payment</Text>
          </View>
          <ScrollView >
            <View style={styles.paymentItem}>
              <Text style={styles.paymentLabel}>First Hour:</Text>
              <Text style={styles.paymentValue}>10₪</Text>
            </View>
            <View style={styles.paymentItem}>
              <Text style={styles.paymentLabel}>Second Hour:</Text>  
              <Text style={styles.paymentValue}>8₪</Text>          
            </View>
            <View style={styles.paymentItem}>
              <Text style={styles.paymentLabel}>From Third Hour:</Text>
              <Text style={styles.paymentValue}>5₪</Text>
            </View>
          </ScrollView>
        </View>
        <View style={styles.noteContainer}>
          <Ionicons name="information-circle-outline" size={24} color={COLORS.gray600} style={styles.backIcon} />
          <Text style={styles.note}>
            Payment starts as soon as you book the parking spot.
          </Text>
        </View>
        
        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.bookButton} onPress={onBookParking}>
            <Text style={styles.bookButtonText}>Confirm Booking</Text>
          </TouchableOpacity>
        </View>

        
      </View>
    </SafeAreaView>
  );
}

export default BookSpotScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.gray100,
  },
  container: {
    flex: 1,
    padding: 16
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: "center",
    backgroundColor: COLORS.gray50,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: COLORS.gray900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerIconContainer: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary50,
    alignItems: 'center',
    justifyContent: 'center', 
    marginRight: 16
  },
  headerSubtitleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'    
  },
  parkingTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary700,
    marginBottom: 4
  },
  parkingSubtitle: {
    fontSize: 14,
    color: COLORS.gray700,
    marginTop: 4,
    marginLeft: 6
  },
  selectionContainer: {
    padding: 16,
    marginBottom: 20,
    backgroundColor: COLORS.gray50,
    borderRadius: 12,
    shadowColor: COLORS.gray900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  selectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  selectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary800,
    marginLeft: 8
  },
  optionWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: COLORS.gray100,
    borderRadius: 12,
    marginHorizontal: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.gray300,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.gray800,
  },
  selectedOption: {
    backgroundColor: COLORS.primary500,
    borderWidth: 1,
    borderColor: COLORS.primary800,
  },
  selectedText: {
    color: COLORS.gray50,
  },
  paymentTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  paymentContainer: {
    backgroundColor: COLORS.gray50,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
    padding: 10,
    marginVertical: 5,
  },
  paymentLabel: {
    fontSize: 16,
    color: COLORS.gray600,
  },
  paymentValue: {
    fontSize: 16,
    color: COLORS.gray900,
    fontWeight: '600'
  },
  buttonWrapper: {
    marginVertical: 20,
  },
  bookButton: {
    backgroundColor: COLORS.primary700,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: COLORS.gray900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center'
  },
  bookButtonText: {
    color: COLORS.gray50,
    fontSize: 20,
    fontWeight: '500'
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 16
  },
  note: {
    fontSize: 14,
    color: COLORS.gray600,
    fontStyle: "italic",
    marginLeft: 8,
  },
});


