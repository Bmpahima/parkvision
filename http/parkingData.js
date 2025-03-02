import { SERVER_NGROK_URL } from '@env';
import axios from 'axios';

export async function fetchParking(id) { 
    try {
        const response = await axios.get(`${SERVER_NGROK_URL}/parkinglot/${id}`);
        const responseData = await response.data;
        return responseData;
        
    } catch (error) {
        return {error: "Could'nt fetch parking spots."};
    }
}

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

export async function fetchParkingLotUsers(parkingLotId) {
    try {
        const response = await axios.get(`${SERVER_NGROK_URL}/parkinglot/parking_lot_users/${parkingLotId}/`);
        
        return response.data;

    } catch (error) {
        return { error: "Couldn't fetch users parked in this parking lot." };
    }
}



