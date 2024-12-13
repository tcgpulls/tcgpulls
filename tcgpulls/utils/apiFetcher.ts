// utils/fetcher.ts
import { getBaseUrl } from "@/utils/getBaseUrl";

export const apiFetcher = async (path: string, options?: RequestInit) => {
  const baseUrl = getBaseUrl();

  const url = path.startsWith("/") ? `${baseUrl}${path}` : path;

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }

  return response.json();
};
