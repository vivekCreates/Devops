import apiClient, { API_URL } from ".";



export const createHabit = async (habitData: { name: string; icon: string }) => {
    return apiClient.post(`${API_URL}/habits`, habitData);
}

export const completeHabit = async (habitId: string) => {
    return apiClient.post(`${API_URL}/habits/${habitId}/complete-today`);
}

export const getHabits = async () => {
    return apiClient.get(`${API_URL}/habits`);
}

export const updateHabit = async (habitId: string, habitData: { name?: string; icon?: string }) => {
    return apiClient.patch(`${API_URL}/habits/${habitId}`, habitData);
}

export const deleteHabit = async (habitId: string) => { 
    return apiClient.delete(`${API_URL}/habits/${habitId}`);
}