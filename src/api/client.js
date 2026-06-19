import axios from "axios";

export const api = axios.create({
  baseURL: "https://retailiq-ecommerce-ml-backend.onrender.com",
});