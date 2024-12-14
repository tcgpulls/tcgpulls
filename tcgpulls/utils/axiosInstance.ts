import axios from "axios";
import { getBaseUrl } from "@/utils/getBaseUrl";

const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Log outgoing requests
axiosInstance.interceptors.request.use(
  (config) => {
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

// Response Interceptor: Log incoming responses
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ Axios Response:");
    console.log(
      "🔗 URL:",
      `${response.config.baseURL ?? ""}${response.config.url ?? ""}`,
    );
    console.log("📜 Method:", response.config.method?.toUpperCase());
    console.log("📊 Status:", response.status);
    console.log("📦 Data:", response.data);

    return response;
  },
  (error) => {
    console.error("❌ Axios Response Error:");
    if (error.response) {
      console.error(
        "🔗 URL:",
        `${error.response.config.baseURL ?? ""}${error.response.config.url ?? ""}`,
      );
      console.error("📜 Method:", error.response.config.method?.toUpperCase());
      console.error("📊 Status:", error.response.status);
      console.error("📦 Data:", error.response.data || "No response data");
    } else {
      console.error("📜 Error Message:", error.message);
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
