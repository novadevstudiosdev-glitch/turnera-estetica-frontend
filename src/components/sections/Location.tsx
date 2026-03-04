'use client';

import { Box, Container, Card, CardContent, Typography, Button } from '@mui/material';
import { SectionTitle } from '../ui/SectionTitle';
import { contactInfo } from '@/lib/data';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';

export function LocationSection() {
  return (
    <Box
      id="ubicacion"
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: 'transparent',
      }}
    >
      <Container maxWidth="lg">
        <SectionTitle
          title="Nuestra Ubicación"
          subtitle="Fácil acceso y estacionamiento disponible"
        />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 4,
            mt: 2,
          }}
        >
          {/* Map - Placeholder */}
          <Box>
            <Card
              sx={{
                height: '100%',
                minHeight: '400px',
                overflow: 'hidden',
                borderRadius: '16px',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.06)',
                border: '1px solid #E9E4E2',
              }}
            >
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                src="https://www.google.com/maps?q=Jun%C3%ADn+191,+Alto+Bur%C3%B3,+Rosario,+Argentina&output=embed"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </Card>
          </Box>

          {/* Info Card */}
          <Box>
            <Card
              sx={{
                height: '100%',
                borderRadius: '16px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E9E4E2',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    mb: 4,
                    color: '#3A3A3A',
                  }}
                >
                  Información de Contacto
                </Typography>

                {/* Dirección */}
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-start' }}>
                    <LocationOnIcon
                      sx={{
                        color: '#D4A5A5',
                        mt: 0.5,
                      }}
                    />
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: '#3A3A3A',
                          mb: 0.5,
                        }}
                      >
                        Ubicación
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#7A7A7A',
                        }}
                      >
                        {contactInfo.address}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Celular */}
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-start' }}>
                    <PhoneIcon
                      sx={{
                        color: '#D4A5A5',
                        mt: 0.5,
                      }}
                    />
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: '#3A3A3A',
                          mb: 0.5,
                        }}
                      >
                        Celular
                      </Typography>
                      <Button
                        href={`tel:${contactInfo.whatsapp}`}
                        sx={{
                          color: '#3A3A3A',
                          textTransform: 'none',
                          textDecoration: 'none',
                          p: 0,
                          justifyContent: 'flex-start',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {contactInfo.whatsapp}
                      </Button>
                    </Box>
                  </Box>
                </Box>

                {/* CTA Button */}
                <Button
                  fullWidth
                  variant="outlined"
                  href={`https://www.google.com/maps/search/${encodeURIComponent(
                    contactInfo.address
                  )}`}
                  target="_blank"
                  sx={{
                    mt: 3,
                    borderRadius: '999px',
                    borderColor: '#EEBBC3',
                    color: '#3A3A3A',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#EEBBC3',
                      borderColor: '#FFB8C6',
                    },
                  }}
                >
                  Ver en Google Maps
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
