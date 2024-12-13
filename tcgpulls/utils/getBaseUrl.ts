export const getBaseUrl = (): string => {
  if (process.env.VERCEL_URL) {
    // Vercel automatically provides this environment variable in deployments
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.NEXT_PUBLIC_URL) {
    // Custom domain or base URL provided explicitly by you
    return process.env.NEXT_PUBLIC_URL;
  }

  // Default to localhost for local development
  return "http://localhost:3000";
};
