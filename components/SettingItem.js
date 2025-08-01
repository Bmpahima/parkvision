import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons"

import { COLORS } from '../constants/styles';

function SettingItem({ icon, title, value, onPress, isSwitch = false }) {
  return (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} >
      <View style={styles.settingItemLeft}>
        <Ionicons name={icon} size={24} color={COLORS.primary500} style={styles.icon} />
        <Text style={styles.settingItemTitle}>{title}</Text>
      </View>
      {isSwitch ? (
        <Switch
          value={value}
          onValueChange={onPress}
          trackColor={{ false: COLORS.gray300, true: COLORS.primary300 }}
          thumbColor={value ? COLORS.primary500 : COLORS.gray100}
        />
      ) : (
        <View style={styles.settingItemRight}>
          <Text style={styles.settingItemValue}>{value}</Text>
          <Ionicons name="chevron-forward" size={24} color={COLORS.gray500} />
        </View>
      )}
    </TouchableOpacity>
  )
}

export default SettingItem;

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  settingItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 12,
  },
  settingItemTitle: {
    fontSize: 16,
    color: COLORS.gray800,
  },
  settingItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingItemValue: {
    fontSize: 16,
    color: COLORS.gray500,
    marginRight: 8,
  },
  logoutButton: {
    marginTop: 24,
    marginBottom: 40,
    marginHorizontal: 16,
    backgroundColor: COLORS.primary500,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutButtonText: {
    color: COLORS.gray50,
    fontSize: 18,
    fontWeight: "600",
  },
})


