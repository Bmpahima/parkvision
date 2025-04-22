import { useContext, useEffect } from "react";
import { logout } from "../../http/auth";

import { UserContext } from "../../store/UserContext";
import { Alert } from "react-native";

function LogoutScreen({ navigation, route }) {
    const userCtx = useContext(UserContext);

    useEffect(() => {
        const userId = userCtx.user?.id;
    
        async function handleLogout() {
            
            if (userCtx.isParked) {
                Alert.alert("Can't log out because you are currently parking.");
                navigation.goBack();
                return;
            }
    
            try {
                if (!(route?.params?.deleted)) {
                    await logout(userId);
                    console.log("User logged out from backend");
                }
            } catch (error) {
                console.log("Logout error:", error);
            }
    
            userCtx.logOut();
        }
    
       
        if (userId) {
            handleLogout();
        }
    }, []);
    

    return null; 
}

export default LogoutScreen;