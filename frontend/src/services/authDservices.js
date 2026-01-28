import axios from "axios";
import { data } from "react-router-dom";


const SERVER_URL = 'http://localhost:7000/driver';

const registerDriver = (data)=>{
    return axios.post(SERVER_URL+'/dregister',data);

}
const loginDriver = (data)=>{
    return axios.post(SERVER_URL+'/dlogin',data);
}

const AuthDservices ={
    registerDriver,
    loginDriver
}

export default AuthDservices;