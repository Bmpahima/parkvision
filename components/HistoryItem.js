import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons"; 

import { COLORS } from '../constants/styles';
import { useState } from 'react';


const DUMMY = {
    parking_lot: "Central Parking Lot",
    start_time: "08:30",
    end_time: "10:15",
    start_date: "2024-03-02",
    end_date: "2024-03-02",
    license_number: "123-456-789",
    first_name: "David",
    last_name: "Cohen"
};

/**
 * Component representing a single history item showing
 * parking session details for a specific user.
 *
 * @param {Object} props
 * @param {string} [props.parking_lot="Central Parking Lot"] - Name of the parking lot
 * @param {string} [props.start_time="08:30"] - Start time of the parking session
 * @param {string} [props.end_time="10:15"] - End time of the parking session
 * @param {string} [props.start_date="2024-03-02"] - Date the session started
 * @param {string} [props.end_date="2024-03-02"] - Date the session ended
 * @param {string} [props.license_number="123-456-789"] - License plate number of the vehicle
 * @param {string} [props.first_name="David"] - First name of the driver
 * @param {string} [props.last_name="Cohen"] - Last name of the driver
 * @param {string} [props.parking] - Optional specific parking space within the lot
 * @returns {JSX.Element}
 */

function HistoryItem ({ parking_lot="Central Parking Lot",
                        start_time="08:30",
                        end_time="10:15",
                        start_date="2024-03-02",
                        end_date="2024-03-02",
                        license_number="123-456-789",
                        first_name="David",
                        last_name="Cohen",
                        parking
                    }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.userDetail}>
                    <Text style={styles.userName}>{first_name + " " + last_name}</Text>
                    <Text style={styles.license}>{license_number}</Text>
                </View>
                <View>
                    <TouchableOpacity style={styles.expandButton}>
                        <Ionicons name="chevron-forward" size={24} color={COLORS.primary500} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.loc}>
                <SimpleLineIcons name="location-pin" size={24} color={COLORS.primary700} />
                <Text style={styles.parkLoc}>{parking ? `${parking_lot} | ${parking}`: parking_lot }</Text>
            </View>
            <View style={styles.dates}>
                <View style={styles.dateSection}>
                    <Ionicons name="calendar-clear-outline" size={20} color={COLORS.gray700} />
                    <Text style={styles.dateText}>{start_date}</Text>
                </View>
                <View style={styles.dateSection}>
                    <Ionicons name="time-outline" size={20} color={COLORS.gray700} />
                    <Text style={styles.dateText}>{start_time + " - " + end_time}</Text>
                </View>
            </View>
        </View>
    );
}

export default HistoryItem;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        marginHorizontal: 16,
        marginTop: 16,
        backgroundColor: COLORS.gray50,
        borderRadius: 16,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary400,
        overflow: 'hidden'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 18
    },
    userDetail: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 4
    },
    userName: {
        color: '#000',
        fontSize: 18,
        fontWeight: '600'
    },
    license: {
        color: COLORS.gray600,
        fontSize: 16,
    },
    expandButton: {
        height: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loc: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18
    },
    parkLoc: {
        fontSize: 18,
        fontWeight: '500',
        color: COLORS.primary700,
        marginLeft: 4
    },
    dates: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    dateSection: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    dateText: {
        fontSize: 16,
        fontWeight: '400',
        color: COLORS.gray700,
        marginLeft: 4
    }
});