# 📱 ParkVision Frontend – React Native App

> Cross-platform mobile application for the ParkVision smart parking system.

---

## 🧠 Overview

The **ParkVision** frontend is built using **React Native** and serves as the user interface for the smart parking system.  
It enables users to:

- Register / log in to the system  
- View parking lots and availability  
- Book a parking spot  
- View live status and history  
- Admins can view live stream and parking statistics

---

## 🎨 Features

- 📲 Mobile UI built with **React Native** and **Expo**
- 🧭 **React Navigation** for stack/drawer navigation
- 🔐 **Authentication flows** with validations
- 🧠 **Context API** for global state (user/auth/parking)
- 📷 Live **video stream** via WebSocket for admins
- 📊 Real-time **parking history & usage stats**
- 🛠️ Admin dashboard (in-app) for managing lots/users
- 🔒 Forgot password + reset flows

---

## 🛠️ Built With

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Context API](https://reactjs.org/docs/context.html)
- [Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [Axios](https://axios-http.com/)
- [Socket.io-client](https://socket.io/)
- [Styled Components / StyleSheet API]

---

## 📁 Project Structure

```
ParkVision-frontend/
├── components/            # Shared components (e.g., LoginForm, SignupForm, Buttons)
├── constants/             # Global styles, colors
├── http/                  # API communication (login/logout requests)
├── screens/              
│   ├── AuthenticationScreens/   # Login, Signup, Welcome, ForgotPassword
│   ├── AppScreens/              # Home, ParkingLots, Booking, Settings
│   └── AdminScreens/           # Admin pages (Stream, Manage Users)
├── store/                 # Context (UserContext)
├── utils/                 # Validators (email, password, phone, etc.)
├── App.js                 # Entry point and navigation root
```

---

## 🧪 Validation & Forms

All forms (Login, Signup) are validated using custom validator functions:

- ✅ `emailValidator(email)`
- ✅ `passwordValidator(password)`
- ✅ `nameValidator(name)`
- ✅ `phoneValidator(phone)`
- ✅ `lisenceValidator(lisenceNumber)`
- 🧾 Aggregated `signUpValidation(formData)` and `loginValidation(formData)`

Each returns:
```js
{ valid: true|false, error: "...", success: "..." }
```

---

## 📦 Global State (Context API)

The app uses `UserContext` to manage:

- `user` object (ID, email, name, car info)
- Authentication state (`isAuthenticated`)
- Admin status (`isAdmin`)
- Parking state (`isParked`, `parkingId`)
- Login / logout / start parking / stop parking

---

## 🚀 Navigation Flow

- `UserLoginScreen` → Login / Signup / Forgot Password
- `HomeAppScreen` → Drawer:
  - Find Parking (Stack)
  - Home (Timer)
  - Settings (History, Profile)
  - Admin Dashboard (for `isAdmin`)
  - Logout

---

## 🖥️ Screens

### Authentication
- `WelcomeScreen` – Welcome animation & routing
- `LoginScreen` – Login form + validation
- `SignUpScreen` – Registration
- `ForgotPasswordScreen` – Password reset

### App
- `ParkingLotScreen` – List of lots
- `ParkingLotDetailScreen` – View details & availability
- `BookSpotScreen` – Reserve a parking spot
- `HomeScreen` – Timer + current parking
- `SettingsScreen` – Navigate to history/profile
- `HistoryParkingScreen` – User's parking history
- `UserDetailSettingScreen` – View/edit profile

### Admin
- `ParkingManage` – Entry page for admin
- `ParkingLotManage` – CRUD for parking lots
- `ParkingUserManager` – View/manage users
- `AdminHistoryScreen` – Global parking history
- `LiveStreamScreen` – WebSocket live feed
- `ParkingStatsScreen` – Visual stats

---

## 📲 Usage

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start Expo:
   ```bash
   npx expo start
   ```

3. Scan QR code from your phone (with Expo Go)  
   Make sure your Django server is running at the configured IP (e.g., `http://<your-ip>:8000`)

---

## ✅ Future Enhancements

- Push notifications for spot availability  
- OTP verification during signup  
- Advanced filtering for lots by location/price/type  
- Dark mode theme

---

## 📄 License

This project is part of the ParkVision system. For full licensing, see the main repository.

---

## 🤝 Credits

Made with 💙 using React Native, Expo, and Context API.  
Inspired by the need to **make parking smarter** for everyone.
