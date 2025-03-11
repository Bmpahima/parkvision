import { useState, useContext } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { UserContext } from "../store/UserContext";
import Input from "./Input";
import Button from "./Button";
import { COLORS } from "../constants/styles";
import {signUp} from '../http/auth';
import { signUpValidation, nameValidator, emailValidator, passwordValidator, lisenceValidator, phoneValidator } from "../util/validators";

// רכיב המייצג טופס הרשמה של משתמשים
function SignupForm() {
    const navigation = useNavigation();
    const [errorMessages, setErrorMessages] = useState({});
    const [hasSubmitted, setHasSubmitted] = useState(false); 
    const userCtx = useContext(UserContext);
    
    const [formData, setFormData] = useState({
        fname: "",
        lname: "",
        email: "",
        password: "",
        phoneNumber: "",
        lisenceNumber: ""
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
                    case 'fname':
                    case 'lname':
                        validationResult = nameValidator(text);
                        break;
                    case 'email':
                        validationResult = emailValidator(text);
                        break;
                    case 'password':
                        validationResult = passwordValidator(text);
                        break;
                    case 'phoneNumber':
                        validationResult = phoneValidator(text);
                        break;
                    case 'lisenceNumber':
                        validationResult = lisenceValidator(text);
                        break;
                    default:
                        validationResult = { valid: true };
                        break;
                }

                if (validationResult.valid) {
                    delete updatedErrors[field]; 
                } else {
                    updatedErrors[field] = validationResult.error; 
                }

                return updatedErrors;
            });
        }
    };

    const onSignUp = async () => {
        setHasSubmitted(true);
    
        const validCredentials = signUpValidation(formData);
    
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
    
        const requestData = {
            first_name: formData.fname,
            last_name: formData.lname,
            email: formData.email,
            password: formData.password,
            phone_number: formData.phoneNumber,
            lisence_plate_number: formData.lisenceNumber,
        };
        
        try {
            const response = await signUp(requestData);
    
            if (response.error) {
                const serverMessage = response.errorMessage?.error || "An unexpected error occurred.";
                Alert.alert("Sign Up Error", serverMessage);
                return;
            }
    
            userCtx.logIn(response.user);
            navigation.navigate("drawer");
        } catch (error) {
            const serverError = error.response?.data?.error || "An unexpected error occurred.";
            Alert.alert("Sign Up Error", serverError);
        }
    };
    

    return (
        <View style={styles.formContainer}>
            <Input 
                placeholder="First Name" 
                onChangeHandler={onChangeHandler} 
                name={"fname"} 
                errorMessage={hasSubmitted ? errorMessages?.fname : null}
                value={formData.fname}
                />
                <Input 
                placeholder="Last Name" 
                onChangeHandler={onChangeHandler} 
                name={"lname"} 
                errorMessage={hasSubmitted ? errorMessages?.lname : null}
                value={formData.lname}
                />
                <Input 
                placeholder="Email" 
                keyType="email-address" 
                onChangeHandler={onChangeHandler} 
                name={"email"} 
                errorMessage={hasSubmitted ? errorMessages?.email : null}
                value={formData.email}
                />
                <Input 
                placeholder="Password" 
                secureInput={true} 
                onChangeHandler={onChangeHandler} 
                name={"password"} 
                errorMessage={hasSubmitted ? errorMessages?.password : null}
                value={formData.password}
                />
                <Input 
                placeholder="Phone Number" 
                keyType={"phone-pad"} 
                onChangeHandler={onChangeHandler} 
                name={"phoneNumber"} 
                errorMessage={hasSubmitted ? errorMessages?.phoneNumber : null}
                value={formData.phoneNumber}
                />
                <Input 
                placeholder="Lisence Number" 
                keyType={"phone-pad"} 
                onChangeHandler={onChangeHandler} 
                name={"lisenceNumber"} 
                errorMessage={hasSubmitted ? errorMessages?.lisenceNumber : null}
                value={formData.lisenceNumber}
                />


            <View style={styles.buttonContainer}>
                <Button onPress={onSignUp}>Sign Up</Button>
            </View>

            <View style={styles.formFooter}>
                <View style={styles.registerContainer}>
                    <Text style={styles.registerText}>
                        Already have an account?{' '}
                    </Text>
                    <TouchableOpacity onPress={() => { navigation.navigate("login"); }}>
                        <Text style={styles.signUpText}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export default SignupForm;

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
    registerContainer: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
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
