import { useState, useContext } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import SettingItem from "../../components/SettingItem";
import getShortName, { COLORS, UI_COLORS } from "../../constants/styles";
import { UserContext } from "../../store/UserContext";
import { deleteAccount } from "../../http/auth";

function SettingsScreen({ navigation }) {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const userCtx = useContext(UserContext);

  const onPressDeleteAccount = async () => {
    const sure = await new Promise((resolve) => {
        Alert.alert(
            "Park Vision",
            "Are you sure you want to delete your account?",
            [
                { text: "Yes", onPress: () => resolve(true) },
                { text: "No", onPress: () => resolve(false) }
            ]
        );
    });
    if (!sure) {
        return;
    }

    try {
        const response = await deleteAccount(userCtx.user.id);
        if (response.success) {
            navigation.navigate("logout", { deleted: true });
        } else {
            Alert.alert("Park Vision", "An error occurred. Unable to delete your account.");
        }
    } catch (error) {
        Alert.alert("Park Vision", "An error occurred. Unable to delete your account.");
    }
  };

  let shortName = getShortName(userCtx.user.fname, userCtx.user.lname);
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.intro}>
        <LinearGradient style={styles.userCircle} colors={[COLORS.primary300, COLORS.primary500]}>
          <Text style={styles.userCircleText}>{shortName}</Text>
        </LinearGradient>
        <Text style={styles.introText}>{userCtx.user.fname + " " + userCtx.user.lname}</Text>
        <Text style={styles.introSubtext}>{userCtx.user.email}</Text>
      </View>
    <View style={styles.sectionsContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <SettingItem icon="person-outline" title="Profile" value={(userCtx.user.fname + " " + userCtx.user.lname)} onPress={() => {navigation.navigate('UserDetailSettingScreen')  }} />
        <SettingItem icon="key-outline" title="Password" value="Change" onPress={() => {}} />
        <SettingItem icon="archive-outline" title="History" value="View" onPress={() => { navigation.navigate('HistoryParkingScreen') }}/> 
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <SettingItem
          icon="notifications-outline"
          title="Notifications"
          value={notifications}
          onPress={() => setNotifications(!notifications)}
          isSwitch
        />
        <SettingItem
          icon="moon-outline"
          title="Dark Mode"
          value={darkMode}
          onPress={() => setDarkMode(!darkMode)}
          isSwitch
        />
        <SettingItem icon="language-outline" title="Language" value="English" onPress={() => {}} />
      </View>
    </View>
    <View style={styles.buttonSection}>
      <TouchableOpacity style={styles.logoutButton} onPress={() => { navigation.navigate('logout') }}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.logoutButton, styles.deleteAcc]} onPress={onPressDeleteAccount}>
        <Text style={styles.logoutButtonText}>Delete Account</Text>
      </TouchableOpacity>
    </View>
     
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray100,
  },
  intro: {
    flex: 1,
    paddingVertical: 20,
    alignItems: 'center'
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
  introText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333'
  },
  introSubtext: {
    fontSize: 16,
    fontWeight: '400',
    color: COLORS.gray500
  },
  section: {
    backgroundColor: COLORS.gray50,
    borderTopWidth: 1,
    borderColor: COLORS.gray200,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.gray700,
    marginLeft: 16,
    marginVertical: 8,
  },
  buttonSection: {
    marginBottom: 60
  },
  logoutButton: {
    marginTop: 14,
    marginHorizontal: 16,
    backgroundColor: COLORS.primary500,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteAcc: {
    backgroundColor: UI_COLORS.red600
  },
  logoutButtonText: {
    color: COLORS.gray50,
    fontSize: 18,
    fontWeight: "600",
  },
});

export default SettingsScreen