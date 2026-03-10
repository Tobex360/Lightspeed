import axios from "axios";
import { data } from "react-router-dom";
import { getUserDetails } from '../util/GetUser'
import { API_URL } from "../config/api";

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7000';
// const SERVER_URL = 'http://localhost:7000/user';


const registerUser = (data)=>{
    return axios.post(`${API_URL}/user/uregister`,data);
}
const loginUser = (data)=>{
    return axios.post(`${API_URL}/user/ulogin`,data);
}

const AuthUservices={
    registerUser,
    loginUser,
}

export default AuthUservices;