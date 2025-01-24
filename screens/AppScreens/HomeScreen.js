import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import Button from '../../components/Button';
import { COLORS } from '../../constants/styles';
import CarTimerCircle from '../../components/CarTimerCircle';

const defaultTimerDisplay = {
    hours: "00",
    minutes: "00",
    seconds: "00"
}

function HomeScreen() {

  const isFocused = useIsFocused();

  const [timeValue, setTimeValue] = useState(defaultTimerDisplay);
  const [timerRunning, setTimerRunning] = useState(false);
  const startTimeRef = useRef(null); 
  const timerRef = useRef(null); 


  useEffect(() => {
    if (!isFocused && !timerRunning) {
      setTimeValue(defaultTimerDisplay);
    }
  }, [isFocused]);

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

  useEffect(() => {
    return () => clearInterval(timerRef.current); 
  }, []);

  return (
      <SafeAreaView style={styles.container}>
          <View style={styles.content}>
              <CarTimerCircle isRunning={timerRunning}/>
              <View style={styles.labelContainer}>
                <Text style={styles.parkingDuration}>Parking Duration</Text>
                <Text style={styles.timer}>{timeValue.hours}:{timeValue.minutes}:{timeValue.seconds}</Text>
                <Text style={styles.spotNumber}>Spot P01</Text>
              </View>
              <Button 
                  onPress={() => { toggleTimer(); }}
                  buttonStyle={[styles.button, { backgroundColor: COLORS.primary300 }]}
              >
                  { timerRunning ? 'Stop' : 'Start' }
              </Button>
              <Button 
                  onPress={() => {console.log('Change button pressed');}}
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
    alignItems: 'center',
    justifyContent: 'center'
  },
  labelContainer: {
    alignItems: 'center',
    marginBottom: 12
  },
  parkingDuration: {
    color: COLORS.gray700,
    fontSize: 18,
    marginBottom: 6,
  },
  timer: {
    color: COLORS.primary500,
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 1.5
  },
  spotNumber: {
    color: COLORS.gray600,
    fontSize: 18,
    fontWeight: '500',
  },
  button: {
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginVertical: 10,
  },
});
