import axios from "axios";
import { headers as getHeaders } from "next/headers";
import customLog from "@/utils/customLog";

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

    customLog("🚀 Axios Request:");
    customLog("🔗 URL:", `${config.baseURL ?? ""}${config.url ?? ""}`);
    customLog("📜 Method:", config.method?.toUpperCase());
    customLog("📊 Params:", config.params || "None");
    customLog("📦 Data:", config.data || "None");
    customLog("🛡️ Headers:", config.headers);

    return config;
  },
  (error) => {
    customLog("error", "❌ Axios Request Error:", error.message);
    return Promise.reject(error);
  },
);

export default axiosInstance;
