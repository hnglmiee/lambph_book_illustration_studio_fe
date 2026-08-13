import apiClient from './client';

export const listProjectsApi = async () => {
  const response = await apiClient.get('/api/projects');
  return response.data;
};

export const getProjectApi = async (projectId) => {
  const response = await apiClient.get(`/api/projects/${projectId}`);
  return response.data;
};

export const createProjectApi = async ({ title, bookText, bookFile }) => {
  const formData = new FormData();
  formData.append('title', title);
  if (bookText) formData.append('bookText', bookText);
  if (bookFile) formData.append('bookFile', bookFile);

  const response = await apiClient.post('/api/projects', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// stepName: 'style' | 'characters' | 'portraits' | 'chapters' | 'illustrations'
export const runStepApi = async (projectId, stepName, body) => {
  const response = await apiClient.post(
    `/api/projects/${projectId}/steps/${stepName}/run`,
    body || {},
  );
  return response.data;
};

export const retryStepApi = async (projectId, body) => {
  const response = await apiClient.post(
    `/api/projects/${projectId}/steps/retry`,
    body || {},
  );
  return response.data;
};