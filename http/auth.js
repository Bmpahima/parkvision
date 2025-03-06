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


