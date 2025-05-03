import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const verifyToken = async (token: string | null) => {
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/verify-token', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setIsAuthenticated(data.valid);
    } catch (err) {
      console.error('Verify token error:', err);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    verifyToken(token);
  }, []); // Run only on mount, rely on navigation to trigger re-evaluation

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;