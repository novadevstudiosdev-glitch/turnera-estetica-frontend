'use client';

import { Box, Button, Container, Typography } from '@mui/material';
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
        minHeight: '100vh',
        overflow: 'hidden',
        backgroundImage: 'url(/DOCTORA%20JAQUELINE%20GRASETTI.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          minHeight: '100vh',
          py: { xs: 8, md: 12 },
        }}
      >
        <Box
          sx={{
            maxWidth: { xs: '100%', md: 380 },
            pl: { xs: 2, sm: 3, md: '1vw' },
            pr: { xs: 2, sm: 4, md: 4 },
            animation: 'fadeLeft 0.7s ease both',
            '@keyframes fadeLeft': {
              from: { opacity: 0, transform: 'translateX(-30px)' },
              to: { opacity: 1, transform: 'translateX(0)' },
            },
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontFamily: '"Cormorant Garamond", "Playfair Display", serif',
              fontSize: 'clamp(34px, 4.3vw, 60px)',
              color: '#2C2C2C',
              lineHeight: 1.15,
              letterSpacing: '0.02em',
              fontWeight: 300,
            }}
          >
            <Box
              component="span"
              sx={{ display: 'block', whiteSpace: { xs: 'normal', md: 'nowrap' } }}
            >
              Resultados naturales,
            </Box>
            <Box
              component="span"
              sx={{ display: 'block', whiteSpace: { xs: 'normal', md: 'nowrap' } }}
            >
              cuidado profesional
            </Box>
          </Typography>
          <Typography
            sx={{
              mt: 2,
              fontFamily: '"Lato", "Raleway", "Poppins", sans-serif',
              fontWeight: 250,
              fontSize: { xs: '1rem', md: '1rem' },
              color: '#7a6a65',
              lineHeight: 1.7,
              maxWidth: 420,
            }}
          >
            <Box component="span" sx={{ display: 'block' }}>
              Tratamientos de medicina est&eacute;tica dise&ntilde;ados para
            </Box>
            <Box component="span" sx={{ display: 'block' }}>
              realzar tu belleza de forma sutil, segura y arm&oacute;nica.
            </Box>
          </Typography>

          <Button
            variant="contained"
            size="large"
            startIcon={<CalendarMonthIcon />}
            onClick={handleOpenReserva}
            sx={{
              mt: 4,
              borderRadius: '50px',
              px: '36px',
              py: '14px',
              backgroundColor: '#D9A3AE',
              color: '#FFFFFF',
              fontWeight: 500,
              textTransform: 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#C98F9B',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 22px rgba(201, 143, 155, 0.28)',
              },
            }}
          >
            Reservar turno online
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
            <CheckCircleOutlineIcon sx={{ color: '#D4A5A5', fontSize: '18px' }} />
            <Typography sx={{ color: '#666666', fontSize: '0.875rem' }}>
              Agend&aacute; tu cita en menos de 30 segundos
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
