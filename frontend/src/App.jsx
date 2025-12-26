import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Header from './components/Header';
import AuthPage from './pages/AuthPage';
import ComplaintsPage from './pages/ComplaintsPage';
import AdminUsersPage from './pages/AdminUsersPage';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <div className="page-container">
      <Header />
      <Routes>
        <Route
          path="/auth"
          element={user ? <Navigate to={user.role === 'ADMIN' ? '/admin/users' : '/complaints'} replace /> : <AuthPage />}
        />
        <Route
          path="/complaints"
          element={
            <ProtectedRoute>
              <ComplaintsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to={user ? (user.role === 'ADMIN' ? '/admin/users' : '/complaints') : '/auth'} replace />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

