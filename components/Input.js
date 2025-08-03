import { Text, TextInput, View, StyleSheet } from "react-native";
import { COLORS } from "../constants/styles";


/**
 * Reusable input field component for forms, such as login and signup.
 *
 * @param {Object} props
 * @param {string} props.placeholder - Placeholder text shown inside the input
 * @param {string} [props.keyType="default"] - Keyboard type for the input (e.g., "email-address", "numeric")
 * @param {boolean} [props.secureInput=false] - Whether to hide input characters (e.g., for passwords)
 * @param {Function} props.onChangeHandler - Callback called on input text change: (text, name) => void
 * @param {string} props.name - Name identifier for the input field (used in onChangeHandler)
 * @param {string} [props.errorMessage] - Optional error message to display below the input
 * @param {string} props.value - Current value of the input
 * @returns {JSX.Element}
 */


function Input({ placeholder, keyType = "default", secureInput = false, onChangeHandler, name, errorMessage, value }) {
    return (
        <View style={styles.container}>
            <View style={[styles.inputContainer, errorMessage && styles.errorField]}>
                <TextInput 
                    style={styles.textField} 
                    placeholder={placeholder} 
                    placeholderTextColor={COLORS.gray200}
                    keyboardType={keyType} 
                    secureTextEntry={secureInput}
                    onChangeText={(text) => onChangeHandler(text, name)}
                    maxLength={name === 'code' && 6}
                    value={value}
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