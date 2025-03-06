import { Text, Pressable, StyleSheet } from "react-native";

import { COLORS } from "../constants/styles";

// רכיב של כפתור
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
