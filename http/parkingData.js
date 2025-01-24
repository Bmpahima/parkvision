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
        console.log(error);
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
        console.log(error);
    }
}

