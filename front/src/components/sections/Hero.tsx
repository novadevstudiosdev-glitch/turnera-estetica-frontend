'use client';

import { Box, Button, Container, Typography } from '@mui/material';
import Image from 'next/image';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export function HeroSection() {
  const handleOpenReserva = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('open-reserva-modal'));
    }
  };

  return (
    <Box
      id="hero"
      component="section"
      sx={{
        position: 'relative',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <Image
        src="/portada.png"
        alt="Tratamiento de medicina estética"
        fill
        priority
        sizes="100vw"
        style={{ objectFit: 'cover', objectPosition: 'center' }}
      />

      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundImage:
            'linear-gradient(to right, rgba(255, 229, 236, 0.98) 0%, rgba(255, 229, 236, 0.95) 15%, rgba(255, 229, 236, 0.85) 25%, rgba(255, 229, 236, 0.6) 35%, rgba(255, 229, 236, 0.3) 45%, rgba(255, 229, 236, 0.1) 52%, rgba(255, 229, 236, 0) 60%), radial-gradient(circle at 20% 20%, rgba(245, 230, 232, 0.2) 0%, rgba(245, 230, 232, 0) 65%)',
          opacity: { xs: 1, md: 1 },
          pointerEvents: 'none',
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Box
          sx={{
            maxWidth: { xs: '100%', md: '600px' },
            pl: { xs: 4, md: 10 },
            pr: { xs: 4, md: 4 },
            animation: 'fadeUp 0.9s ease both',
            '@keyframes fadeUp': {
              from: { opacity: 0, transform: 'translateY(16px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: { xs: '2.625rem', md: '3.625rem' },
              color: '#2C2C2C',
              lineHeight: 1.2,
              letterSpacing: '0.02em',
              fontWeight: 600,
            }}
          >
            Resultados naturales, cuidado profesional
          </Typography>
          <Typography
            sx={{
              mt: 2,
              fontFamily: 'Poppins, sans-serif',
              fontSize: { xs: '1rem', md: '1.125rem' },
              color: '#3D3D3D',
              maxWidth: 520,
            }}
          >
            Tratamientos de medicina estética diseñados para realzar tu belleza de forma sutil,
            segura y armónica.
          </Typography>

          <Button
            variant="contained"
            size="large"
            startIcon={<CalendarMonthIcon />}
            onClick={handleOpenReserva}
            sx={{
              mt: 4,
              borderRadius: '30px',
              px: '40px',
              py: '18px',
              backgroundColor: '#EEBBC3',
              color: '#2C2C2C',
              fontWeight: 500,
              textTransform: 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#FFB8C6',
                transform: 'translateY(-3px)',
                boxShadow: '0 14px 26px rgba(238, 187, 195, 0.35)',
              },
            }}
          >
            Reservar turno online
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
            <CheckCircleOutlineIcon sx={{ color: '#D4A5A5', fontSize: '18px' }} />
            <Typography sx={{ color: '#666666', fontSize: '0.875rem' }}>
              Agendá tu cita en menos de 30 segundos
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
