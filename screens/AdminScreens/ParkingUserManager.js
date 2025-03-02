import { Text, View, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { COLORS } from "../../constants/styles";
import Button from "../../components/Button";

// המסך בו מוצגים פרטי המשתמש לאדמין כדי שיידע מי חונה בכל חנייה
function ParkingUserManager({ route, navigation }) {
    const { user } = route.params; 

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>User Details</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.label}>Full Name:</Text>
                    <Text style={styles.value}>{user.first_name} {user.last_name}</Text>

                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.value}>{user.email}</Text>

                    <Text style={styles.label}>Phone Number:</Text>
                    <Text style={styles.value}>{user.phone_number}</Text>

                    <Text style={styles.label}>License Number:</Text>
                    <Text style={styles.value}>{user.license_number}</Text>

                    <Text style={styles.label}>Car Details:</Text>
                    <Text style={styles.value}>
                        {user.car_year} {user.car_model} ({user.car_color})
                    </Text>
                </View>
                
                <Button buttonStyle={styles.goBackButton} onPress={() => navigation.goBack()}>
                    Go Back
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
}

export default ParkingUserManager;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary50, 
    },
    header: {
        paddingVertical: 10,
        marginTop: 20,
        alignItems: "center",
    },
    headerText: {
        fontSize: 24,
        fontWeight: "bold",
        color: '#000'
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
        alignItems: "center",
    },
    card: {
        width: "100%",
        backgroundColor: COLORS.gray50,
        padding: 20,
        borderRadius: 12,
        shadowColor: COLORS.gray900, 
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 4,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.gray700,
        marginTop: 10,
    },
    value: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.primary900, 
    },
    goBackButton: {
        backgroundColor: COLORS.primary700, 
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 20,
        alignItems: "center",
    },
});