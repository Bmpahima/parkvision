import { View, Text, StyleSheet, Image, SafeAreaView, ScrollView, StatusBar, Platform, KeyboardAvoidingView } from "react-native";

import LoginForm from "../../components/LoginForm";
import { COLORS } from "../../constants/styles";

/**
 * @component LoginScreen
 *
 * This screen displays the login page for users to sign into their account.
 * It includes:
 * - A logo and introductory text
 * - The <LoginForm /> component which handles login logic and validation
 * - Keyboard avoiding behavior for iOS/Android
 *
 * @returns {JSX.Element} Rendered Login screen
 */

function LoginScreen () {
 
    return (
        <>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
            <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidingView}
                >
                <ScrollView 
                    contentContainerStyle={styles.container}
                    showsVerticalScrollIndicator={false}
                    >
                    <View style={styles.header}>
                        <Image source={require('../../images/rb_1841.png')} style={styles.image}/> 
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.titleText}>ParkVision</Text>
                            <Text style={styles.subtitleText}>Sign in to your account</Text>
                        </View> 
                    </View>
                    <LoginForm />
                </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    );
}

export default LoginScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.gray100,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        paddingTop: 40,
        paddingBottom: 40,
    },
    headerTextContainer: {
        alignItems: 'center',
        marginBottom: 40
    },
    titleText: {
        fontSize: 36,
        fontWeight: 'bold',
        letterSpacing: 1,
        color: COLORS.primary700,
        marginBottom: 10
    },
    subtitleText: {
        fontSize: 16,
        color: COLORS.gray700,
    },
    image: {
        width: 160,
        height: 160,
        alignSelf: 'center',
        marginBottom: 16
    }
});