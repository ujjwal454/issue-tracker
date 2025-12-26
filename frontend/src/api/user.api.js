import api from './axios';

export const getResolvers = async () => {
  const response = await api.get('/users/resolvers');
  return response.data;
};

export const createResolver = async (name, email, password) => {
  const response = await api.post('/users/resolver', { name, email, password });
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

