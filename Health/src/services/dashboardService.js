import api from '../lib/api';

export const getAdminStats = async () => {
  const res = await api.get('/api/dashboard/admin/stats');
  return res.data;
};

export const getDoctorStats = async () => {
  const res = await api.get('/api/dashboard/doctor/stats');
  return res.data;
};

export const getPatientStats = async () => {
  const res = await api.get('/api/dashboard/patient/stats');
  return res.data;
};

const dashboardService = {
  getAdminStats,
  getDoctorStats,
  getPatientStats,
};

export default dashboardService;
