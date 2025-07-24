import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import authService from '@/services/auth/authService';
import { useAuth } from '@/hooks/useAuth';
import { useNotification } from '@/hooks/useNotification';
import ErrorMessage from '@/components/ErrorMessage';

function Login() {
  const { login } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError('Email tidak valid.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.loginUser(email, password);

      if (response?.token && response?.user) {
        if (
          response.user.role === 'ADMIN' ||
          response.user.role === 'STAFF_GUDANG'
        ) {
          login(response.token, response.user.role);
          showNotification(`Login berhasil! Selamat datang`, 'success');
          navigate('/dashboard');
        } else {
          showNotification(`Tidak memiliki Akses`, 'info');
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Terjadi kesalahan saat login.';
      showNotification(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box display="flex" minHeight="100vh" bgcolor="#f0f2f5">
      {/* Left side - Form */}
      <div className=" md:w-2/5 w-full flex px-5 justify-center items-center ">
        <Paper
          elevation={6}
          sx={{
            p: 5,
            width: 400,
            borderRadius: 4,
            bgcolor: 'transparent',
            border: 'none',
            boxShadow: 'none',
          }}
        >
          <Typography variant="h4" fontWeight="bold" textAlign="center">
            Welcome Back
          </Typography>
          <Typography
            variant="subtitle1"
            textAlign="center"
            color="text.secondary"
          >
            Login to your account
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
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              className="bg-utama"
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                py: 1.5,
              }}
              disabled={isLoading}
              startIcon={
                isLoading ? (
                  <CircularProgress
                    size={20}
                    sx={{ color: 'white' }} // Ganti warna ke putih atau warna lain sesuai kebutuhan
                  />
                ) : null
              }
            >
              <span className={`font-bold text-white`}>
                {isLoading ? 'Logging in...' : 'Login'}
              </span>
            </Button>
          </form>
        </Paper>
      </div>

      {/* Right side - Image */}
      {/* Right side - Image */}
      <Box
        flex={1}
        width={'100%'}
        display={{ xs: 'none', md: 'flex' }}
        justifyContent="center"
        alignItems="center"
        bgcolor="#c019d2"
        sx={{
          backgroundImage: "url('/img/login-image.png')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Kalau mau tambah efek gelap bisa tambahkan Box di dalam sini */}
      </Box>
    </Box>
  );
}

export default Login;
