import axios from 'axios';

//export const URL = "http://127.0.0.1:8000/"
export const URL = "https://api.enumera.tech/"

const request = axios.create({
    baseURL: URL+"api/",
    withCredentials: false,
    headers: {
        'Accept':'application/json',
        'Content-Type': 'application/json'
    },
});



export default request