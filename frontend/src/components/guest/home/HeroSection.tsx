// src/components/guest/home/HeroSection.jsx

import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
// Impor hook yang dibutuhkan dari Framer Motion
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function HeroSection() {
  const navigate = useNavigate();
  const targetRef = useRef<HTMLDivElement>(null); // Ref untuk menargetkan section ini

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '150%']);

  // Arahkan ke halaman menu
  const handleViewMenu = () => {
    navigate('/menu'); // <-- Ganti ke /menu atau #products
  };

  const MotionBox = motion(Box);

  return (
    <Box
      ref={targetRef} // <-- Terapkan ref di sini
      sx={{
        height: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Background dengan efek paralaks */}
      <MotionBox
        style={{ y: backgroundY }} // <-- Terapkan transformasi y
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url('/img/bg-hero.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1,
        }}
      />

      {/* Overlay tetap sama */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.8) 100%)',
          zIndex: 2,
        }}
      />

      {/* Konten teks dengan efek paralaks */}
      <motion.div
        style={{ y: textY }} // <-- Terapkan transformasi y
        className="relative z-[3] text-center"
      >
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          >
            <Typography
              variant="h2"
              color="white"
              fontWeight="bold"
              gutterBottom
              sx={{
                textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
                fontSize: { xs: '2.8rem', sm: '4rem', md: '5rem' },
              }}
            >
              {/* COPYWRITING BARU */}
              Setiap Cicipan, Sebuah Cerita Baru.
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
          >
            <Typography
              variant="h6"
              component="p"
              color="rgba(255, 255, 255, 0.9)"
              mb={4}
              sx={{ maxWidth: '600px', margin: '0 auto 32px auto' }}
            >
              {/* COPYWRITING BARU */}
              Nikmati racikan kopi terbaik, hidangan lezat, dan suasana hangat
              yang kami siapkan khusus untuk Anda.
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.9 }}
            whileHover={{ scale: 1.05 }} // <-- Animasi saat hover
            whileTap={{ scale: 0.95 }} // <-- Animasi saat klik
          >
            <Button
              variant="contained"
              size="large"
              onClick={handleViewMenu} // <-- Fungsi diubah
              sx={{
                fontWeight: 'bold',
                fontSize: '1rem',
                px: 5,
                py: 1.5,
                borderRadius: '50px',
                background: 'linear-gradient(45deg, #FFC107 30%, #FF8F00 90%)', // Warna lebih hangat (kuning/oranye)
                color: 'black',
                boxShadow: '0 3px 5px 2px rgba(255, 179, 0, .3)',
                '&:hover': {
                  boxShadow: '0 6px 10px 4px rgba(255, 179, 0, .3)',
                },
              }}
            >
              {/* CTA BARU */}
              Lihat Menu
            </Button>
          </motion.div>
        </Container>
      </motion.div>
    </Box>
  );
}
