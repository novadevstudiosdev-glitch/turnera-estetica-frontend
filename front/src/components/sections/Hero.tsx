'use client';

import { Box, Container, Typography, Button, useTheme, useMediaQuery } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

export function HeroSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleScrollToContact = () => {
    const contactElement = document.querySelector('#contacto');
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box
      id="hero"
      component="section"
      sx={{
        backgroundColor: '#F8F5F2',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 6, md: 0 },
      }}
    >
      {/* Decorative Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 30% 30%, rgba(196, 138, 154, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
          '@media (max-width:600px)': {
            width: '200px',
            height: '200px',
          },
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Box
          sx={{
            textAlign: 'center',
            maxWidth: '800px',
            mx: 'auto',
          }}
        >
          {/* Subtitle */}
          <Typography
            variant="body1"
            sx={{
              color: '#C48A9A',
              fontWeight: 600,
              fontSize: { xs: '0.95rem', md: '1.05rem' },
              mb: 2,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Bienvenido a MOK
          </Typography>

          {/* Main Title */}
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem', lg: '4rem' },
              fontWeight: 700,
              color: '#1A1A1A',
              mb: 3,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
            }}
          >
            Consultorio Médico Estético
          </Typography>

          {/* Description */}
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1rem', md: '1.15rem' },
              color: '#666666',
              mb: 5,
              lineHeight: 1.8,
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Realza tu belleza natural con nuestros tratamientos especializados. Profesionales
            certificados, tecnología de punta y resultados garantizados.
          </Typography>

          {/* CTA Buttons */}
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              justifyContent: 'center',
              flexWrap: 'wrap',
              mb: 8,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleScrollToContact}
              sx={{
                px: { xs: 3, md: 5 },
                py: { xs: 1.5, md: 2 },
                fontSize: '1rem',
              }}
            >
              Agendar Cita
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => {
                const serviciosElement = document.querySelector('#servicios');
                if (serviciosElement) {
                  serviciosElement.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              sx={{
                px: { xs: 3, md: 5 },
                py: { xs: 1.5, md: 2 },
                fontSize: '1rem',
              }}
            >
              Ver Servicios
            </Button>
          </Box>

          {/* Scroll Indicator */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              animation: 'bounce 2s infinite',
              '@keyframes bounce': {
                '0%, 100%': {
                  transform: 'translateY(0)',
                },
                '50%': {
                  transform: 'translateY(12px)',
                },
              },
            }}
          >
            <Box
              sx={{
                p: 1,
                borderRadius: '50%',
                border: '2px solid #C48A9A',
              }}
            >
              <ArrowDownwardIcon sx={{ color: '#C48A9A' }} />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
