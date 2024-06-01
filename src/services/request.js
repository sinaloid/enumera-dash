import axios from 'axios';

export const URL = "http://137.184.36.201:4400/"
const request = axios.create({
    baseURL: URL,
    withCredentials: false,
    headers: {
        'Accept':'application/json',
        'Content-Type': 'application/json'
    },
});



export default request