'use client';

import { Box, Container, Card, CardContent, Typography } from '@mui/material';
import { SectionTitle } from '../ui/SectionTitle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

export function VideoPresentationSection() {
  return (
    <Box
      id="video"
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: '#F8F5F2',
      }}
    >
      <Container maxWidth="lg">
        <SectionTitle
          title="Conoce Nuestro Consultorio"
          subtitle="Un recorrido por nuestras instalaciones y el equipo profesional que te cuidará"
        />

        <Box
          sx={{
            mt: 6,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Card
            sx={{
              width: '100%',
              maxWidth: '800px',
              overflow: 'hidden',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
              backgroundColor: '#000000',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                paddingBottom: '56.25%', // 16:9 aspect ratio
                overflow: 'hidden',
                backgroundColor: '#1A1A1A',
              }}
            >
              {/* Placeholder para video - reemplazar con video real */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor:
                    'linear-gradient(135deg, rgba(196, 138, 154, 0.2) 0%, rgba(138, 124, 138, 0.2) 100%)',
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <PlayCircleIcon
                    sx={{
                      fontSize: '80px',
                      color: '#C48A9A',
                      mb: 2,
                    }}
                  />
                  <Typography sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                    Click para reproducir video
                  </Typography>
                </Box>

                {/* Aquí iría el video real - reemplazar con: */}
                {/* <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/VIDEO_ID"
                  title="MOK Consultorio"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  }}
                /> */}
              </Box>
            </Box>

            <CardContent
              sx={{
                backgroundColor: '#1A1A1A',
                color: '#FFFFFF',
                p: 3,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                Un espacio pensado para tu bienestar
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#CCCCCC',
                }}
              >
                Descubre cómo en MOK combinamos tecnología de punta con un ambiente cálido y
                profesional para ofrecerte la mejor experiencia en tratamientos estéticos.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}
