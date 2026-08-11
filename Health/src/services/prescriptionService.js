import api from '../lib/api';

export const getPatientPrescriptions = async () => {
  const res = await api.get('/api/prescriptions/patient');
  return res.data;
};

export const getDoctorPrescriptions = async () => {
  const res = await api.get('/api/prescriptions/doctor');
  return res.data;
};

export const createPrescription = async (data) => {
  const res = await api.post('/api/prescriptions', data);
  return res.data;
};

const prescriptionService = {
  getPatientPrescriptions,
  getDoctorPrescriptions,
  createPrescription,
};

export default prescriptionService;
