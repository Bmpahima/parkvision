import { View, Text, StyleSheet, Image } from "react-native";

import LoginForm from "../../components/LoginForm";
import { COLORS } from "../../constants/styles";

function LoginScreen () {
 
    return (
        <>
            <View style={styles.container}>
                {/* <Image source={require('../../images/rb_1841.png')} style={styles.image}/>   */}
                <Text style={styles.title}>ParkVision</Text>
                <LoginForm />
            </View>
        </>
    );
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        textAlign: 'center',
        fontSize: 36,
        fontWeight: 'bold',
        color: COLORS.primary500,
        marginBottom: 80
    },
    image: {
        width: 180,
        height: 180,
        alignSelf: 'center'
    }
});