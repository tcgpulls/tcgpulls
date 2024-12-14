export const getBaseUrl = (req?: any): string => {
  if (typeof window !== "undefined") {
    // Client-side: Use relative paths for API requests
    return "";
  }

  // Server-side: Use the origin of the incoming request
  if (req?.headers?.host) {
    const protocol = req.headers["x-forwarded-proto"] || "http";
    return `${protocol}://${req.headers.host}`;
  }

  // Fallback to environment variables for non-request contexts
  if (process.env.NEXT_PUBLIC_URL) {
    return process.env.NEXT_PUBLIC_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000"; // Default to localhost for local development
};
