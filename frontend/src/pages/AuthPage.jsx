import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginApi, register as registerApi } from '../api/auth.api';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        const response = await loginApi(email, password);
        login(response.token, response.role, response.userId);
        
        if (response.role === 'ADMIN') {
          navigate('/admin/users');
        } else {
          navigate('/complaints');
        }
      } else {
        await registerApi(name, email, password);
        const response = await loginApi(email, password);
        login(response.token, response.role, response.userId);
        navigate('/complaints');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>{isLogin ? 'Login' : 'Register'}</h1>
        <div className="auth-toggle">
          <button className="btn-toggle" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Switch to Register' : 'Switch to Login'}
          </button>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
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
          {error && <div className="error-message">{error}</div>}
          <button className="btn-primary" type="submit">{isLogin ? 'Login' : 'Register'}</button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;

