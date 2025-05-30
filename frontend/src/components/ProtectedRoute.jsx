import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, userType, redirectPath }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const [localUser, setLocalUser] = useState(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Directly check localStorage in case context hasn't updated yet
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setLocalUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
      }
    }
    setIsChecking(false);
  }, []);

  if (loading || isChecking) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div className="spinner" style={{
          width: '50px',
          height: '50px',
          border: '5px solid rgba(0, 0, 0, 0.1)',
          borderTopColor: '#3498db',
          borderRadius: '50%',
          animation: 'spin 1s ease-in-out infinite'
        }}></div>
        <p>Loading...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Check if user is logged in and has correct role
  const isAuthorized = () => {
    // First check context user
    if (user) {
      if (userType === 'both') {
        return ['company', 'interviewer'].includes(user.role);
      }
      return user.role === userType;
    }
    
    // Fallback to localStorage
    if (localUser) {
      if (userType === 'both') {
        return ['company', 'interviewer'].includes(localUser.role);
      }
      return localUser.role === userType;
    }
    
    return false;
  };

  if (!isAuthorized()) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;

