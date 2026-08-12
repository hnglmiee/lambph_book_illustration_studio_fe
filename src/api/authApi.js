import apiClient from './client';

export const loginApi = async (email, name) => {
  const response = await apiClient.post('/api/auth/login', {
    email,
    name,
  });

  return response.data; // ApiResponse<{ id, email, name, token, createdAt }>
};

export default apiClient;