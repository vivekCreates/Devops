import apiClient from '.';


const API_URL = import.meta.env.VITE_API_URL || 'http://13.60.170.161/api/v1';

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