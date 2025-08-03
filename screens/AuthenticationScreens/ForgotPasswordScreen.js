import { View, Text, StyleSheet, Image, SafeAreaView, ScrollView, StatusBar, Platform, KeyboardAvoidingView, TouchableOpacity, Alert } from "react-native";
import { useState } from 'react';

import { COLORS } from "../../constants/styles";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { forgotPassword, resetPassword } from "../../http/auth";
import { emailValidator, passwordValidator } from "../../util/validators";


/**
 * @component ForgotPasswordScreen
 *
 * This screen allows users to reset their password through a 3-step process:
 * 1. Submitting their email to receive a reset code
 * 2. Entering the verification code
 * 3. Setting a new password
 *
 * @param {object} props
 * @param {object} props.navigation - React Navigation object for screen navigation
 *
 * @returns {JSX.Element} Rendered Forgot Password screen
 */

function ForgotPasswordScreen({ navigation }) {
  const [errorMessages, setErrorMessages] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [codeSubmitted, setCodeSubmitted] = useState(false);
  const [emailEntered, setEmailEntered] = useState("");
  const [codeEntered, setCodeEntered] = useState("");
  const [realCode, setRealCode] = useState("");
  const [newPasswordEntered, setNewPasswordEntered] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  /**
   * Handles email input change and validation.
   * @param {string} text - The entered email value
   */

  const onEmailChangeHandler = (text) => {
    setEmailEntered(text);
    if (hasSubmitted) {
      setErrorMessages((prev) => ({
        ...prev,
        email: emailValidator(text).valid ? null : "Invalid email format",
      }));
    }
  };

  /**
   * Handles verification code input change and validation.
   * @param {string} text - The entered code
   */

  const onCodeChangeHandler = (text) => {
    setCodeEntered(text);
    if (hasSubmitted) {
      setErrorMessages((prev) => ({
        ...prev,
        code: text.length === 6 ? null : "Code must be 6 digits",
      }));
    }
  };

  /**
   * Handles password or confirmation input change and validation.
   * @param {string} text - The entered password
   * @param {string} field - Either 'newPassword' or 'confirmPassword'
   */

  const onPasswordChangeHandler = (text, field) => {
    setNewPasswordEntered((prev) => ({ ...prev, [field]: text }));
    if (hasSubmitted) {
      setErrorMessages((prev) => {
        let newErrors = { ...prev };
        if (field === "newPassword") {
          newErrors.newPassword = passwordValidator(text).valid
            ? null
            : "Password must be at least 8 characters";
        }
        if (field === "confirmPassword") {
          newErrors.confirmPassword = text === newPasswordEntered.newPassword
            ? null
            : "Passwords do not match";
        }
        return newErrors;
      });
    }
  };

  /**
   * Submits the email and triggers a request to send a reset code.
   * Validates the email before sending.
   */

  const onEmailSubmit = async () => {
    setHasSubmitted(true);
    if (!emailValidator(emailEntered).valid) {
      setErrorMessages((prev) => ({ ...prev, email: "Invalid email format" }));
      return;
    }
    try {
      const response = await forgotPassword(emailEntered.toLowerCase());
      if (!response || response.error) {
        Alert.alert("Error", "Failed to send verification code. Please try again.");
        return;
      }
      setRealCode(response.code);
      setEmailSubmitted(true);
      setHasSubmitted(false);
    } catch (error) {
      Alert.alert("Error", "Failed to send reset code. Please try again.");
    }
  };

  /**
   * Verifies the reset code entered by the user.
   * Displays error if the code is invalid.
   */

  const onCodeSubmit = () => {
    setHasSubmitted(true);
    if (codeEntered.length !== 6) {
      setErrorMessages((prev) => ({ ...prev, code: "Code must be 6 digits" }));
      return;
    }
    if (realCode === codeEntered) {
      setCodeSubmitted(true);
      setHasSubmitted(false);
    } else {
      setErrorMessages((prev) => ({ ...prev, code: "Invalid verification code" }));
    }
  };

  /**
   * Submits the new password after verification.
   * Validates password format and confirmation.
   */

  const onPasswordSubmit = async () => {
    setHasSubmitted(true);
    const { newPassword, confirmPassword } = newPasswordEntered;
    if (!passwordValidator(newPassword).valid) {
      setErrorMessages((prev) => ({ ...prev, newPassword: "Invalid password format" }));
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessages((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
      return;
    }
    try {
      await resetPassword(emailEntered.toLowerCase(), newPassword);
      Alert.alert("Success", "Password reset successfully!", [{ text: "OK", onPress: () => navigation.goBack() }]);
    } catch (error) {
      Alert.alert("Error", "Failed to reset password. Please try again.");
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
          <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Image source={require('../../images/rb_1841.png')} style={styles.image}/> 
              <View style={styles.headerTextContainer}>
                <Text style={styles.titleText}>Reset Password</Text>
                <Text style={styles.subtitleText}>
                  {!emailSubmitted ? "Enter your email to receive a password reset code" : !codeSubmitted ?  "Enter the verification code" : "Enter your new password"}
                </Text>
              </View>
            </View>
            <View style={styles.formContainer}>
              {!emailSubmitted ? (
                <>
                  <Input placeholder="Email" keyboardType="email-address" onChangeHandler={onEmailChangeHandler} name="email" errorMessage={hasSubmitted ? errorMessages.email : null} value={emailEntered} />
                  <View style={styles.buttonContainer}>
                    <Button onPress={onEmailSubmit}>Send Reset Code</Button>
                  </View>
                </>
              ) : !codeSubmitted ? (
                <View>
                  <Input placeholder="Enter code here" keyboardType="numeric" onChangeHandler={onCodeChangeHandler} name="code" errorMessage={hasSubmitted ? errorMessages.code : null} value={codeEntered} />
                  <View style={styles.buttonContainer}>
                    <Button onPress={onCodeSubmit}>Submit</Button>
                  </View>
                </View>
              ) : (
                <View>
                  <Input placeholder="New Password" secureInput onChangeHandler={onPasswordChangeHandler} name="newPassword" errorMessage={hasSubmitted ? errorMessages.newPassword : null} value={newPasswordEntered.newPassword} />
                  <Input placeholder="Confirm Password" secureInput onChangeHandler={onPasswordChangeHandler} name="confirmPassword" errorMessage={hasSubmitted ? errorMessages.confirmPassword : null} value={newPasswordEntered.confirmPassword} />
                  <View style={styles.buttonContainer}>
                    <Button onPress={onPasswordSubmit}>Submit</Button>
                  </View>
                </View>
              )}
              <View style={styles.formFooter}>
                <Text style={styles.registerText}>Back to</Text>
                <TouchableOpacity style={styles.backToContainer} onPress={() => navigation.goBack()}>
                  <Text style={styles.backToText}>login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  safeArea: {
      flex: 1
  },
  keyboardAvoidingView: {
      flex: 1,
  },
  container: {
      flexGrow: 1,
      paddingTop: 40,
      paddingBottom: 40,
  },
  headerTextContainer: {
      alignItems: 'center',
      marginBottom: 40,
      marginHorizontal: 20
  },
  titleText: {
      fontSize: 36,
      fontWeight: 'bold',
      letterSpacing: 1,
      color: COLORS.primary700,
      marginBottom: 10
  },
  subtitleText: {
      fontSize: 16,
      color: COLORS.gray700,
      textAlign: 'center'
  },
  image: {
      width: 160,
      height: 160,
      alignSelf: 'center',
      marginBottom: 16
  },
  formContainer: {
    padding: 40,
    marginHorizontal: 20,
    backgroundColor: COLORS.gray50,
    borderRadius: 20,
    shadowColor: COLORS.gray900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
},
buttonContainer: {
    marginTop: 4,
    paddingHorizontal: 10,
},
formFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
},
backToContainer: {
    marginVertical: 16
},
registerText: {
  color: COLORS.gray600,
  textAlign: "center",
},
backToText: {
    fontWeight: '600',
    color: COLORS.primary700,
    marginLeft: 4
},
});
