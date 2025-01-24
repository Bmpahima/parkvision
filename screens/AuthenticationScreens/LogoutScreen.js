import { useContext, useEffect } from "react";

import { UserContext } from "../../store/UserContext";

function LogoutScreen() {
    const userCtx = useContext(UserContext);

    useEffect(() => {
        userCtx.logOut();
    }, [userCtx]);

    return null; 
}

export default LogoutScreen;