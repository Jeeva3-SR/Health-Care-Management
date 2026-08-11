import api from '../lib/api';

export const getAppointments = async () => {
  const res = await api.get('/api/patient/appointments');
  return res.data;
};

export const getDoctors = async () => {
  const res = await api.get('/api/patient/doctors');
  return res.data;
};

export const bookAppointment = async (data) => {
  const res = await api.post('/api/patient/appointments', data);
  return res.data;
};

export const cancelAppointment = async (id) => {
  const res = await api.put(`/api/patient/appointments/${id}/cancel`);
  return res.data;
};

const patientService = {
  getAppointments,
  getPatientAppointments: getAppointments,
  getDoctors,
  getPatientDoctors: getDoctors,
  bookAppointment,
  cancelAppointment,
};

export default patientService;
