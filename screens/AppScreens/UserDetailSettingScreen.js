import { Text, View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons"; 
import { useContext } from "react";

import getShortName, { COLORS, CAR_COLORS, fixReversedHebrew } from "../../constants/styles";
import { UserContext } from "../../store/UserContext";

// המסך בו מוצגים פרטי המשתמש לאדמין כדי שיידע מי חונה בכל חנייה
function UserDetailSettingScreen({ navigation }) {
    const { user } = useContext(UserContext); 

    let shortName = getShortName(user.fname, user.lname);

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.navBar} onPress={() => { navigation.goBack(); }}>
                <Ionicons name="chevron-back" size={24} color={COLORS.primary500} style={styles.backIcon} />
                <Text style={styles.navText}>User Details</Text>
            </TouchableOpacity>
            <ScrollView contentContainerStyle={styles.content}>
                
                <View style={styles.header}>
                    <LinearGradient style={styles.userCircle} colors={[COLORS.primary300, COLORS.primary600]}>
                        <Text style={styles.userCircleText}>{shortName}</Text>
                    </LinearGradient>
                    <Text style={styles.headerText}>{user.fname + " " + user.lname}</Text>
                </View>
            
                <View style={styles.card}>
                    <View style={styles.detailItem}>
                        <View style={styles.detailIconContainer}>
                            <Ionicons name="mail-outline" size={24} color={COLORS.primary700} />
                        </View>
                        <View style={styles.detailTextContainer}>
                            <Text style={styles.label}>Email</Text>
                            <Text style={styles.value}>{user.email}</Text>
                        </View>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.detailItem}>
                        <View style={styles.detailIconContainer}>
                            <Ionicons name="call-outline" size={24} color={COLORS.primary700} />
                        </View>
                        <View style={styles.detailTextContainer}>
                            <Text style={styles.label}>Phone Number</Text>
                            <Text style={styles.value}>{user.phoneNumber}</Text>
                        </View>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.detailItem}>
                        <View style={styles.detailIconContainer}>
                            <Ionicons name="card-outline" size={24} color={COLORS.primary700} />
                        </View>
                        <View style={styles.detailTextContainer}>
                            <Text style={styles.label}>License Number</Text>
                            <Text style={styles.value}>{user.lisenceNumber}</Text>
                        </View>
                    </View>
                    
                </View>
                <View style={styles.footerContainer}>
                    <View style={styles.footerHeaderContainer}>
                        <Ionicons name="car" size={24} color={COLORS.primary700} />
                        <Text style={styles.footerHeaderText}>Vehicle Information</Text>
                    </View>
                        <View style={styles.detailVehicleTextContainer}>
                            <View style={styles.vehicleDetailContainer}>
                                <Text style={styles.label}>Year</Text>
                                <Text style={styles.valueVehicle}>{user.car_year}</Text>
                            </View>
                            <View style={styles.vehicleDetailContainer}>
                                <Text style={styles.label}>Model</Text>
                                <Text style={styles.valueVehicle}>{fixReversedHebrew(user.car_type)}</Text>
                            </View>
                            <View style={styles.vehicleDetailContainer}>
                                <Text style={styles.label}>Color</Text>
                                <View style={styles.colorContainer}>
                                    <View style={[styles.colorSwatch, { backgroundColor: CAR_COLORS[fixReversedHebrew(user.car_color)] || '#FFFFFF'} ]}></View>
                                    <Text style={styles.valueVehicle}>{fixReversedHebrew(user.car_color)}</Text>
                                </View>
                            </View>
                        </View>
                </View>
                <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>Go Back</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

export default UserDetailSettingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.gray50
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        paddingHorizontal: 20,
        paddingVertical: 14,
        backgroundColor: COLORS.gray50,
        borderBottomColor: COLORS.gray100,
        borderBottomWidth: 2
    },
    navText: {
        fontSize: 20,
        fontWeight: '600'
    },
    backIcon: {
        position: 'absolute',
        left: 16
    },
    content: {
        paddingHorizontal: 30,
        paddingBottom: 40,
    },
    header: {
        marginVertical: 20,
        alignItems: "center",
        marginBottom: 20
    },
    userCircle: {
        height: 100,
        width: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        borderWidth: 2,
        borderColor: COLORS.gray200
    },
    userCircleText: {
        fontSize: 32,
        fontWeight: '700',
        color: COLORS.gray50
    },
    headerText: {
        fontSize: 24,
        fontWeight: "bold",
        color: '#000'
    },
    card: {
        paddingHorizontal: 10
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    detailIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary50,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    detailTextContainer: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        color: COLORS.gray600,
        marginBottom: 4,
    },
    value: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.gray900,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.gray200,
        marginVertical: 4,
    },
    footerContainer: {
        marginTop: 20,
    },
    footerHeaderContainer: {
        backgroundColor: COLORS.primary50,
        padding: 18,
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: COLORS.gray100,
        borderBottomWidth: 2,
    },
    footerHeaderText: {
        color: COLORS.primary700,
        fontSize: 20,
        fontWeight: '600',
        marginLeft: 8
    },
    detailVehicleTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20
    },
    valueVehicle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.gray900,
    },
    colorContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    colorSwatch: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 8,
        borderWidth: 1,
        borderColor: COLORS.gray300,
    },
    goBackButton: {
        backgroundColor: COLORS.primary700, 
        borderRadius: 10,
        alignItems: "center",
        paddingVertical: 16,
        marginTop: 20
    },
    buttonText: {
        color: COLORS.gray50,
        fontWeight: '500',
        fontSize: 20
    }
});

