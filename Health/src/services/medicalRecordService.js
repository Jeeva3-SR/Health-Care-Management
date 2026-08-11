import api from '../lib/api';

export const getPatientRecords = async () => {
  const res = await api.get('/api/medical-records/patient');
  return res.data;
};

export const getDoctorRecords = async () => {
  const res = await api.get('/api/medical-records/doctor');
  return res.data;
};

export const createRecord = async (data) => {
  const res = await api.post('/api/medical-records', data);
  return res.data;
};

const medicalRecordService = {
  getPatientRecords,
  getDoctorRecords,
  createRecord,
};

export default medicalRecordService;
