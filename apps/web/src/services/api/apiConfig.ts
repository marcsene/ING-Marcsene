export const API_URL =
  import.meta.env.VITE_API_URL ??
  "https://ing-marcsene-api.onrender.com/api";

export function getAccessToken(): string | null {
  return localStorage.getItem("access_token");
}