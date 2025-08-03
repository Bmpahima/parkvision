import { useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Linking } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";


import { COLORS } from "../constants/styles";

const { width } = Dimensions.get("window");
const CARD_HEIGHT = 160;
const CARD_WIDTH = width * 0.8;

/**
 * Card component representing a parking lot with basic information,
 * navigation shortcut, and details button.
 *
 * @param {Object} props
 * @param {Object} props.parkingLot - The parking lot data (includes name, address, latitude, longitude)
 * @param {Function} props.onCardPress - Callback when the card or "Details" is pressed
 * @param {number} [props.distance] - Optional distance from user to the parking lot, in kilometers
 * @returns {JSX.Element}
 */

function Card ({ parkingLot, onCardPress, distance }) {

    const wazeNavigator = useCallback(() => {
        const { latitude, longitude } = parkingLot;
        const url = `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`

        Linking.openURL(url).catch(err => console.log('Falied to open Waze: ', err));
    }, []);

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onCardPress(parkingLot)}
        style={styles.card}
      >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{parkingLot.name}</Text>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardIconContainer}>
          <MaterialIcons
            name="local-parking"
            size={24}
            color={COLORS.primary500}
          />
        </View>
        <View style={styles.cardDetails}>
          <View style={styles.cardDetailRow}>
            <Ionicons name="location-outline" size={16} color={COLORS.gray600} />
            <Text style={styles.cardDetailText} numberOfLines={1}>
              {parkingLot.address || "Address not available"}
            </Text>
          </View>

          {distance && (
            <View style={styles.cardDetailRow}>
              <Ionicons name="navigate-outline" size={16} color={COLORS.gray600} />
              <Text style={styles.cardDetailText}>
                {distance.toFixed(2)} km away
              </Text>
            </View>
          )}

        </View>
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity
          style={styles.cardButton}
          onPress={() => onCardPress(parkingLot)}
        >
          <Text style={styles.cardButtonText}>Details</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.cardButton, styles.cardButtonPrimary]}
          onPress={wazeNavigator}
        >
          <Text style={styles.cardButtonTextPrimary}>Waze</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
    )
}

export default Card;

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.gray50,
        borderRadius: 12,
        marginHorizontal: 10,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        overflow: "hidden",
      },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0,0,0,0.05)",
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.gray800,
        flex: 1,
    },
    cardContent: {
        flexDirection: "row",
        padding: 12,
    },
    cardIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(0,0,0,0.05)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    cardDetails: {
        flex: 1,
    },
    cardDetailRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    cardDetailText: {
        fontSize: 13,
        color: COLORS.gray600,
        marginLeft: 6,
        flex: 1,
    },
    cardFooter: {
        flexDirection: "row",
        borderTopWidth: 1,
        borderTopColor: "rgba(0,0,0,0.05)",
        padding: 10,
    },
    cardButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 6,
        marginHorizontal: 4,
        backgroundColor: "#f5f5f5",
    },
    cardButtonPrimary: {
        backgroundColor: COLORS.primary500,
    },
    cardButtonText: {
        fontSize: 14,
        fontWeight: "500",
        color: COLORS.gray600,
    },
    cardButtonTextPrimary: {
        fontSize: 14,
        fontWeight: "500",
        color: COLORS.gray50,
    },
});