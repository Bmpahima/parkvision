import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useContext } from 'react';
import { StatusBar, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';

import LoginScreen from './screens/AuthenticationScreens/LoginScreen';
import WelcomeScreen from './screens/AuthenticationScreens/WelcomeScreen';
import SignUpScreen from './screens/AuthenticationScreens/SignUpScreen';
import HomeScreen from './screens/AppScreens/HomeScreen';
import LogoutScreen from './screens/AuthenticationScreens/LogoutScreen';
import ParkingLotScreen from './screens/AppScreens/ParkingLotsScreen';
import ParkingLotDetailScreen from './screens/AppScreens/ParkingLotDetailScreen';
import UserContextProvider, { UserContext } from './store/UserContext';
import BookSpotScreen from './screens/AppScreens/BookSpotScreen';
import { COLORS } from './constants/styles';
import SettingsScreen from './screens/AppScreens/SettingsScreen';
import ParkingManage from './screens/AdminScreens/ParkingManage';
import ParkingLotManage from './screens/AdminScreens/ParkingLotManage';
import ParkingUserManager from './screens/AdminScreens/ParkingUserManager'


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();


const UserLoginScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="signup"
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="drawer"
        component={HomeAppScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const ParkingLotStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ParkingLot"
        component={ParkingLotScreen}
        options={({ navigation }) => ({
          drawerLabel: 'Find Parking',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.toggleDrawer()} 
              style={{ marginLeft: 10 }}
            >
              <Icon name="menu" size={25} color="#007AFF" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name='parkingLotDetail'
        component={ParkingLotDetailScreen}
        options={{
          drawerLabel: 'Find Parking',
        }}
      /> 
      <Stack.Screen 
        name='bookingParkingSpot'
        component={BookSpotScreen}
        options={{
          title: 'Book a Spot',
          headerBackButtonDisplayMode: 'minimal'
        }}
      />
    </Stack.Navigator>
  );
}

const AdminStack = () => {
  return ( 
    <Stack.Navigator>
      <Stack.Screen 
        name='AdminHomePage' 
        component={ParkingManage} 
        options={{
          headerShown: false
        }}
        />
      <Stack.Screen 
        name='ParkingManage' 
        component={ParkingLotManage} 
        options={{
          headerShown: false
        }}
        />
      <Stack.Screen 
        name='ParkingUserManager'
        component={ParkingUserManager} 
        options={{
          headerShown: false
        }}   
      />
    </Stack.Navigator>
  );
}

const HomeAppScreen = () => {
  const userCtx = useContext(UserContext);

  return (
    <Drawer.Navigator>
      <Drawer.Screen 
        name='ParkingLotHome'
        component={ParkingLotStack}
        options={{
          drawerLabel: 'Find Parking',
          headerShown: false,
          drawerIcon: ({size, color}) => <Feather name="search" size={size} color={color} />

        }}
      />
      <Drawer.Screen 
        name="home" 
        component={HomeScreen}
        options={() => ({
          headerTransparent: true,
          drawerLabel: 'Timer',
          title: 'Parking Timer',
          headerTitleStyle: {
            color: COLORS.primary300
          },
          drawerIcon: ({size, color}) => <Ionicons name="timer-outline" size={size} color={color} />
        })}
      />
      {/* <Drawer.Screen 
        name='Settings'
        component={SettingsScreen}
        options={{
          drawerIcon: ({size, color}) => <Feather name="settings" size={size} color={color} />
        }}
      /> */}
      { userCtx.isAdmin && 
        <Drawer.Screen 
          name='Admin'
          component={AdminStack}
          options={{
            drawerIcon: ({size, color}) => <AntDesign name="user" size={size} color={color} />,
            headerStyle: {backgroundColor: COLORS.primary800},
            headerTitleStyle: {color: COLORS.gray50},
            headerTintColor: COLORS.gray50
          }}
        />
      }
      <Drawer.Screen 
        name='logout' 
        component={LogoutScreen} 
        options={{
          drawerLabel: 'Logout', 
          drawerIcon: ({size, color}) => <Feather name="log-in" size={size} color={color} />
        }}
      />
    </Drawer.Navigator>
  );
};


function RootNavigation() {
  const userCtx = useContext(UserContext);

  return (
    <NavigationContainer>
      {userCtx.isAuthenticated ? <HomeAppScreen /> : <UserLoginScreen />}
    </NavigationContainer>
  );
}


export default function App() {
  return (
    <UserContextProvider>
      <RootNavigation />
    </UserContextProvider>
  );
}
