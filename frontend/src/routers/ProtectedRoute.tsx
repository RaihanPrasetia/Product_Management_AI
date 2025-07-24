import { Navigate, useLocation } from 'react-router-dom';
import { JSX, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Box, CircularProgress } from '@mui/material';
import { FaSpinner } from 'react-icons/fa';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedRole = localStorage.getItem('role');

    if (!storedToken || !storedRole) {
      setLoading(false);
      return;
    }

    setLoading(false);
  }, [location.pathname]);

  if (loading) {
    return (
      <Box className="w-full h-screen flex flex-col justify-center items-center gap-4">
        <CircularProgress color="primary" size={50} />
        <FaSpinner className="animate-spin text-primary text-3xl" />
        <p className="text-gray-600 text-lg">Loading...</p>
      </Box>
    );
  }

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
