import { createContext, useState } from "react";

const initialValue = {
    fname: "",
    lname: "",
    email: "",
    password: "",
    phoneNumber: "",
    lisenceNumber: ""
};

export const UserContext = createContext({
    user: initialValue,
    isAuthenticated: false,
    isAdmin: false,
    logIn: () => {},
    logOut: () => {},
});

function UserContextProvider({ children }) {
    const [user, setUser] = useState(initialValue);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false)


    function logIn(userData, isadmin=false) {
        setUser({ ...userData }); 
        setIsAdmin(isadmin);
        setIsAuthenticated(true); 
    }


    function logOut() {
        setUser(initialValue);
        setIsAuthenticated(false); 
    }


    const value = {
        user,
        isAuthenticated,
        isAdmin,
        logIn,
        logOut,
    }

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}

export default UserContextProvider;
