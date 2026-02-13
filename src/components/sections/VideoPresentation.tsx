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
        backgroundColor: 'transparent',
      }}
    >
      <Container maxWidth="lg">
        <SectionTitle title="Conoce Nuestro Consultorio" subtitle="Un recorrido por nuestras instalaciones y el equipo profesional que te cuidará" />

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
              boxShadow: '0 10px 22px rgba(0, 0, 0, 0.06)',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E9E4E2',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                paddingBottom: '56.25%', // 16:9 aspect ratio
                overflow: 'hidden',
                backgroundColor: '#FFFFFF',
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
                  backgroundColor: 'transparent',
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <PlayCircleIcon
                    sx={{
                      fontSize: '80px',
                      color: '#D4A5A5',
                      mb: 2,
                    }}
                  />
                  <Typography sx={{ color: '#3A3A3A', fontWeight: 500 }}>
                    Click para reproducir video
                  </Typography>
                </Box>

                {/* AquÃƒÂ­ irÃƒÂ­a el video real - reemplazar con: */}
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/TBtkQQ0NgT0"
                  title="MOK Consultorio"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  }}
                />
              </Box>
            </Box>

            <CardContent
              sx={{
                backgroundColor: '#FFFFFF',
                color: '#3A3A3A',
                p: 3,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                Un espacio pensado para tu bienestar
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#7A7A7A',
                }}
              >
                Descubre cÃƒÂ³mo en MOK combinamos tecnologÃƒÂ­a de punta con un ambiente cÃƒÂ¡lido y profesional para ofrecerte la mejor experiencia en
                tratamientos estÃƒÂ©ticos.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}
