import apiClient from ".";

export const signUpApi = async (payload: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  return apiClient.post("/auth/register", payload);
};

export const signInApi = async (payload: {
  email: string;
  password: string;
}) => {
  return apiClient.post("/auth/login", payload);
};

export const refreshApi = async (refreshToken: string) => {
  return apiClient.post("/auth/refresh", { refreshToken });
};

export const logoutApi = async (refreshToken?: string) => {
  return apiClient.post("/auth/logout", { refreshToken: refreshToken || "" });
};

export const getCurrentUserApi = async () => {
  return apiClient.get("/auth/me");
};