import { useState, useContext } from "react";
import { View, Text, StyleSheet, Alert, Keyboard, TouchableWithoutFeedback } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { UserContext } from "../store/UserContext";
import Input from "./Input";
import Button from "./Button";
import TextButton from "./TextButton";
import { COLORS } from "../constants/styles";
import { loginValidation } from "../util/validators";
import { login } from "../http/auth";

function LoginForm() {
    const navigation = useNavigation();
    const [errorMessages, setErrorMessages] = useState({});
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const userCtx = useContext(UserContext);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const onChangeHandler = (text, field) => {
        setFormData((currentValue) => ({
            ...currentValue,
            [field]: text,
        }));

        if (hasSubmitted) {
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
    
            userCtx.logIn(response.user);
    
            navigation.navigate("drawer");
        } catch (error) {
            const serverError = error.response?.data?.error || "An unexpected error occurred.";
            Alert.alert("Login Error", serverError);
        }
    };
    
    
    

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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

                <View style={styles.registerContainer}>
                    <Text style={styles.registerText}>
                        Don't have an account?{" "}
                    </Text>
                    <TextButton
                        onPress={() => {
                            console.log("signup pressed");
                            navigation.navigate("signup");
                        }}
                    >
                        Sign Up
                    </TextButton>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

export default LoginForm;

const styles = StyleSheet.create({
    formContainer: {
        padding: 20,
    },
    buttonContainer: {
        marginTop: 20,
        paddingHorizontal: 10,
    },
    registerContainer: {
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    registerText: {
        fontSize: 16,
        color: COLORS.gray900,
        textAlign: "center",
    },
});
