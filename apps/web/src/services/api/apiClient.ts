
import { API_URL } from "./apiConfig";

let refreshPromise: Promise<string | null> | null = null;

function getAccessToken(): string | null {
  return localStorage.getItem("access_token");
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem("refresh_token");

  if (!refreshToken) {
    return null;
  }

  if (!refreshPromise) {
    refreshPromise = fetch(`${API_URL}/auth/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    })
      .then(async (response) => {
        if (!response.ok) {
          return null;
        }

        const data: { access?: string } = await response.json();

        if (!data.access) {
          return null;
        }

        localStorage.setItem("access_token", data.access);
        return data.access;
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const sendRequest = (token: string | null) => {
    const headers = new Headers(options.headers);

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });
  };

  const response = await sendRequest(getAccessToken());

  if (response.status !== 401) {
    return response;
  }

  const newToken = await refreshAccessToken();

  if (!newToken) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    window.dispatchEvent(new Event("auth:expired"));

    return response;
  }

  return sendRequest(newToken);
}
