import { useEffect, useRef, useState, useContext } from "react";
import { View, Text, StyleSheet, SafeAreaView, Alert } from "react-native";
import { useIsFocused } from "@react-navigation/native";

import Button from "../../components/Button";
import { COLORS } from "../../constants/styles";
import CarTimerCircle from "../../components/CarTimerCircle";
import { bookParking } from "../../http/parkingData";
import { UserContext } from "../../store/UserContext";

const defaultTimerDisplay = {
  hours: "00",
  minutes: "00",
  seconds: "00",
};

function HomeScreen({ navigation, route }) {
  const isFocused = useIsFocused();
  const userCtx = useContext(UserContext);

  const [timeValue, setTimeValue] = useState(defaultTimerDisplay);
  const [timerRunning, setTimerRunning] = useState(false);
  const [reservedUntil, setReservedUntil] = useState(null); 
  const [isParkingConfirmed, setIsParkingConfirmed] = useState(false); 
  const startTimeRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isFocused && !timerRunning) {
      setTimeValue(defaultTimerDisplay);
    }
    console.log("Route params:", route.params);
  }, [isFocused]);

  useEffect(() => {
    async function startBookParking() {
      try {
        if (route && route.params) {
          const userId = userCtx.user.id;
          const parkingId = route.params.parkingId;
          const savetime = route.params.request_time;

          if (userCtx.isParked) {
            Alert.alert("Error", "You already have an active parking session.");
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
          } else {
            Alert.alert("Error", "Failed to book parking spot. Please try again.");
          }
        }
      } catch (error) {
        console.error("Error booking parking:", error);
        Alert.alert("Error", "An unexpected error occurred.");
      }
    }

    startBookParking(); 
  }, [route, userCtx]);

  function clockDisplay() {
    const now = Date.now();
    const elapsedTime = now - startTimeRef.current;
    const totalSeconds = Math.floor(elapsedTime / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    setTimeValue({
      hours: hours < 10 ? `0${hours}` : `${hours}`,
      minutes: minutes < 10 ? `0${minutes}` : `${minutes}`,
      seconds: seconds < 10 ? `0${seconds}` : `${seconds}`,
    });
  }

  const toggleTimer = () => {
    if (timerRunning) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setTimerRunning(false);
    } else {
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(clockDisplay, 1000);
      setTimerRunning(true);
    }
  };

  const confirmParking = () => {
    setIsParkingConfirmed(true);
    Alert.alert("Parking Confirmed", "You have started your parking session.");
  };

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
            Spot {route.params ? route.params.parkingId : "N/A"}
          </Text>
          {reservedUntil && (
            <Text style={styles.reservedText}>
              Reserved until:{" "}
              {reservedUntil.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Text>
          )}
        </View>

        {!isParkingConfirmed ? (
          <Button
            onPress={confirmParking}
            buttonStyle={[styles.button, { backgroundColor: COLORS.primary500 }]}
          >
            Confirm Parking
          </Button>
        ) : (
          <Button
            onPress={toggleTimer}
            buttonStyle={[styles.button, { backgroundColor: COLORS.primary300 }]}
          >
            {timerRunning ? "Stop Timer" : "Start Timer"}
          </Button>
        )}

        <Button
          onPress={() => {
            console.log("Change button pressed");
          }}
          buttonStyle={[styles.button, { backgroundColor: COLORS.primary200 }]}
        >
          Change
        </Button>
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
    marginVertical: 10,
  },
});
