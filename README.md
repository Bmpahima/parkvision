# 📱 ParkVision Frontend – Smart Parking Mobile App

> Cross-platform app built with React Native to enhance the user experience in parking lot management.

---

## 🌟 Overview

The ParkVision frontend is a mobile application developed using React Native, designed to complement the backend system and provide seamless user interaction.
It supports real-time parking monitoring, user authentication, smart reservations, and admin control panels with live streaming and analytics.

This app connects directly to the Django backend via REST APIs and WebSocket for real-time updates and secure access.

---

## 📲 Features

- 🔐 **User authentication** (signup, login, forgot password)
- 🚘 **Real-time parking spot tracking** and booking interface
- ⏳ **Parking timer** for active parking sessions
- 🛑 **Unauthorized vehicle detection alerts**
- 🧾 **Parking history & stats** for both users and admins
- 🎥 **Live video stream access** for admins via WebSocket
- ⚙️ **User and car details management**
- 🧠 **Context API** for persistent auth and session state

---

## 🛠️ Built With

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [Context API](https://reactjs.org/docs/context.html)
- [Socket.IO Client](https://socket.io/)
- [Django REST API](https://www.django-rest-framework.org/) (backend integration)

---

## 🧱 Project Structure

```
📁 src/
├── 📁 screens/                # Screen components (Login, Signup, Home, Admin, etc.)
├── 📁 store/                  # Context API (UserContext.js)
├── 📁 constants/              # Styling constants (colors, spacing, etc.)
├── 📁 images/                 # App images
├── 📁 utils/                  # Form validation functions
├── App.js                    # Root component with Navigation logic
├── navigation/               # Stack and Drawer navigators
```

---

## 🚀 Key Components

### 🧭 `App.js`
Entry point of the app. Handles the context provider and root navigation (switch between auth stack and drawer).

### 📱 Authentication Screens
- `WelcomeScreen`, `LoginScreen`, `SignUpScreen`, `ForgotPasswordScreen`
- Includes Reanimated transitions, validations, and navigation hooks

### 📦 `UserContext.js`
Stores and manages user session:
- `logIn`, `logOut`, `startParking`, `stopParking`
- Auth state, parking state, admin check

### 📂 `utils/validation.js`
Contains:
- `emailValidator`, `passwordValidator`, `nameValidator`, etc.
- Functions used for login/signup form validation

---

## 🧪 How to Run

### 📦 Prerequisites
- Node.js & npm
- Expo CLI (`npm install -g expo-cli`)
- Expo Go mobile app (download from Play Store or App Store)
- Android Studio / iOS Simulator / Physical Device

### ⚙️ Installation
```bash
npm install
npm start
```
Scan the QR code with your Expo Go app or run on emulator.

---

## 🛡️ Roles

- 👤 Regular Users:
  - Sign in, view nearby lots, reserve a spot, view parking history
- 👮 Admin Users:
  - View live stream, manage lots and spots, view usage statistics, receive alerts

---

## 📌 Future Improvements

- 🔄 Background push notifications
- 📍 Geofencing-based spot suggestions
- 🧾 Email invoice generation on logout
- 🧑‍🤝‍🧑 Multi-role session switching (Admin/User)

---

## 📊 Tech Stack

![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Expo](https://img.shields.io/badge/expo-1C1E24?style=for-the-badge&logo=expo&logoColor=#D04A37)
![Context-API](https://img.shields.io/badge/Context--Api-000000?style=for-the-badge&logo=react)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![React Navigation](https://img.shields.io/badge/React_Navigation-20232a?style=for-the-badge&logo=react&logoColor=61DAFB)
