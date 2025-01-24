import { StatusBar } from "expo-status-bar";
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView, KeyboardAvoidingView } from "react-native";

import SignupForm from "../../components/SignupForm";

function SignUpScreen () {
    return (
        <SafeAreaView style={{flex: 1}}>
            <StatusBar style='dark' />
            {/* <ScrollView> */}
            {/* <KeyboardAvoidingView behavior='position'> */}
                <View style={styles.container}>
                    {/* <Image source={require('../../images/rb_1841.png')} style={styles.image}/>   */}
                    <Text style={styles.title}>ParkVision</Text>
                    <SignupForm />
                </View>
           {/* </KeyboardAvoidingView> */}
           {/* </ScrollView> */}
        </SafeAreaView>
    );
}

export default SignUpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        textAlign: 'center',
        fontSize: 36,
        fontWeight: 'bold',
        color: "#0253ff",
        marginBottom: 36
    },
    image: {
        width: 180,
        height: 180,
        alignSelf: 'center'
    }
});