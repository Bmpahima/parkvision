import { createContext, useState } from "react";

const initialValue = {
  id: NaN,
  fname: "",
  lname: "",
  email: "",
  phoneNumber: "",
  lisenceNumber: "",
  car_year: "",
  car_model: "",
  car_color: "",
  car_type: ""
};

export const UserContext = createContext({
  user: initialValue,
  isAuthenticated: false,
  isAdmin: false,
  isParked: false,
  parkingId: null,
  logIn: () => {},
  logOut: () => {},
  startParking: () => {},
  stopParking: () => {},
});

function UserContextProvider({ children }) {
  const [user, setUser] = useState(initialValue);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isParked, setIsParked] = useState(false);
  const [parkingId, setParkingId] = useState(null);

  function logIn(userData, isAdminFlag = false) {
    if (!userData || !userData.id) {
      console.error("Invalid user data provided for login.");
      return;
    }
    console.log("User logged in:", userData);
    setUser({ ...userData });
    setIsAdmin(isAdminFlag);
    setIsAuthenticated(true);
  }

  function startParking(id) {
    if (!isAuthenticated) {
      console.log("Unauthorized user cannot start parking.");
      return;
    }
    setIsParked(true);
    setParkingId(id);
  }

  function stopParking() {
    if (!isAuthenticated || !isParked) {
      console.log("No active parking to stop.");
      return;
    }
    setIsParked(false);
    setParkingId(null);
  }

  function logOut() {
    console.log("User logged out.");
    setUser(initialValue);
    setIsAuthenticated(false);
    setIsAdmin(false);
    setIsParked(false);
    setParkingId(null);
  }

  const value = {
    user,
    isAuthenticated,
    isAdmin,
    isParked,
    parkingId,
    logIn,
    logOut,
    startParking,
    stopParking,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContextProvider;
