import { SERVER_NGROK_URL } from '@env';
import axios from 'axios';

/**
 * Fetches parking lot data by its ID.
 *
 * @param {string|number} id - Parking lot identifier
 * @returns {Promise<Object>} Parking lot data or error object
 */

export async function fetchParking(id) { 
    try {
        const response = await axios.get(`${SERVER_NGROK_URL}/parkinglot/${id}`);
        const responseData = await response.data;
        return responseData;
        
    } catch (error) {
        return {error: "Could'nt fetch parking spots."};
    }
}

/**
 * Fetches data for all available parking lots.
 *
 * @returns {Promise<Object>} Array of parking lot data or error object
 */

export async function fetchAllParkingLot () {
    try {
        const response = await axios.get(`${SERVER_NGROK_URL}/parkinglot/all/`);
        const responseData = await response.data;
        return responseData;
        
    }
    catch (error) {
        return {error: "Could'nt fetch parking spots."};    
    }
}

/**
 * Books a specific parking spot for a user.
 *
 * @param {number|string} id - Parking spot ID
 * @param {number|string} userId - User ID
 * @param {string} [save_time='immediate'] - Optional time to save the parking
 * @returns {Promise<Object>} Booking result or error object
 */

export async function bookParking(id, userId, save_time='immediate') {
    try {
        const response = await axios.post(`${SERVER_NGROK_URL}/parkinglot/book/`, JSON.stringify({
            id,
            user_id: userId,
            savetime: save_time
        }), { headers: { 'Content-Type': 'application/json' }});

        const responseData = await response.data;
        return responseData;
    }
    catch (error) {
        return {error: "Could'nt book parking"}; 
    }
}

/**
 * Checks whether a parking spot is currently occupied.
 *
 * @param {number|string} parkingId - Parking spot ID
 * @returns {Promise<boolean|Object>} True if occupied, false otherwise, or error object
 */

export async function isOccupied(parkingId) {
    try {
        const response = await axios.post(`${SERVER_NGROK_URL}/parkinglot/occupancy/`, JSON.stringify({
            parkingId,
        }), { headers: { 'Content-Type': 'application/json' }});

        const responseData = await response.data;
        
        if ( responseData.error || !responseData.occupied ) {
            return false;
        }
        return true;
    }
    catch (error) {
        return {error: "Could'nt unbook parking"}; 
    }
}

/**
 * Unbooks a previously reserved parking spot.
 *
 * @param {number|string} id - Parking spot ID
 * @param {number|string} userId - User ID
 * @returns {Promise<Object>} Unbooking result or error object
 */

export async function unBookParking(id, userId) {
    try {
        const response = await axios.post(`${SERVER_NGROK_URL}/parkinglot/unbook/`, JSON.stringify({
            id,
            user_id: userId,
        }), { headers: { 'Content-Type': 'application/json' }});

        const responseData = await response.data;
        return responseData;
    }
    catch (error) {
        return {error: "Could'nt unbook parking"}; 
    }
}

/**
 * Fetches all parking lots owned by a specific admin.
 *
 * @param {number|string} ownerId - Admin user ID
 * @returns {Promise<Object>} List of parking lots or error object
 */

export async function fetchOwnerParkingLots(ownerId) {
    try {
        
        const response = await axios.get(`${SERVER_NGROK_URL}/parkinglot/admin_parking_lots/${ownerId}/`);
        
        const responseData = await response.data;
        return responseData;
    } 
    catch (error) {
        return { error: "Couldn't fetch owner's parking lots." };
    }
}

/**
 * Fetches users currently parked in a specific parking lot.
 *
 * @param {number|string} parkingLotId - Parking lot ID
 * @returns {Promise<Object>} List of users or error object
 */

export async function fetchParkingLotUsers (parkingLotId) {
    try {
        const response = await axios.get(`${SERVER_NGROK_URL}/parkinglot/parking_lot_users/${parkingLotId}/`);
        
        return response.data;

    } catch (error) {
        return { error: "Couldn't fetch users parked in this parking lot." };
    }
}

/**
 * Fetches parking history of a specific parking lot (for admin).
 *
 * @param {number|string} parkingLotId - Parking lot ID
 * @returns {Promise<Object>} Parking history data or error object
 */

export async function getParkingLotHistory (parkingLotId) {
    try {
        const response = await axios.get(`${SERVER_NGROK_URL}/auth/admin/history/${parkingLotId}/`);

        return response.data;

    } catch (error) {
        return { error: "Couldn't fetch users parked in this parking lot." };
    }
}

/**
 * Fetches parking history of a specific user (for regular user).
 *
 * @param {number|string} userId - User ID
 * @returns {Promise<Object>} User's parking history or error object
 */

export async function getUserHistory (userId) {
    try {
        const response = await axios.get(`${SERVER_NGROK_URL}/auth/history/${userId}/`);
        
        return response.data;

    } catch (error) {
        return { error: "Couldn't fetch users parked in this parking lot." };
    }
}

/**
 * Retrieves statistical report data for a parking lot (for admin, for PDF).
 *
 * @param {number|string} id - Parking lot ID
 * @param {Object} formData - Date and parking lot details
 * @param {number} formData.month - Month for report
 * @param {number} formData.year - Year for report
 * @param {string} formData.parkinglot - Parking lot name or ID
 * @returns {Promise<Object>} Report data or error object
 */

export async function getParkingStats(id, formData) {
    try {
        const response = await axios.post(`${SERVER_NGROK_URL}/parkinglot/stats/`, JSON.stringify({
            id,
            month: formData.month,
            year: formData.year,
            parkinglot: formData.parkinglot
        }), { headers: { 'Content-Type': 'application/json' }});

        const responseData = await response.data;
        return responseData;
    }
    catch (error) {
        return {error: "Could'nt fetch parking lot stats."}; 
    }
}

