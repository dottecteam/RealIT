import { api } from "./api";

export async function getUsers() {
  try {
    const token = localStorage.getItem("@RealIT:token");

    const response = await api.get("/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error:any) {
    console.error(
      "Erro ao buscar usuários:",
      error?.response?.data || error
    );

    return [];
  }
}

export async function createUser(data:any) {
  const token = localStorage.getItem("@RealIT:token");

  try {

    const response = await api.post(
      "/users/create",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;

  } catch (error:any) {

    console.log(
      "ERRO BACKEND:",
      error?.response?.data
    );

    throw error;
  }
}

export async function updateUser(id:number, data:any) {
  const token = localStorage.getItem("@RealIT:token");

  try {
    const response = await api.put(
      `/users/edit/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error:any) {

    console.log(
      "ERRO UPDATE:",
      error?.response?.data
    );

    throw error;
  }
}

export async function inactivateUser(id:number) {
  const token = localStorage.getItem("@RealIT:token");

  const response = await api.patch(
    `/users/inactivate/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}