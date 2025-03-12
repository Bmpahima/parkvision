import { useContext, useEffect } from "react";
import { logout } from "../../http/auth";

import { UserContext } from "../../store/UserContext";
import { Alert } from "react-native";

function LogoutScreen({ navigation, route }) {
    const userCtx = useContext(UserContext);

    useEffect(() => {
        const userId = userCtx.user.id

        async function userLogout () {
            try {
                if (!(route?.params?.deleted)) {
                    const response = await logout(userId);
                    console.log(response);
                }
            }
            catch (error) {
                console.log(error);
            }
            userCtx.logOut();
        }

        if (userCtx.isParked) {
            Alert.alert("Can't log out because you are save / parking.");
            navigation.navigate('home')
        } else {
            userLogout();
        }
    }, [userCtx]);

    return null; 
}

export default LogoutScreen;