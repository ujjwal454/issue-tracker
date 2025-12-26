import React, { useState, useEffect } from 'react';
import { getResolvers, createResolver, deleteUser } from '../api/user.api';
import { useAuth } from '../context/AuthContext';

const AdminUsersPage = () => {
  const { user } = useAuth();
  const [resolvers, setResolvers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResolvers();
  }, []);

  const fetchResolvers = async () => {
    try {
      const data = await getResolvers();
      setResolvers(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch resolvers');
      setLoading(false);
    }
  };

  const handleCreateResolver = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createResolver(name, email, password);
      setName('');
      setEmail('');
      setPassword('');
      fetchResolvers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create resolver');
    }
  };

  const handleDeleteResolver = async (id) => {
    setError('');
    if (!window.confirm('Are you sure you want to remove this resolver?')) {
      return;
    }
    try {
      await deleteUser(id);
      fetchResolvers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove resolver');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Admin - Manage Resolvers</h1>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-section">
        <h2>Add Resolver</h2>
        <form onSubmit={handleCreateResolver}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn-primary" type="submit">Add Resolver</button>
        </form>
      </div>

      <div className="table-container">
        <h2>Resolvers List</h2>
        {resolvers.length === 0 ? (
          <p>No resolvers found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resolvers.map((resolver) => (
                <tr key={resolver.id}>
                  <td>{resolver.id}</td>
                  <td>{resolver.name}</td>
                  <td>{resolver.email}</td>
                  <td>
                    <button className="btn btn-danger" onClick={() => handleDeleteResolver(resolver.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;

