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
        backgroundColor: '#F8F5F2',
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
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
              }}
            >
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                src="https://www.google.com/maps?q=Calle+Almirante+Brown+1871,+Tunuyán,+Mendoza,+Argentina&output=embed"
                style={{ border: 0 }}
                allowFullScreen=""
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
                border: '1px solid #E8E3DF',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    mb: 4,
                    color: '#1A1A1A',
                  }}
                >
                  Información de Contacto
                </Typography>

                {/* Dirección */}
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-start' }}>
                    <LocationOnIcon
                      sx={{
                        color: '#C48A9A',
                        mt: 0.5,
                      }}
                    />
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: '#1A1A1A',
                          mb: 0.5,
                        }}
                      >
                        Ubicación
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#666666',
                        }}
                      >
                        {contactInfo.address}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Teléfono */}
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-start' }}>
                    <PhoneIcon
                      sx={{
                        color: '#C48A9A',
                        mt: 0.5,
                      }}
                    />
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: '#1A1A1A',
                          mb: 0.5,
                        }}
                      >
                        Teléfono
                      </Typography>
                      <Button
                        href={`tel:${contactInfo.phone}`}
                        sx={{
                          color: '#C48A9A',
                          textTransform: 'none',
                          textDecoration: 'none',
                          p: 0,
                          justifyContent: 'flex-start',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {contactInfo.phone}
                      </Button>
                    </Box>
                  </Box>
                </Box>

                {/* Horarios */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: '#1A1A1A',
                      mb: 1.5,
                    }}
                  >
                    Horarios
                  </Typography>
                  <Box sx={{ pl: 4 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        color: '#666666',
                        mb: 0.5,
                      }}
                    >
                      <strong>Lunes a Viernes:</strong> {contactInfo.hours.weekday}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        color: '#666666',
                        mb: 0.5,
                      }}
                    >
                      <strong>Sábado:</strong> {contactInfo.hours.saturday}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        color: '#666666',
                      }}
                    >
                      <strong>Domingo:</strong> {contactInfo.hours.sunday}
                    </Typography>
                  </Box>
                </Box>

                {/* CTA Button */}
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  href={`https://www.google.com/maps/search/${contactInfo.address.replace(
                    /\s/g,
                    '+'
                  )}`}
                  target="_blank"
                  sx={{
                    mt: 3,
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
