import { useContext, useEffect } from "react";
import { logout } from "../../http/auth";

import { UserContext } from "../../store/UserContext";
import { Alert } from "react-native";

/**
 * @component LogoutScreen
 *
 * This screen is responsible for safely logging out the user.
 * It checks if the user is currently parked and prevents logout in that case.
 * If the logout is triggered by account deletion (`route.params.deleted === true`),
 * it skips the backend logout call.
 *
 * On successful logout:
 * - Calls `logout(userId)` to clear backend session (if not deleted)
 * - Calls `userCtx.logOut()` to clear local context
 *
 * @param {object} props
 * @param {object} props.navigation - Navigation object used to go back or redirect.
 * @param {object} props.route - Route object that may contain a `deleted` param.
 *
 * @returns {null} This screen doesn't render any visible content.
 */

function LogoutScreen({ navigation, route }) {
    const userCtx = useContext(UserContext);

    useEffect(() => {
        const userId = userCtx.user?.id;
    
        async function handleLogout() {
            // Prevent logout if user is currently parking
            if (userCtx.isParked) {
                Alert.alert("Can't log out because you are currently parking.");
                navigation.goBack();
                return;
            }
    
            try {
                // Only call backend logout if the account is not being deleted
                if (!(route?.params?.deleted)) {
                    await logout(userId);
                    console.log("User logged out from backend");
                }
            } catch (error) {
                console.log("Logout error:", error);
            }
            
            // Clear user session from context
            userCtx.logOut();
        }
       
        if (userId) {
            handleLogout();
        }
    }, []);
    

    return null; 
}

export default LogoutScreen;