import axios from "axios";

const api = axios.create({
  baseURL: "https://jobportal-backend-i26p.onrender.com/api/",
});

export default api;