import { api } from './api';
import { AUTH_TOKEN_KEY, USER_DATA_KEY } from "../../constants/keys";
import { API_ENDPOINTS } from "../../constants/routes";

export async function signIn(email: string, password: string) {
  const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });

  const { token, user } = response.data;

  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));

  return response.data;
}