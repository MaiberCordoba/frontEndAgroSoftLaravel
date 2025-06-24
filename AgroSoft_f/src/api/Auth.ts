import apiClient from "./apiClient.ts";

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  console.log("URL completa:", import.meta.env.VITE_API_URL + "login");
  try {
    const response = await apiClient.post(
      "usuarios/login",
      {
        correoElectronico: email,
        passwordHash: password,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Error de autenticación:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.detail || "Error en el login");
  }
};

export const getUser = async (token: string) => {
  try {
    const response = await apiClient.get("usuarios/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Error obteniendo usuario:",
      error.response?.status,
      error.response?.data
    );
    throw error;
  }
};
