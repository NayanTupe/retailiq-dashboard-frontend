import axios from "axios";

export const api = axios.create({
  baseURL: "https://retailiq-api-yzso.onrender.com",
});