export const getBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_URL) {
    // Custom domain or explicit base URL provided
    return process.env.NEXT_PUBLIC_URL;
  }

  if (process.env.VERCEL_URL) {
    // Default to Vercel's deployment subdomain
    return `https://${process.env.VERCEL_URL}`;
  }

  // Default to localhost for local development
  return "http://localhost:3000";
};
