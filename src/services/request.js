import axios from 'axios';

//export const URL = "http://127.0.0.1:8000"
//export const URL = "http://192.168.11.150:8000"

export const BASE_URL = "https://wilofo-api.enumera.tech";
//export const URL = "https://api.enumera.tech"

const request = axios.create({
    baseURL: URL+"/api/",
    withCredentials: false,
    headers: {
        'Accept':'application/json',
        'Content-Type': 'application/json'
    },
});



export default request