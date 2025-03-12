import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Dimensions, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, withDelay } from "react-native-reanimated";
import { use, useEffect } from "react";

import { COLORS } from "../../constants/styles";

const { width, height } = Dimensions.get("window");

function WelcomeScreen ({ navigation }) {

    const imageOpacityValue = useSharedValue(0);
    const animatedOpacityStyle = useAnimatedStyle(() => ({
        opacity: imageOpacityValue.value
    }));

    const titleOpacityValue = useSharedValue(0);
    const animatedTitleOpacityStyle = useAnimatedStyle(() => ({
        opacity: titleOpacityValue.value
    }));

    const footerOpacityValue = useSharedValue(0);
    const footerTranslateY = useSharedValue(50);
    const animatedFooterStyle = useAnimatedStyle(() => ({
        opacity: footerOpacityValue.value,
        transform: [{translateY: footerTranslateY.value}]
    }));

    useEffect(() => {
        imageOpacityValue.value = withTiming(1, { duration: 1000 });
        titleOpacityValue.value = withDelay(300, withTiming(1, { duration: 800 }));
        footerOpacityValue.value = withDelay(600, withTiming(1, { duration: 800 }));
        footerTranslateY.value = withDelay(600, withSpring(0, { damping: 12 }));
    }, [])
    

    return ( 
        <>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            <LinearGradient 
                colors={[ COLORS.primary300, COLORS.primary500]} 
                style={{flex: 1}}
                start={{ x: 2, y: 1 }}  
                end={{ x: 1, y: 0 }}
                >
            <SafeAreaView style={styles.container}>
                <View style={styles.titleContainer}>
                    <Animated.Image source={require('../../images/rb_1841.png')} style={[styles.image, animatedOpacityStyle]}/>
                    <Animated.View style={[styles.titleTextContainer, animatedTitleOpacityStyle]}>
                        <Text style={styles.welcomeText}>Welcome to </Text>
                        <Text style={styles.title}>ParkVision</Text>
                        <Text style={styles.subTitle}>The future of parking is here</Text>
                    </Animated.View>
                </View>
                <Animated.View style={[styles.footerContainer, animatedFooterStyle]}>
                    <TouchableOpacity 
                        style={styles.getStartedButton}
                        onPress={() => {console.log('You chose to sign up!'); navigation.navigate('signup');}} >
                            <Text style={styles.buttonText}>Get Started</Text>
                    </TouchableOpacity>
                    <View style={styles.registerContainer}>
                        <Text style={styles.registerText}>
                            Already have an account?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => { navigation.navigate("login"); }}>
                            <Text style={styles.signUpText}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </SafeAreaView>
            </LinearGradient>
        </>
    );    
}

export default WelcomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    titleContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: 0.7 * width,
        height: 0.7 * width,
        marginBottom: 30
    },
    titleTextContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
        marginBottom: 60
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: '500',
        color: COLORS.gray50,
    },
    title: {
        fontSize: 48,
        fontWeight: '700',
        color: COLORS.gray50,
        letterSpacing: 1,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 10,
    },
    subTitle: {
        color: COLORS.gray100,
        fontSize: 18,
        textAlign: "center",
    },
    footerContainer: {
        paddingHorizontal: 24
    },
    getStartedButton: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        marginHorizontal: 20,
        backgroundColor: COLORS.gray50,
        borderRadius: 32
    },
    buttonText: {
        color: COLORS.primary700,
        fontSize: 20,
        fontWeight: '700'
    },
    registerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 40
    },
    registerText: {
        color: COLORS.gray100,
        fontSize: 16,
        textAlign: "center",
    },
    signUpText: {
        color: COLORS.gray50,
        fontWeight: '600',
        marginLeft: 4,
        fontSize: 16
    }
});