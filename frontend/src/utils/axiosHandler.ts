import axios from "axios";
import cookie from "js-cookie";
// import { config } from 'dotenv';
// config()

const token = cookie.get('token');

const baseURL = process.env.backend_baseURl + '/api/v1';

export const axiosHandler = axios.create({
    baseURL,
    headers: { token }
    // withCredentials: true,
});


// const systemBaseURL = process.env.baseURL + '/api/v1';

export const systemAxios = axios.create({
    // baseURL: systemBaseURL,
    baseURL,
    headers: { token }
    // withCredentials: true,
})



// export function systemAxiosRequest(url, type, cookie){}