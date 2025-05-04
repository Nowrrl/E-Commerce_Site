// src/api/adminAxios.js
import axios from "axios";

const adminAxios = axios.create({
  baseURL: "http://localhost:8085",
});

const token = localStorage.getItem("adminAuth");
if (token) {
  adminAxios.defaults.headers.common["Authorization"] = token;
}

export default adminAxios;
