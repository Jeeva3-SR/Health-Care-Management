import api from '../lib/api';

export const login = async (username, password) => {
  const response = await api.post('/api/auth/login', { username, password });
  return response.data;
};

export const registerPatient = async (data) => {
  const response = await api.post('/api/auth/register/patient', data);
  return response.data;
};

export const registerDoctor = async (formData) => {
  const response = await api.post('/api/auth/doctors/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const changePassword = async (oldPassword, newPassword) => {
  const response = await api.put('/api/auth/change-password', { oldPassword, newPassword });
  return response.data;
};

export const logout = () => {
  localStorage.clear();
};

const authService = {
  login,
  registerPatient,
  registerDoctor,
  changePassword,
  logout,
};

export default authService;
