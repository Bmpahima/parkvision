import { StatusBar } from "expo-status-bar";
import { View, Text, StyleSheet, Image } from "react-native";

import Button from "../../components/Button";
import { COLORS } from "../../constants/styles";

function WelcomeScreen ({ navigation }) {

    return ( 
        <>
            <StatusBar style="light" />
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Image source={require('../../images/rb_1841.png')} style={styles.image}/>
                    <Text style={[styles.title, {fontSize: 24, fontWeight: 'mediums'}]}>Welcome to </Text>
                    <Text style={styles.title}>ParkVision</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <Button 
                        onPress={() => {console.log('You chose to sign up!'); navigation.navigate('signup');}}
                        buttonStyle={{backgroundColor: COLORS.gray50}}
                        labelStyle={{color: COLORS.primary500}}
                    >
                        Get Started
                    </Button>
                </View>
            </View>
        </>
    );    
}

export default WelcomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: COLORS.primary600
    },
    titleContainer: {
        marginVertical: 24
    },
    title: {
        textAlign: 'center',
        fontSize: 48,
        fontWeight: 'bold',
        color: COLORS.gray50,
    },
    buttonContainer: {
        paddingHorizontal: 24
    },
    image: {
        width: 320,
        height: 320,
        alignSelf: 'center'
    }
});