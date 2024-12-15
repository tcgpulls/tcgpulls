import axios from "axios";
import { headers as getHeaders } from "next/headers";

const axiosInstance = axios.create({
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor for server-side requests
axiosInstance.interceptors.request.use(
  async (config) => {
    if (typeof window === "undefined") {
      // Server-side: Add headers dynamically
      const headers = await getHeaders(); // Extract headers from the request
      const host = headers.get("host");
      const protocol = headers.get("x-forwarded-proto") || "http";
      const cookie = headers.get("cookie");

      // Set baseURL dynamically
      config.baseURL = `${protocol}://${host}`;
      if (cookie) {
        config.headers.cookie = cookie; // Pass user cookies for authentication
      }
    }

    console.log("🚀 Axios Request:");
    console.log("🔗 URL:", `${config.baseURL ?? ""}${config.url ?? ""}`);
    console.log("📜 Method:", config.method?.toUpperCase());
    console.log("📊 Params:", config.params || "None");
    console.log("📦 Data:", config.data || "None");
    console.log("🛡️ Headers:", config.headers);

    return config;
  },
  (error) => {
    console.error("❌ Axios Request Error:", error.message);
    return Promise.reject(error);
  },
);

export default axiosInstance;
