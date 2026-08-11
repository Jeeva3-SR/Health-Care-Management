import api from '../lib/api';

export const getNotifications = async () => {
  const res = await api.get('/api/notifications');
  return res.data;
};

export const markAsRead = async (id) => {
  const res = await api.put(`/api/notifications/${id}/read`);
  return res.data;
};

export const markAllAsRead = async () => {
  const res = await api.put('/api/notifications/read-all');
  return res.data;
};

const notificationService = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};

export default notificationService;
