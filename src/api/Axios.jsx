import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL

console.log(backendUrl)

const axiosInstance = axios.create({
    baseURL: backendUrl,
    withCredentials:true,
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
    },
})


export default axiosInstance