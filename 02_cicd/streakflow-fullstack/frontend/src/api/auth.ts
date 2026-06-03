import apiClient, { API_URL } from '.';


export const signUpApi = async (payload: { fullName: string; email: string; password: string, confirmPassword: string }) => {
    return apiClient.post(`${API_URL}/auth/register`, payload, { withCredentials: true });
}


export const signInApi = async (payload: { email: string; password: string }) => {   
    return apiClient.post(`${API_URL}/auth/login`, payload, { withCredentials: true });
}


export const logoutApi = async () => {
    return apiClient.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
}


export const getCurrentUserApi = async () => {
    return apiClient.get(`${API_URL}/auth/me`, { withCredentials: true });
}