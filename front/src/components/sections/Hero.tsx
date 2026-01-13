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
        backgroundColor: '#FFF8EF',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 6, md: 0 },
      }}
    >
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
              color: '#D4A5A5',
              fontWeight: 800,
              fontSize: { xs: '1.05rem', md: '1.25rem' },
              mb: 2,
              letterSpacing: '0.08em',
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
              whiteSpace: {
                xs: 'normal', //móvil
                md: 'nowrap', //desktop
              },
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
              color="secondary"
              size="large"
              onClick={handleScrollToContact}
              sx={{
                px: { xs: 3, md: 5 },
                py: { xs: 1.5, md: 2 },
                fontSize: '1rem',
                backgroundColor: '#D4A5A5',
                color: '#FFF8E7',
                border: '2px solid #D4A5A5',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#FFF8E7',
                  color: '#D4A5A5',
                  border: '2px solid #D4A5A5',
                },
                '&:active': {
                  transform: 'scale(0.97)',
                },
              }}
            >
              Agendar Cita
            </Button>
            <Button
              variant="outlined"
              color="secondary"
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
                borderColor: '#D4A5A5',
                color: '#D4A5A5',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#D4A5A5',
                  color: '#FFF8E7',
                  borderColor: '#D4A5A5',
                }
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
