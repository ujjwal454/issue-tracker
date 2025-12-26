import api from './axios';

export const getComplaints = async () => {
  const response = await api.get('/complaints');
  return response.data;
};

export const createComplaint = async (title, description) => {
  const response = await api.post('/complaints', { title, description });
  return response.data;
};

export const updateComplaintStatus = async (id, status) => {
  const response = await api.patch(`/complaints/${id}/status`, { status });
  return response.data;
};

export const assignComplaint = async (id, resolverId) => {
  const response = await api.patch(`/complaints/${id}/assign`, { resolverId });
  return response.data;
};

