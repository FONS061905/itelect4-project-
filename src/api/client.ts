import useAuthStore from "../store/authStore";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

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

  const response = await fetch(`${BASE_URL}${endpoint}`, {
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
