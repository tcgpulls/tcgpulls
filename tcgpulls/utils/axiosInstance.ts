import axios from "axios";
import { getBaseUrl } from "@/utils/getBaseUrl";

const axiosInstance = axios.create({
  baseURL: getBaseUrl(), // Set the base URL
  timeout: 10000, // Optional: Set a timeout (in milliseconds)
  headers: {
    "Content-Type": "application/json", // Optional: Default content type
  },
});

// Optional: Add interceptors for request/response handling
axiosInstance.interceptors.request.use(
  (config) => {
    // Add authorization token or other headers here
    // Example:
    // config.headers.Authorization = `Bearer YOUR_TOKEN`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
