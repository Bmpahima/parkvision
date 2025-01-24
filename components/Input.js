import { Text, TextInput, View, StyleSheet } from "react-native";
import { COLORS } from "../constants/styles";

function Input({ placeholder, keyType = "default", secureInput = false, onChangeHandler, name, errorMessage }) {
    return (
        <View style={styles.container}>
            <View style={[styles.inputContainer, errorMessage && styles.errorField]}>
                <TextInput 
                    style={styles.textField} 
                    placeholder={placeholder} 
                    keyboardType={keyType} 
                    secureTextEntry={secureInput}
                    onChangeText={(text) => onChangeHandler(text, name)}
                />
            </View>
            {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
        </View>
    );
}

export default Input;

const styles = StyleSheet.create({
    container: {
        alignItems: 'stretch',
        marginHorizontal: 24,
        marginBottom: 20
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderColor: COLORS.gray200,
        marginBottom: 0,
        width: '100%'
    },
    textField: {
        padding: 8,
        fontSize: 20,
        flex: 1
    },
    errorField: {
        borderBottomColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
    },
});