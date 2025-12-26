import React, { useState, useEffect } from 'react';
import { getComplaints, createComplaint, updateComplaintStatus, assignComplaint } from '../api/complaint.api';
import { getResolvers } from '../api/user.api';
import { useAuth } from '../context/AuthContext';

const ComplaintsPage = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [resolvers, setResolvers] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
    if (user?.role === 'ADMIN') {
      fetchResolvers();
    }
  }, [user]);

  const fetchComplaints = async () => {
    try {
      const data = await getComplaints();
      setComplaints(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch complaints');
      setLoading(false);
    }
  };

  const fetchResolvers = async () => {
    try {
      const data = await getResolvers();
      setResolvers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch resolvers');
    }
  };

  const handleCreateComplaint = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createComplaint(title, description);
      setTitle('');
      setDescription('');
      fetchComplaints();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create complaint');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    setError('');
    try {
      await updateComplaintStatus(id, status);
      fetchComplaints();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleAssign = async (complaintId, resolverId) => {
    setError('');
    try {
      await assignComplaint(complaintId, resolverId);
      fetchComplaints();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign complaint');
    }
  };

  const handleMarkDone = async (id) => {
    setError('');
    try {
      await updateComplaintStatus(id, 'DONE');
      fetchComplaints();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark as done');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  const getStatusClass = (status) => {
    const statusMap = {
      'PENDING': 'status-pending',
      'IN_PROGRESS': 'status-in-progress',
      'RECHECK': 'status-recheck',
      'DONE': 'status-done'
    };
    return statusMap[status] || '';
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Complaints</h1>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {user?.role === 'USER' && (
        <div className="form-section">
          <h2>Create Complaint</h2>
          <form onSubmit={handleCreateComplaint}>
            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <button className="btn-primary" type="submit">Create Complaint</button>
          </form>
        </div>
      )}

      <div className="table-container">
        <h2>Complaints List</h2>
        {complaints.length === 0 ? (
          <p>No complaints found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                {user?.role === 'ADMIN' && <th>Assigned To</th>}
                {(user?.role === 'ADMIN' || user?.role === 'RESOLVER') && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint.id}>
                  <td>{complaint.id}</td>
                  <td>{complaint.title}</td>
                  <td>{complaint.description}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </td>
                  {user?.role === 'ADMIN' && (
                    <>
                      <td>{complaint.resolverId || 'Unassigned'}</td>
                      <td>
                        <div className="action-buttons">
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                handleAssign(complaint.id, e.target.value);
                              }
                            }}
                            defaultValue=""
                          >
                            <option value="">Assign Resolver</option>
                            {resolvers.map((resolver) => (
                              <option key={resolver.id} value={resolver.id}>
                                {resolver.name}
                              </option>
                            ))}
                          </select>
                          {complaint.status !== 'DONE' && (
                            <button className="btn btn-success" onClick={() => handleMarkDone(complaint.id)}>
                              Mark as Done
                            </button>
                          )}
                        </div>
                      </td>
                    </>
                  )}
                  {user?.role === 'RESOLVER' && (
                    <td>
                      <div className="action-buttons">
                        {complaint.status === 'PENDING' && (
                          <button className="btn btn-info" onClick={() => handleStatusUpdate(complaint.id, 'IN_PROGRESS')}>
                            Start
                          </button>
                        )}
                        {complaint.status === 'IN_PROGRESS' && (
                          <button className="btn btn-warning" onClick={() => handleStatusUpdate(complaint.id, 'RECHECK')}>
                            Request Recheck
                          </button>
                        )}
                        {complaint.status === 'RECHECK' && (
                          <button className="btn btn-info" onClick={() => handleStatusUpdate(complaint.id, 'IN_PROGRESS')}>
                            Resume
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ComplaintsPage;

