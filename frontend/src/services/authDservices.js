import axios from "axios";
import { data } from "react-router-dom";
import { API_URL } from "../config/api";

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7000';

// const SERVER_URL = 'http://localhost:7000/driver';

const registerDriver = (data)=>{
    return axios.post(`${API_URL}/driver/dregister`,data);

}
const loginDriver = (data)=>{
    return axios.post(`${API_URL}/driver/dlogin`,data);
}

const AuthDservices ={
    registerDriver,
    loginDriver
}

export default AuthDservices;