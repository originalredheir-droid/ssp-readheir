import api, { setAuthToken } from "./client";

interface LoginPayload {
  username: string;
  password: string;
}

interface RegisterPayload {
  username: string;
  password: string;
  email?: string;
  organization_name: string;
  organization_slug: string;
  role?: string;
}

export async function loginUser(payload: LoginPayload) {
  const response = await api.post("/auth/login/", payload);
  const token = response.data?.token;
  if (token) {
    setAuthToken(token);
    localStorage.setItem("ssp_token", token);
  }
  return response.data;
}

export async function registerUser(payload: RegisterPayload) {
  const response = await api.post("/auth/register/", payload);
  const token = response.data?.token;
  if (token) {
    setAuthToken(token);
    localStorage.setItem("ssp_token", token);
  }
  return response.data;
}

export function loadTokenFromStorage() {
  const token = localStorage.getItem("ssp_token");
  if (token) {
    setAuthToken(token);
  }
}
