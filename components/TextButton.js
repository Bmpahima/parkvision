import { Text, Pressable, StyleSheet } from "react-native";

/**
 * TextButton component - a minimal pressable text-based button.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button label or content
 * @param {Function} props.onPress - Callback triggered when the button is pressed
 * @returns {JSX.Element}
 */

function TextButton({ children, onPress }) {
    return (
        <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.isPressed]}>
            <Text style={styles.labelText}>{children}</Text>
        </Pressable>
    );
}

export default TextButton;

const styles = StyleSheet.create({
    isPressed: {
        opacity: 0.75,
    },
    labelText: {
        fontSize: 16,
        color: '#0253ff',
        textDecorationLine: 'underline',
        margin: 4
    },
});
