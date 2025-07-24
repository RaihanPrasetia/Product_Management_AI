import { Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundImage: 'url(/img/404.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4,
            }}
        >
            <Container maxWidth="sm" sx={{
                textAlign: 'center',
                py: 6,
            }}>
                <Typography
                    variant="h1"
                    sx={{
                        fontWeight: 'bold',
                        background: 'linear-gradient(to right, #ec4899, #8b5cf6, #6366f1)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: { xs: '5rem', md: '8rem' },
                        mb: 2,
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                            '0%, 100%': { transform: 'scale(1)' },
                            '50%': { transform: 'scale(1.05)' },
                        },
                    }}
                >
                    404
                </Typography>

                <Typography variant="h5" color="text.primary" fontWeight="bold" gutterBottom>
                    Oops! Page not found.
                </Typography>

                <Typography variant="body1" color="text.secondary" mb={4}>
                    The page you're looking for doesn't exist or has been moved.
                </Typography>

                <Button
                    variant="contained"
                    onClick={handleBack}
                    size="large"
                    sx={{
                        background: 'linear-gradient(to right, #ec4899, #8b5cf6)',
                        color: 'white',
                        fontWeight: 'bold',
                        px: 4,
                        py: 1.5,
                        borderRadius: 3,
                        boxShadow: 4,
                        '&:hover': {
                            filter: 'brightness(1.1)',
                            transform: 'scale(1.05)',
                            transition: 'all 0.3s ease-in-out',
                        },
                    }}
                >
                    Go Back
                </Button>
            </Container>
        </Box>
    );
}
