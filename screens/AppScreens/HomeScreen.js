import { useEffect, useRef, useState, useContext, useCallback } from "react";
import { View, Text, StyleSheet, SafeAreaView, Alert } from "react-native";
import { useIsFocused, useFocusEffect } from "@react-navigation/native";

import Button from "../../components/Button";
import { COLORS } from "../../constants/styles";
import CarTimerCircle from "../../components/CarTimerCircle";
import { bookParking, unBookParking } from "../../http/parkingData";
import { UserContext } from "../../store/UserContext";


const defaultTimerDisplay = {
  hours: "00",
  minutes: "00",
  seconds: "00",
};

/**
 * HomeScreen
 *
 * This is the main screen shown to the user when they are actively parked or reserving a parking spot.
 * It manages a live timer, handles reservation expiration, and allows the user to start or stop a parking session.
 *
 * @component
 * @param {object} props
 * @param {object} props.navigation - React Navigation object for navigating between screens.
 * @param {object} props.route - Contains parameters like parkingId and request_time.
 */

function HomeScreen({ navigation, route }) {
  const isFocused = useIsFocused();
  const userCtx = useContext(UserContext);
  const [timeValue, setTimeValue] = useState(defaultTimerDisplay);
  const [timerRunning, setTimerRunning] = useState(false);
  const [reservedUntil, setReservedUntil] = useState(null);
  const startTimeRef = useRef(null);
  const timerRef = useRef(null);
  const hasExpiredRef = useRef(false);
  
  /**
   * Resets the timer when screen is unfocused and timer is not running.
   */
  useEffect(() => {
    if (!isFocused && !timerRunning) {
      setTimeValue(defaultTimerDisplay);
      userCtx.stopParking()
    }
  }, [isFocused]);

  /**
   * Redirects user to home screen if no valid parking session is active.
   */
  useFocusEffect(
    useCallback(() => {
      const isMissingParams =
        !route.params || !route.params.parkingId || !route.params.request_time;

      if (!userCtx.isParked  && isMissingParams) {
        Alert.alert(
          "Access Denied",
          "You must have an active parking session to use this screen.",
          [
            {
              text: "OK",
              onPress: () => navigation.reset({
                                index: 0,
                                routes: [{ name: 'ParkingLotHome' }],
                              }),
            },
          ]
        );
      } else if (
        route.params &&
        userCtx.isParked &&
        userCtx.parkingId !== route.params.parkingId
      ) {
        Alert.alert(
          "Access Denied",
          "You must have an active parking session to use this screen.",
          [
            {
              text: "OK",
              onPress: () => navigation.reset({
                                index: 0,
                                routes: [{ name: 'ParkingLotHome' }],
                              }),
            },
          ]
        );
      }
    }, [userCtx.isParked, route.params])
  );

  /**
   * Starts the parking session timer.
   * Books the parking spot using API, stores reservation deadline, and starts UI timer.
   */  
  const startTimer = async () => {
    if (!timerRunning && !userCtx.parkingId) {
      try {
        const userId = userCtx.user.id;
        const parkingId = route.params?.parkingId;
        const savetime = route.params?.request_time;

        if (!parkingId || !savetime) {
          Alert.alert("Error", "Missing parking details.");
          return;
        }

        const response = await bookParking(parkingId, userId, savetime);

        if (response && response.success) {
          console.log("Booking successful:", response);
          userCtx.startParking(parkingId);

          const now = new Date();
          if (savetime === "half") now.setMinutes(now.getMinutes() + 30);
          else if (savetime === "hour") now.setMinutes(now.getMinutes() + 60);

          setReservedUntil(now);

          // Start the timer
          startTimeRef.current = Date.now();
          timerRef.current = setInterval(clockDisplay, 1000);
          setTimerRunning(true);
        } else {
          Alert.alert("Error", "Failed to book parking spot. Please try again.");
        }
      } catch (error) {
        console.error("Error booking parking:", error);
        Alert.alert("Error", "An unexpected error occurred.");
      }
    }
  };

  /**
   * Stops the parking session.
   * Cancels the timer and releases the parking spot via API.
   */
  const stopTimer = async () => {
    if (timerRunning) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setTimerRunning(false);
      try {
        const userId = userCtx.user.id;
        const parkingId = userCtx.parkingId;

        const response = await unBookParking(parkingId, userId);
        if (!response || response.error) {
          throw new Error("Failed to stop parking session.");
        }

        userCtx.stopParking();
        Alert.alert("Success", "Parking session ended successfully.", [
          {
            text: "OK",
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'ParkingLotHome' }],
              });
            }
          }
        ]);
        
      } catch (error) {
        console.log("Error stopping parking:", error);
        Alert.alert("Error", "Could not stop parking session.");
      }
    }
  };

  /**
   * Updates the timer display every second.
   * Checks if the reservation time has expired and stops timer if needed.
   */
  const clockDisplay = () => {
    const now = Date.now();
    const elapsedTime = now - startTimeRef.current;
    const totalSeconds = Math.floor(elapsedTime / 1000);
  
    if (!hasExpiredRef.current && reservedUntil && now > reservedUntil.getTime()) {
      hasExpiredRef.current = true;
      Alert.alert(
        "Time's Up",
        "Your reserved parking spot was released because you didn’t arrive on time."
      );
      stopTimer();
    }
  
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
  
    setTimeValue({
      hours: hours < 10 ? `0${hours}` : `${hours}`,
      minutes: minutes < 10 ? `0${minutes}` : `${minutes}`,
      seconds: seconds < 10 ? `0${seconds}` : `${seconds}`,
    });
  };

  /**
   * Cleans up the timer interval on component unmount.
   */

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <CarTimerCircle isRunning={timerRunning} />
        <View style={styles.labelContainer}>
          <Text style={styles.parkingDuration}>Parking Duration</Text>
          <Text style={styles.timer}>
            {timeValue.hours}:{timeValue.minutes}:{timeValue.seconds}
          </Text>
          <Text style={styles.spotNumber}>
            Spot {userCtx?.parkingId || "N/A"}
          </Text>
          {reservedUntil && (
            <Text style={styles.reservedText}>
              Reserved until:{" "}
              {reservedUntil.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          )}
        </View>
        <View style={styles.buttonsContainer}>
          <View style={styles.startStop}>
            <Button
              onPress={startTimer}
              buttonStyle={[ styles.button, { backgroundColor: COLORS.primary600, paddingHorizontal: 40 }, ]} labelStyle={{fontWeight: '500'}} >

              Start
            </Button>
            <Button
              onPress={stopTimer}
              buttonStyle={[ styles.button, { backgroundColor: COLORS.primary600, paddingHorizontal: 40 }, ]} labelStyle={{fontWeight: '500'}} >
              Stop
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray50,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  labelContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  parkingDuration: {
    color: COLORS.gray700,
    fontSize: 18,
    marginBottom: 6,
  },
  timer: {
    color: COLORS.primary500,
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 8,
    letterSpacing: 1.5,
  },
  spotNumber: {
    color: COLORS.gray600,
    fontSize: 18,
    fontWeight: "500",
  },
  reservedText: {
    color: COLORS.primary700,
    fontSize: 16,
    marginTop: 10,
  },
  button: {
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginVertical: 20,
  },
  startStop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonsContainer: {
    minWidth: 300,
  },
});
