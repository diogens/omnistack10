import axios from "axios";

const api = axios.create({
  /* baseURL: "http://10.11.0.27:3333" */
    baseURL: "http://192.168.1.105:3333" 
});

export default api;
