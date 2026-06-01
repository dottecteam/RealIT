import { api } from "./api";
import { API_ENDPOINTS } from "../../constants/routes";
import {
  User,
  CreateUserDTO,
  UpdateUserDTO,
  ServiceErrorResponse
} from "../../types/api/user";

export async function getUsers(): Promise<User[] | ServiceErrorResponse> {
  try {
    const response = await api.get<User[]>(API_ENDPOINTS.USERS.BASE);
    return response.data;
  } catch (error: any) {
    return {
      error: true,
      status: error?.response?.status,
      data: error?.response?.data
    };
  }
}

export async function createUser(data: CreateUserDTO): Promise<User | ServiceErrorResponse> {
  try {
    const response = await api.post<User>(API_ENDPOINTS.USERS.CREATE, data);
    return response.data;
  } catch (error: any) {
    console.error("ERRO BACKEND (CREATE USER):", error?.response?.data);
    return {
      error: true,
      data: error?.response?.data
    };
  }
}

export async function updateUser(
  id: number,
  data: UpdateUserDTO
): Promise<User | ServiceErrorResponse> {
  try {
    const response = await api.put<User>(API_ENDPOINTS.USERS.EDIT(id), data);
    return response.data;
  } catch (error: any) {
    console.error("ERRO UPDATE USER:", error?.response?.data);
    return {
      error: true,
      data: error?.response?.data
    };
  }
}

export async function inactivateUser(id: number): Promise<User> {
  const response = await api.patch<User>(API_ENDPOINTS.USERS.INACTIVATE(id), {});
  return response.data;
}

export async function activateUser(id: number): Promise<User> {
  const response = await api.patch<User>(API_ENDPOINTS.USERS.ACTIVATE(id), {});
  return response.data;
}

export async function getProfile(): Promise<User> {
  const response = await api.get<User>(API_ENDPOINTS.USERS.ME);
  return response.data;
}