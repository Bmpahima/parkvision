import { createContext, useState } from "react";

/**
 * @typedef {Object} User
 * @property {number} id - User ID
 * @property {string} fname - First name
 * @property {string} lname - Last name
 * @property {string} email - Email address
 * @property {string} phoneNumber - User's phone number
 * @property {string} lisenceNumber - Vehicle license number
 * @property {string} car_year - Year of the user's car
 * @property {string} car_model - Car model (not currently used)
 * @property {string} car_color - Car color
 * @property {string} car_type - Car type or brand
 */

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

/**
 * @typedef {Object} UserContextValue
 * @property {User} user - The currently logged-in user
 * @property {boolean} isAuthenticated - Whether a user is logged in
 * @property {boolean} isAdmin - Whether the user has admin privileges
 * @property {boolean} isParked - Whether the user is currently parked
 * @property {number|null} parkingId - ID of the parking spot in use (if any)
 * @property {(userData: User, isAdminFlag?: boolean) => void} logIn - Log in the user with optional admin flag
 * @property {() => void} logOut - Log out the current user
 * @property {(id: number) => void} startParking - Start a parking session with a given parking ID
 * @property {() => void} stopParking - End the current parking session
 */

/**
 * React context that stores authentication, authorization, and parking session state for the user.
 * 
 * @type {React.Context<UserContextValue>}
 */

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

/**
 * @component
 * @name UserContextProvider
 * @description Context provider that wraps around children components to provide user and session state globally.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components that will consume the context
 * @returns {JSX.Element}
 */

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
