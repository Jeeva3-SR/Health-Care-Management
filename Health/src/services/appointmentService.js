import api from '../lib/api';

export const bookAppointment = async (data) => {
  const res = await api.post('/api/appointments/book', data);
  return res.data;
};

export const getPatientHistory = async () => {
  const res = await api.get('/api/appointments/patient/history');
  return res.data;
};

const appointmentService = {
  bookAppointment,
  getPatientHistory,
};

export default appointmentService;
