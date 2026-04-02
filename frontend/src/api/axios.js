import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api` , // backend URL from .env
    withCredentials: true, // important if using auth
});

export default api;