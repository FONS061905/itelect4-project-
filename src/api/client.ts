import useAuthStore from "../store/authStore";

// The backend's address, from .env locally and from Vercel's settings
// when deployed. Vite bakes it in at build time, so changing it means
// rebuilding. No fallback: a missing value should say so, not quietly
// call somebody's laptop.
export const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error(
    "VITE_API_URL is missing. Copy .env.example to .env, fill it in, " +
      "and restart npm run dev.",
  );
}

// Every request goes through here: it adds the JSON header, the
// Bearer token when someone is logged in, and turns error replies into
// thrown Errors carrying the server's own message.
export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = useAuthStore.getState().token;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // An expired or invalid token -- sign out so ProtectedRoute sends
    // the user back to the login page.
    if (response.status === 401 && token) {
      useAuthStore.getState().logout();
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  // DELETE replies 204 with no body.
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}
