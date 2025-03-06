import { Text, Pressable, StyleSheet } from "react-native";

// רכיב של כפתור טקסט פשוט
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
