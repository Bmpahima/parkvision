import { SERVER_NGROK_URL } from '@env';
import axios from 'axios';

// פונקציה שמחזירה את המידע הדרוש על חניון בהינתן המספר המזהה שלו
export async function fetchParking(id) { 
    try {
        const response = await axios.get(`${SERVER_NGROK_URL}/parkinglot/${id}`);
        const responseData = await response.data;
        return responseData;
        
    } catch (error) {
        return {error: "Could'nt fetch parking spots."};
    }
}

// פונקציה שמחזירה את המידע הדרוש על כל החניונים
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

// פונקציה המשמשת לשמירת חנייה מסוימת בהינתן מספר מזהה, מספר משתמש וזמן לשמירה
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

// פונקציה שרק בודקת בזמן אמת אם חנייה תפוסה או לא
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

// פונקציה שמפסיקה את השמירה של החנייה
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

// פונקציה שמחזירה מידע על החניונים של האדמין בהינתן מספר מזהה
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

// פונקציה שמחזירה מידע מהשרת עבור האדמין על משתמשים החונים בחניון שלו
export async function fetchParkingLotUsers (parkingLotId) {
    try {
        const response = await axios.get(`${SERVER_NGROK_URL}/parkinglot/parking_lot_users/${parkingLotId}/`);
        
        return response.data;

    } catch (error) {
        return { error: "Couldn't fetch users parked in this parking lot." };
    }
}

// פונקציה שמחזירה מהשרת את ההיסטוריה של חניון מסוים - עבור האדמין
export async function getParkingLotHistory (parkingLotId) {
    try {
        const response = await axios.get(`${SERVER_NGROK_URL}/auth/admin/history/${parkingLotId}/`);
        console.log(response.data);
        return response.data;

    } catch (error) {
        return { error: "Couldn't fetch users parked in this parking lot." };
    }
}

// פונקציה שמחזירה את ההיסטוריה של משתמש מסוים - עבור יוזר רגיל מתוך ההגדרות
export async function getUserHistory (userId) {
    try {
        console.log(userId)
        const response = await axios.get(`${SERVER_NGROK_URL}/auth/history/${userId}/`);
        console.log(response.data);
        return response.data;

    } catch (error) {
        return { error: "Couldn't fetch users parked in this parking lot." };
    }
}

// פונקציה שמחזירה לאדמין את הנתונים על החניון שלו בקובץ pdf
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

