import api from '../lib/api';

export const getAppointments = async () => {
  const res = await api.get('/api/doctor/appointments');
  return res.data;
};

export const getPatients = async () => {
  const res = await api.get('/api/doctor/patients');
  return res.data;
};

export const updateAppointmentStatus = async (id, status) => {
  const res = await api.put(`/api/doctor/appointments/${id}/status?status=${status}`);
  return res.data;
};

const doctorService = {
  getAppointments,
  getDoctorAppointments: getAppointments,
  getPatients,
  getDoctorPatients: getPatients,
  updateAppointmentStatus,
};

export default doctorService;
