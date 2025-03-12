import { SERVER_NGROK_URL } from '@env';
import axios from 'axios';

// פונקציה שמשמשת לכניסה של המשתמש למערכת
export async function login({ email, password }) {
    try {
        const response = await axios.post(`${SERVER_NGROK_URL}/auth/login/`, JSON.stringify({
            email: email,
            password: password
        }), { headers: { 'Content-Type': 'application/json' }});

        const resData = response.data;

        return resData; 
    } catch (error) {
        console.log(error)
        return {
            error: "Unable to login",
            errorMessage: error.response ? error.response.data : error.message
        };
    
    }
}

// פונקציה שמשמשת ליציאה של המשתמש מהמערכת
export async function logout(id) {
    try {
        const response = await axios.post(
            `${SERVER_NGROK_URL}/auth/logout/`,
            { id }, 
            { headers: { 'Content-Type': 'application/json' } }
        );

        const resData = response.data;
        console.log(resData);
        return resData; 
    } catch (error) {
        console.log(error);
        return {
            error: "Unable to logout",
            errorMessage: error.response ? error.response.data : error.message
        };
    }
}


// פונקציה שמשמשת לשמירת פרטי ההרשמה והרשמה של משתמש למערכת
export async function signUp(formData) {
    try {
        const requestData = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            password: formData.password,
            phone_number: formData.phone_number,
            lisence_plate_number: formData.lisence_plate_number,
        };

        const response = await axios.post(
            `${SERVER_NGROK_URL}/auth/register/`,
            JSON.stringify(requestData),
            { headers: { 'Content-Type': 'application/json' } }
        );

        return response.data;
    } catch (error) {
        return {
            error: true,
            errorMessage: error.response?.data || { error: "An unexpected error occurred." },
        };
    }
}

export async function forgotPassword(email) {
    try {
        const response = await axios.post(
            `${SERVER_NGROK_URL}/auth/forgot-password/`,
            { email }, 
            { headers: { 'Content-Type': 'application/json' } }
        );

        const resData = response.data;
        console.log(resData.code);
        return resData; 
    } catch (error) {
        return {
            error: "Unable to send an email, please try again...",
            errorMessage: error.response ? error.response.data : error.message
        };
    }
}

export async function resetPassword(email, password) {
    console.log(password);
    try {
        const response = await axios.post(
            `${SERVER_NGROK_URL}/auth/reset-password/`,
            { email, new_password: password }, 
            { headers: { 'Content-Type': 'application/json' } }
        );

        const resData = response.data;
        return resData; 
    } catch (error) {
        return {
            error: "Unable to reset you password. Please try again later.",
            errorMessage: error.response ? error.response.data : error.message
        };
    }
}

export async function deleteAccount(userId) {
    try {
        const response = await axios.delete(
            `${SERVER_NGROK_URL}/auth/delete-account/${userId}/`,
            { headers: { 'Content-Type': 'application/json' } }
        );

        const resData = response.data;
        return resData; 
    } catch (error) {
        return {
            error: "Unable to delete your account. Please try again later.",
            errorMessage: error.response ? error.response.data : error.message
        };
    }
}
