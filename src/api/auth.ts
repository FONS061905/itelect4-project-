import { apiFetch } from "./client";
import type { ApiUser, AuthResponse } from "../models";

export async function loginApi(credentials: { email: string; password: string }): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

// The backend replies with the new user only -- log in afterwards to get a token.
export async function registerApi(userData: { name: string; email: string; password: string }): Promise<ApiUser> {
  return apiFetch<ApiUser>("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}
