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

    return {
      error: true,
      status: error?.response?.status,
      data: error?.response?.data
    };
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
    console.log("ERRO BACKEND:", error?.response?.data);

    return {
      error: true,
      data: error?.response?.data
    };
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

    return {
      error: true,
      data: error?.response?.data
    };
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

export async function activateUser(id:number) {
  const token = localStorage.getItem("@RealIT:token");

  const response = await api.patch(
    `/users/activate/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function getProfile() {
  const token = localStorage.getItem("@RealIT:token");

  const response = await api.get(
    "/users/me",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}