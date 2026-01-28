import axios from "axios";
import { data } from "react-router-dom";
import { getUserDetails } from '../util/GetUser'


const SERVER_URL = 'http://localhost:7000/user';


const registerUser = (data)=>{
    return axios.post(SERVER_URL+'/uregister',data);
}
const loginUser = (data)=>{
    return axios.post(SERVER_URL+'/ulogin',data);
}

const AuthUservices={
    registerUser,
    loginUser,
}

export default AuthUservices;