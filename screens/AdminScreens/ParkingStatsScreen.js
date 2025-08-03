import { Text, View, TouchableOpacity, StatusBar, SafeAreaView, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useState, useEffect, useContext } from "react";
import { Feather } from "@expo/vector-icons"; 


import { COLORS } from "../../constants/styles";
import { getParkingStats } from "../../http/parkingData";
import { UserContext } from '../../store/UserContext';

/**
 * ParkingStatsScreen
 * 
 * Screen for admins to choose a time range and request PDF statistics of parking usage.
 * Options include: current month, last month, two months ago, or the entire year.
 * Sends PDF stats to the user's email after selection.
 * 
 * @component
 * @param {object} props
 * @param {object} props.navigation - Navigation object for screen transitions.
 * @param {object} props.route - Route object, used to extract `parkinglot` parameter.
 */

function ParkingStatsScreen({ navigation, route }) {
    const userCtx = useContext(UserContext);
    const [formData, setFormData] = useState({
        month: new Date().getMonth() + 1, 
        year: new Date().getFullYear(),
        parkinglot: route?.params?.parkinglot || 0,
    });
    const [selectedOption, setSelectedOption] = useState("yearly");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formttedDates, setFormattedDates] = useState({
        now: "",
        last: "",
        twolast: "",
        all: ""
    });

    useEffect(() => {
        const today = getMonthYearOffset(0);
        const lastMonth = getMonthYearOffset(1);
        const last2Month = getMonthYearOffset(2);

        setFormattedDates({
            now: `${getMonthName(today.month)}, ${today.year}`,
            last: `0${today.startDay}-${today.endDay} ${getMonthName(lastMonth.month)}, ${lastMonth.year}`,
            twolast: `0${today.startDay}-${today.endDay} ${getMonthName(last2Month.month)}, ${last2Month.year}`,
            all: `All Months, ${today.year}`
        });
    }, [])

    /**
     * getMonthYearOffset
     * 
     * Utility function to calculate the month and year of a previous month by offset.
     * Also returns the start and end day numbers of that month.
     * 
     * @param {number} offset - How many months back to offset (e.g., 0 = current, 1 = last).
     * @returns {{month: number, year: number, startDay: number, endDay: number}}
     */

    const getMonthYearOffset = (offset = 0) => {
        const date = new Date();
        date.setMonth(date.getMonth() - offset);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        return {
            month,
            year,
            startDay: new Date(year, month, 1).getDate(),
            endDay: new Date(year, month + 1, 0).getDate()
        };
    };

    /**
     * setOption
     * 
     * Sets the selected option and updates the formData accordingly.
     * 
     * @param {'now' | 'last' | '2last' | 'yearly'} mode - The time range option selected by the user.
     */

    const setOption = (mode = 'yearly') => {
        switch (mode) {
            case 'now': {
                const { month, year } = getMonthYearOffset(0);
                setFormData(prev => ({ ...prev, month, year }));
                setSelectedOption(mode);
                break;
            }
            case 'last': {
                const { month, year } = getMonthYearOffset(1);
                setFormData(prev => ({ ...prev, month, year }));
                setSelectedOption(mode);
                break;
            }
            case '2last': {
                const { month, year } = getMonthYearOffset(2);
                setFormData(prev => ({ ...prev, month, year }));
                setSelectedOption(mode);
                break;
            }
            case 'yearly': {
                const year = new Date().getFullYear();
                setFormData(prev => ({ ...prev, month: 0, year }));
                setSelectedOption(mode);
                break;
            }
            default:
                setSelectedOption(mode);
                break;
        }
    };

    /**
     * onSendPress
     * 
     * Handles the action of sending the PDF report to the admin's email.
     * Shows a loading spinner while sending, and error or success alert upon completion.
     */

    const onSendPress = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getParkingStats(userCtx.user.id, formData);
            if (response.error) {
                setError(response.error);
            } else if (response?.noData) {
                setError("No data available for the given parking lot.");
            }
            else {
                Alert.alert("ParkVision", "Parking statistics have been sent to your email.");
            }
        } catch (err) {
            setError("Failed to fetch parking stats.");
        } finally {
            setLoading(false);
        }
    };
    /**
     * getMonthName
     * 
     * Utility function to convert a month number (1-12) into a month name string.
     * 
     * @param {number} month_number - Number of the month (1-12).
     * @returns {string} - Full English name of the month.
     */

    const getMonthName = (month_number) => {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return months[month_number - 1];
    }

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.optionContainer}>
                    <View style={styles.titleContainer}>
                        <Feather name="calendar" size={20} color={COLORS.primary700} />
                        <Text style={styles.title}>Choose a Time Range</Text>
                    </View>
                    <TouchableOpacity style={[styles.option, selectedOption === 'now' && styles.selected]} onPress={() => setOption('now')}>
                        <Feather name="clock" size={20} color={selectedOption === 'now' ? COLORS.primary700 : COLORS.gray500} />
                        <View style={styles.optionTextContainer}>
                            <Text style={styles.mainTimeText}>Current Month</Text>
                            <Text style={styles.timeSubText}>{formttedDates.now}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.option, selectedOption === 'last' && styles.selected]} onPress={() => setOption('last')}>
                        <Feather name="clock" size={20} color={selectedOption === 'last' ? COLORS.primary700 : COLORS.gray500} />
                        <View style={styles.optionTextContainer}>
                            <Text style={styles.mainTimeText}>Last Month</Text>
                            <Text style={styles.timeSubText}>{formttedDates.last}</Text>
                        </View>    
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.option, selectedOption === '2last' && styles.selected]} onPress={() => setOption('2last')}>
                        <Feather name="clock" size={20} color={selectedOption === '2last' ? COLORS.primary700 : COLORS.gray500} />
                        <View style={styles.optionTextContainer}>
                            <Text style={styles.mainTimeText}>Two Months Ago</Text>
                            <Text style={styles.timeSubText}>{formttedDates.twolast}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.option, selectedOption === 'yearly' && styles.selected]} onPress={() => setOption('yearly')}>
                        <Feather name="clock" size={20} color={selectedOption === 'yearly' ? COLORS.primary700 : COLORS.gray500} />
                        <View style={styles.optionTextContainer}>
                            <Text style={styles.mainTimeText}>This Year</Text>
                            <Text style={styles.timeSubText}>{formttedDates.all}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            <TouchableOpacity style={styles.sendButton} onPress={onSendPress} disabled={loading}>
                <Text style={styles.sendText}>Send PDF to Mail</Text>
            </TouchableOpacity>

            {loading && <ActivityIndicator size="small" color={COLORS.primary500} style={{marginTop: 20}} />}
            {error && <Text style={styles.errorText}>{error}</Text>}
                
            </View>
            </SafeAreaView>
        </>
    );
}

export default ParkingStatsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.gray100,
    },
    content: {
        padding: 20,
    },
    optionContainer: {
        padding: 20,
        backgroundColor: COLORS.gray50,
        borderRadius: 14,
        shadowColor: COLORS.gray900,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    titleContainer: {
        flexDirection: 'row',
        paddingBottom: 10
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
        color: COLORS.primary700,
        marginLeft: 10
    },
    option: {
        padding: 12,
        marginBottom: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.gray200,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    optionTextContainer: {
        marginLeft: 16, 
        gap: 5
    },
    mainTimeText: {
        fontWeight: '700',
        fontSize: 16,
        color: COLORS.gray800
    },
    timeSubText: {
        color: COLORS.gray600
    },
    selected: {
        backgroundColor: COLORS.primary50,
        borderColor: COLORS.primary500,
    },
    sendButton: {
        padding: 14,
        backgroundColor: COLORS.primary500,
        borderRadius: 12,
        marginTop: 20,
        alignItems: 'center',
        shadowColor: COLORS.gray900,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    sendText: {
        color: COLORS.gray50,
        fontWeight: "bold",
        fontSize: 16
    },
    errorText: {
        marginTop: 14,
        color: "red",
    },
});
