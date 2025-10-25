import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Get recent incomplete tasks (max 5)
 */
export const getRecentTasks = async () => {
  const response = await api.get('/tasks');
  return response.data.data;
};

/**
 * Create a new task
 */
export const createTask = async (taskData) => {
  const response = await api.post('/tasks', taskData);
  return response.data.data;
};

/**
 * Mark a task as completed
 */
export const completeTask = async (taskId) => {
  const response = await api.put(`/tasks/${taskId}/complete`);
  return response.data.data;
};

/**
 * Get a task by ID
 */
export const getTaskById = async (taskId) => {
  const response = await api.get(`/tasks/${taskId}`);
  return response.data.data;
};

/**
 * Delete a task
 */
export const deleteTask = async (taskId) => {
  const response = await api.delete(`/tasks/${taskId}`);
  return response.data;
};

export default api;
