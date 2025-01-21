import axios from "axios";
import { headers as getHeaders } from "next/headers";
import serverLog from "./serverLog";

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

    serverLog("🚀 Axios Request:");
    serverLog("🔗 URL:", `${config.baseURL ?? ""}${config.url ?? ""}`);
    serverLog("📜 Method:", config.method?.toUpperCase());
    serverLog("📊 Params:", config.params || "None");
    serverLog("📦 Data:", config.data || "None");
    serverLog("🛡️ Headers:", config.headers);

    return config;
  },
  (error) => {
    serverLog("error", "❌ Axios Request Error:", error.message);
    return Promise.reject(error);
  },
);

export default axiosInstance;
