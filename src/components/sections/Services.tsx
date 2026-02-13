'use client';

import { Box, Container, Typography, Card, CardContent } from '@mui/material';
import { SectionTitle } from '../ui/SectionTitle';
import { services } from '@/lib/data';

export function ServicesSection() {
  return (
    <Box
      id="servicios"
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: 'transparent',
        position: 'relative',
      }}
    >
      <Container maxWidth="lg">
        <SectionTitle
          title="Nuestros Servicios"
          subtitle="Descubre nuestro amplio catálogo de tratamientos estéticos especializados"
        />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
            gap: 3,
            mt: 2,
          }}
        >
          {services.map((service) => (
            <Box key={service.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 26px rgba(0, 0, 0, 0.08)',
                  },
                  borderRadius: '16px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E9E4E2',
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  {service.image && (
                    <Box
                      component="img"
                      src={service.image}
                      alt={service.name}
                      sx={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '12px 12px 0 0',
                        mb: 2,
                      }}
                    />
                  )}

                  {/* Service Name */}
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      fontWeight: 600,
                      color: '#3A3A3A',
                      mb: 2,
                    }}
                  >
                    {service.name}
                  </Typography>

                  {/* Service Description */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#7A7A7A',
                      lineHeight: 1.8,
                    }}
                  >
                    {service.description}
                  </Typography>

                  {/* Arrow Icon */}
                  <Box
                    sx={{
                      mt: 3,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: 'transparent',
                      border: '1px solid #E9E4E2',
                      transition: 'all 0.3s ease',
                      color: '#D4A5A5',
                      fontSize: '1.2rem',
                    }}
                  >
                    →
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
