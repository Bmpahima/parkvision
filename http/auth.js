import { SERVER_NGROK_URL } from '@env';
import axios from 'axios';

/**
 * Logs the user into the system with provided email and password.
 *
 * @param {Object} credentials
 * @param {string} credentials.email - User's email
 * @param {string} credentials.password - User's password
 * @returns {Promise<Object>} Response data or error object
 */

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

/**
 * Logs the user out of the system by user ID.
 *
 * @param {string|number} id - User's unique identifier
 * @returns {Promise<Object>} Response data or error object
 */

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


/**
 * Registers a new user with the given form data.
 *
 * @param {Object} formData - User registration details
 * @param {string} formData.first_name
 * @param {string} formData.last_name
 * @param {string} formData.email
 * @param {string} formData.password
 * @param {string} formData.phone_number
 * @param {string} formData.lisence_plate_number
 * @returns {Promise<Object>} Response data or error object
 */

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

/**
 * Sends a password reset code to the user's email.
 *
 * @param {string} email - Email address to send the code to
 * @returns {Promise<Object>} Response data or error object
 */

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

/**
 * Resets the user's password using the email and new password.
 *
 * @param {string} email - User's email
 * @param {string} password - New password to set
 * @returns {Promise<Object>} Response data or error object
 */

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

/**
 * Deletes the account of a user by ID.
 *
 * @param {string|number} userId - User's unique identifier
 * @returns {Promise<Object>} Response data or error object
 */

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
