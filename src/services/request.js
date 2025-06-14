import axios from 'axios';

//export const URL = "http://127.0.0.1:8000"
//export const URL = "http://192.168.11.150:8000"
//export const URL = "https://wilofo-api.enumera.tech"
export const URL = process.env.REACT_APP_API_URL || "http://localhost:8080"
console.log(URL);

//export const URL = "https://wilofo-api.enumera.tech";
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