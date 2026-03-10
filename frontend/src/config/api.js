const getApiUrl = () =>{
    if(import.meta.env.PROD) {
        return 'https://lightspeed-backend-4rwz.onrender.com'
    }
    return 'http://localhost:7000';
};

export const API_URL = getApiUrl();