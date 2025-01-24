import { SERVER_NGROK_URL } from '@env';
import axios from 'axios';

export async function fetchParking(id) { 
    try {
        console.log(SERVER_NGROK_URL + '"');
        const response = await axios.get(`${SERVER_NGROK_URL}/parkinglot/${id}`);
        const responseData = await response.data;

        console.log(responseData)
        return responseData;
        
    } catch (error) {
        return {error: "Could'nt fetch parking spots."};
    }
}

export async function fetchAllParkingLot () {
    try {
        console.log(SERVER_NGROK_URL);
        const response = await axios.get(`${SERVER_NGROK_URL}/parkinglot/all/`);
        const responseData = await response.data;

        console.log(responseData)
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

        console.log(responseData);

        return responseData;
    }
    catch (error) {
        return {error: "Could'nt book parking"}; 
    }
}

