import api, { setAuthToken } from "./client";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  organization?: Organization | null;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  password: string;
  email?: string;
  organization_name: string;
  organization_slug: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/login/", payload);
  const token = response.data?.token;
  if (token) {
    setAuthToken(token);
    localStorage.setItem("ssp_token", token);
  }
  return response.data;
}

export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/register/", payload);
  const token = response.data?.token;
  if (token) {
    setAuthToken(token);
    localStorage.setItem("ssp_token", token);
  }
  return response.data;
}

export async function fetchCurrentUser(): Promise<User> {
  const response = await api.get<User>("/auth/me/");
  return response.data;
}

export function logoutUser() {
  localStorage.removeItem("ssp_token");
  setAuthToken(null);
}

export function loadTokenFromStorage(): string | null {
  const token = localStorage.getItem("ssp_token");
  if (token) {
    setAuthToken(token);
    return token;
  }
  return null;
}
