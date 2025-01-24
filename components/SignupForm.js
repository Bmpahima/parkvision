import { useState, useContext } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { UserContext } from "../store/UserContext";
import Input from "./Input";
import Button from "./Button";
import TextButton from "./TextButton";
import { COLORS } from "../constants/styles";
import {signUp} from '../http/auth';
import { signUpValidation, nameValidator, emailValidator, passwordValidator, lisenceValidator, phoneValidator } from "../util/validators";

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
                />
                <Input 
                placeholder="Last Name" 
                onChangeHandler={onChangeHandler} 
                name={"lname"} 
                errorMessage={hasSubmitted ? errorMessages?.lname : null}
                />
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
                <Input 
                placeholder="Phone Number" 
                keyType={"phone-pad"} 
                onChangeHandler={onChangeHandler} 
                name={"phoneNumber"} 
                errorMessage={hasSubmitted ? errorMessages?.phoneNumber : null}
                />
                <Input 
                placeholder="Lisence Number" 
                keyType={"phone-pad"} 
                onChangeHandler={onChangeHandler} 
                name={"lisenceNumber"} 
                errorMessage={hasSubmitted ? errorMessages?.lisenceNumber : null}
                />


            <View style={styles.buttonContainer}>
                <Button onPress={onSignUp}>Sign Up</Button>
            </View>

            <View style={styles.registerContainer}>
                <Text style={styles.registerText}>
                    Already have an account?{' '}
                </Text>
                <TextButton
                    onPress={() => {
                        console.log("login pressed");
                        navigation.navigate('login');
                    }}
                >
                    Sign In
                </TextButton>
            </View>
        </View>
    );
}

export default SignupForm;

const styles = StyleSheet.create({
    formContainer: {
        padding: 20,
    },
    buttonContainer: {
        marginTop: 20,
        paddingHorizontal: 10
    },
    registerContainer: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    registerText: {
        fontSize: 16,
        color: COLORS.gray900,
        textAlign: 'center',
    },
});
