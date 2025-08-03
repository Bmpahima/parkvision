import { Text, Pressable, StyleSheet } from "react-native";

import { COLORS } from "../constants/styles";

/**
 * Custom reusable button component for React Native apps.
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Text or elements to display inside the button
 * @param {Function} props.onPress - Callback function to handle button press
 * @param {Object} [props.buttonStyle] - Optional custom styles for the button container
 * @param {Object} [props.labelStyle] - Optional custom styles for the button label text
 *
 * @example
 * <Button onPress={() => console.log('Pressed!')}>
 *   Click Me
 * </Button>
 */

function Button({ children, onPress, buttonStyle, labelStyle }) {
    return (
        <Pressable onPress={onPress} style={({ pressed }) => [styles.buttonContainer, pressed && styles.isPressed, buttonStyle]}>
            <Text style={[styles.labelText, labelStyle]}>{children}</Text>
        </Pressable>
    );
}

export default Button;

const styles = StyleSheet.create({
    buttonContainer: {
        margin: 12,
        paddingVertical: 12,
        backgroundColor: COLORS.primary500,
        borderRadius: 10,
        alignItems: 'center',
        alignSelf: 'strech',
    },
    isPressed: {
        opacity: 0.75,
    },
    labelText: {
        fontSize: 20,
        color: COLORS.gray50,
    },
});
