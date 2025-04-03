import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons, AntDesign } from "@expo/vector-icons"; 
import { useCallback, useState, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { COLORS } from '../../constants/styles';
import HistoryItem from '../../components/HistoryItem';
import { getUserHistory } from '../../http/parkingData';
import { UserContext } from '../../store/UserContext';

function HistoryParkingScreen ({ navigation }) {
    const [selectedFilterOption, setSelectedFilterOption] = useState('All');
    const userCtx = useContext(UserContext);
    const [parkingLotHistory, setParkingLotHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useFocusEffect(
            useCallback(() => {
                async function getParkingData() {
                    try {
                        setLoading(true);
                        const response = await getUserHistory(userCtx.user.id);
                        if (response.error) {
                            setError(response.error);
                        } else {
                            setParkingLotHistory(response);
                        }
                    } catch (err) {
                        setError("Failed to fetch parking data.");
                    } finally {
                        setLoading(false);
                    }
                }
                getParkingData();
            }, [userCtx.user.id])
        );

    const onOptionPress = (optionName = 'All') => {
        setSelectedFilterOption(prevOption => optionName);
    };

    const historyFilter = useCallback(() => {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        const firstDayOfWeek = new Date();
        firstDayOfWeek.setDate(today.getDate() - today.getDay());

        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        return parkingLotHistory.filter(history => {
            const historyDate = new Date(history.start_date);
            
            if (selectedFilterOption === 'Today') {
                return history.end_date === todayStr;
            }
            else if (selectedFilterOption === 'This Week') {
                return historyDate >= firstDayOfWeek;
            }
            else if (selectedFilterOption === 'This Month') {
                return historyDate >= firstDayOfMonth;
            }
            else {
                return true;
            }
        });
    }, [selectedFilterOption, parkingLotHistory]);

    const filteredHistory = historyFilter();

    return (
        <SafeAreaView style={styles.safeArea}>
            <TouchableOpacity style={styles.header} onPress={navigation.goBack}>
                <Ionicons name="chevron-back" size={24} color={COLORS.primary500} style={styles.backIcon} />
                <Text style={styles.titleText}>{"Parking History"}</Text>
            </TouchableOpacity>
            <View style={styles.subHeader}>
                <View style={styles.filterButton}>
                    <AntDesign name="filter" size={24} color={COLORS.primary500} />
                </View>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    contentContainerStyle={styles.optionsContent}    
                >
                    <TouchableOpacity style={[styles.option, selectedFilterOption === 'All' && styles.selectedOption]} onPress={() => { onOptionPress() }}>
                        <Text style={[styles.optionText, selectedFilterOption === 'All' && styles.selectedOptionText]}>All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.option, selectedFilterOption === 'Today' && styles.selectedOption]} onPress={() => { onOptionPress('Today') }}>
                        <Text style={[styles.optionText, selectedFilterOption === 'Today' && styles.selectedOptionText]}>Today</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.option, selectedFilterOption === 'This Week' && styles.selectedOption]} onPress={() => { onOptionPress('This Week') }}>
                        <Text style={[styles.optionText, selectedFilterOption === 'This Week' && styles.selectedOptionText]}>This Week</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.option, selectedFilterOption === 'This Month' && styles.selectedOption]} onPress={() => { onOptionPress('This Month') }}>
                        <Text style={[styles.optionText, selectedFilterOption === 'This Month' && styles.selectedOptionText]}>This Month</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>    
            { loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary500} style={styles.loader} />
                    <Text style={styles.loadingText}>Loading Parking Spots...</Text>
                </View>
            ) :
            (<View style={styles.historyListContainer}>
                <FlatList 
                    data={filteredHistory}
                    key={(item) => item.license_number.toString()}
                    renderItem={({ item }) => (
                        <HistoryItem 
                            parking_lot={item.parking_lot}
                            start_time={item.start_time}
                            end_time={item.end_time}
                            start_date={item.start_date}
                            end_date={item.end_date}
                            license_number={item.license_number}
                            first_name={item.first_name}
                            last_name={item.last_name}
                            parking={item.parking}
                        /> 
                    )}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        ) }
        </SafeAreaView>
    );
}

export default HistoryParkingScreen;


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.gray100,
    },
    header: {
        position: 'relative',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: COLORS.gray50,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray200
    },
    backIcon: {
        position: 'absolute',
        left: 16
    },
    titleText: {
        fontSize: 18,
        fontWeight: '600' 
    },
    subHeader: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: COLORS.gray50,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray200,
    },
    filterButton: {
        height: 40,
        width: 40,
        backgroundColor: COLORS.primary50,
        borderRadius: 20,
        marginRight: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    optionsContent: {
        flexDirection: "row",
        padding: 8
    },
    option: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        backgroundColor: COLORS.gray100,
        borderRadius: 20,
        marginRight: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    optionText: {
        fontSize: 14,
        color: COLORS.gray700,
        fontWeight: '500'
    },
    selectedOption: {
        backgroundColor: COLORS.primary100,
    },
    selectedOptionText: {
        color: COLORS.primary700
    },
    historyListContainer: {
        flex: 1,
        marginBottom: 16
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.gray50,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: COLORS.primary500,
        fontWeight: "500",
    },
});