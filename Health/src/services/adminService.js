import api from '../lib/api';

export const getAllDoctors = async () => {
  const res = await api.get('/api/admin/doctors');
  return res.data;
};

export const getAllPatients = async () => {
  const res = await api.get('/api/admin/patients');
  return res.data;
};

export const getAllAppointments = async () => {
  const res = await api.get('/api/admin/appointments');
  return res.data;
};

export const approveDoctor = async (id) => {
  const res = await api.put(`/api/admin/doctors/approve/${id}`);
  return res.data;
};

export const rejectDoctor = async (id) => {
  const res = await api.put(`/api/admin/doctors/reject/${id}`);
  return res.data;
};

const adminService = {
  getAllDoctors,
  getAllPatients,
  getAllAppointments,
  approveDoctor,
  rejectDoctor,
};

export default adminService;
