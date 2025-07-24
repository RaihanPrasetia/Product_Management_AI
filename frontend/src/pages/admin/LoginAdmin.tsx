import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import authService from '@/services/auth/authService';
import { useAuth } from '@/hooks/useAuth';
import { useNotification } from '@/hooks/useNotification'; // Import notifikasi
import ErrorMessage from '@/components/ErrorMessage';

function LoginAdmin() {
  const { login } = useAuth();
  const { showNotification } = useNotification(); // Gunakan notifikasi
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.loginUser(email, password);

      if (response?.token && response?.user) {
        if (response.user.role === 'ADMIN' || response.user.role === 'STAFF') {
          // Pastikan role Administrator (case sensitive)
          login(response.token, response.user.role);
          showNotification('Login berhasil! Selamat datang, Admin.', 'success');
          navigate('/admin/dashboard');
        } else {
          setError('Tidak memiliki izin akses sebagai Admin.');
          showNotification(
            'Role Anda tidak diizinkan mengakses halaman ini.',
            'error'
          );
        }
      } else {
        setError('Login gagal. Periksa kembali email dan password Anda.');
        showNotification('Login gagal.', 'error');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Terjadi kesalahan saat login.';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" fontWeight="bold" mb={2} textAlign="center">
          Admin Login
        </Typography>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{ mt: 2 }}
            disabled={isLoading}
            startIcon={
              isLoading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default LoginAdmin;
