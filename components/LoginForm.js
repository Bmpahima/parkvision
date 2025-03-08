import { useState, useContext } from "react";
import { View, Text, StyleSheet, Alert, Keyboard, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { UserContext } from "../store/UserContext";
import Input from "./Input";
import Button from "./Button";
import { COLORS } from "../constants/styles";
import { loginValidation } from "../util/validators";
import { login } from "../http/auth";

// רכיב המייצג את טופס הכניסה של המשתמש 
function LoginForm() {
    const navigation = useNavigation();
    const [errorMessages, setErrorMessages] = useState({});
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const userCtx = useContext(UserContext);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const onChangeHandler = (text, field) => { // פונקציה שמתבצעת בשינוי הטקסט בטופס
        setFormData((currentValue) => ({
            ...currentValue,
            [field]: text,
        }));

        if (hasSubmitted) { // אם המשתמש כבר ניס להגיש את הטופס
            setErrorMessages((currentErrors) => {
                const updatedErrors = { ...currentErrors };

                let validationResult;
                switch (field) {
                    case "email":
                        validationResult = loginValidation({ email: text, password: formData.password }).errors?.find(
                            (error) => error.email
                        );
                        break;
                    case "password":
                        validationResult = loginValidation({ email: formData.email, password: text }).errors?.find(
                            (error) => error.password
                        );
                        break;
                    default:
                        validationResult = { valid: true };
                        break;
                }

                if (!validationResult) {
                    delete updatedErrors[field];
                } else {
                    updatedErrors[field] = validationResult[field];
                }

                return updatedErrors;
            });
        }
    };

    const onLogin = async () => {
        setHasSubmitted(true);
    
        const validCredentials = loginValidation(formData);
    
        if (!validCredentials.valid) {
            const errors = {};
            validCredentials.errors.forEach((error) => {
                const key = Object.keys(error)[0];
                errors[key] = error[key];
            });
            setErrorMessages(errors);
            return;
        }
    
        setErrorMessages({}); 
    
        try {    
            const response = await login(formData);
    
            if (response.error) {
                const serverMessage = response.errorMessage?.error || "An unexpected error occurred.";
                Alert.alert("Login Error", serverMessage);
                return;
            }
            
            userCtx.logIn(response.user, response.isAdmin);
            navigation.navigate("drawer");
        } catch (error) {
            const serverError = error.response?.data?.error || "An unexpected error occurred.";
            Alert.alert("Login Error", serverError);
        }
    };
    
    
    return (
            <View style={styles.formContainer}>
                <Input
                    placeholder="Email"
                    keyType="email-address"
                    onChangeHandler={onChangeHandler}
                    name={"email"}
                    errorMessage={hasSubmitted ? errorMessages?.email : null}
                />
                <Input
                    placeholder="Password"
                    secureInput={true}
                    onChangeHandler={onChangeHandler}
                    name={"password"}
                    errorMessage={hasSubmitted ? errorMessages?.password : null}
                />

                <View style={styles.buttonContainer}>
                    <Button onPress={onLogin}>Log In</Button>
                </View>

                <View style={styles.formFooter}>
                    <TouchableOpacity style={styles.forgotPasswordContainer} onPress={ () => {navigation.navigate('forgot-password')} }>
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>
                    <View style={styles.orSection}>
                        <View style={[styles.horizontalLine, { marginLeft: 20 }]}></View>
                        <Text style={styles.orText}>OR</Text>
                        <View style={[styles.horizontalLine, { marginRight: 20 }]}></View>
                    </View>
                    <View style={styles.registerContainer}>
                        <Text style={styles.registerText}>
                            Don't have an account?{" "}
                        </Text>
                        <TouchableOpacity onPress={() => {
                                console.log("signup pressed");
                                navigation.navigate("signup");
                            }}>
                            <Text style={styles.signUpText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
    );
}

export default LoginForm;

const styles = StyleSheet.create({
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
        marginTop: 16,
        paddingHorizontal: 10,
    },
    formFooter: {
        alignItems: 'center'
    },
    forgotPasswordContainer: {
        marginVertical: 20
    },
    forgotPasswordText: {
        fontWeight: '500',
        color: COLORS.primary500
    },
    orSection: {
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    horizontalLine: {
        flex: 1,
        borderColor: COLORS.gray200,
        borderWidth: 1
    },
    orText: {
        marginHorizontal: 8,
        fontWeight: '600',
        color: COLORS.gray400
    },
    registerContainer: {
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    registerText: {
        color: COLORS.gray600,
        textAlign: "center",
    },
    signUpText: {
        color: COLORS.primary700,
        fontWeight: '600',
        marginLeft: 4
    }
});
