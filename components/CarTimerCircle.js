import { View, Image, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';

import { COLORS } from '../constants/styles';

/**
 * Circular animated timer component with a rotating border
 * and an image of a car in the center.
 *
 * @param {Object} props
 * @param {boolean} props.isRunning - Determines whether the rotation animation is active
 * @returns {JSX.Element}
 */


function CarTimerCircle ({ isRunning }) {
    const shadowSharedValue = useSharedValue(0);
    const animatedStyle = useAnimatedStyle(() => {
    return {
        shadowRadius: shadowSharedValue.value,
    };
    });

    const rotateSharedValue = useSharedValue(0);
    const rotateAnimatedStyle = useAnimatedStyle(() => {
    return {
        transform: [{rotate: `${rotateSharedValue.value}deg`}],
    };
    });
    
    useEffect(() => {
        shadowSharedValue.value = withRepeat(
            withTiming(15, { duration: 1000 }),
            -1,
            true
        );
    }, []);

    useEffect(() => {
        rotateSharedValue.value = withRepeat(
            withTiming(rotateSharedValue.value + 360, { duration: 20000, easing: Easing.linear  }),
            -1,
            false
        );
    }, []);

    return (
        <View style={styles.timerContainer}>
            <Animated.View style={[styles.timerCircleOuter, animatedStyle]}>
                {isRunning && 
                    (<Animated.View style={[styles.timerIndicator, rotateAnimatedStyle]}>
                    </Animated.View>)
                }
                <View style={styles.timerCircleInner}>
                        <Image source={require('../images/timer-car.png')} style={styles.image}/>
                </View>
            </Animated.View>
        </View>
    );
}

export default CarTimerCircle;

const styles = StyleSheet.create({
    timerContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    timerCircleOuter: {
        position: 'relative',
        width: 260,
        height: 260,
        borderRadius: '50%',
        borderWidth: 6,
        borderColor: COLORS.primary300,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.primary50,
        shadowColor: COLORS.primary300,
        shadowRadius: 10,
        shadowOpacity: 0.6,
        shadowOffset: { width: 0, height: 0 },
        
    },
    timerIndicator: {
        position: 'absolute',
        width: 260,
        height: 260,
        borderRadius: '50%',
        borderWidth: 6,
        borderColor: COLORS.primary300,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderTopColor: COLORS.gray100,
        borderBottomColor: COLORS.gray100
    },
    timerCircleInner: {
        width: 220,
        height: 220,
        borderRadius: 110, 
        overflow: 'hidden', 
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.primary100,
    },
    image: {
        height: '85%',
        width: '85%',
        resizeMode: 'contain',
    },
});