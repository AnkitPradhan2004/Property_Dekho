import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // backend URL (no /api because backend mounts at root)
  withCredentials: true,
});

export default api;
