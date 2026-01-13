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
        backgroundColor: '#FFFFFF',
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
                    boxShadow: '0 16px 40px rgba(196, 138, 154, 0.2)',
                  },
                  borderRadius: '16px',
                  backgroundColor: '#F8F5F2',
                  border: '1px solid #E8E3DF',
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Icon */}
                  <Typography
                    sx={{
                      fontSize: '3rem',
                      mb: 2,
                      display: 'block',
                    }}
                  >
                    {service.icon}
                  </Typography>

                  {/* Service Name */}
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      fontWeight: 700,
                      color: '#1A1A1A',
                      mb: 2,
                    }}
                  >
                    {service.name}
                  </Typography>

                  {/* Service Description */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#666666',
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
                      backgroundColor: '#E8E3DF',
                      transition: 'all 0.3s ease',
                      color: '#C48A9A',
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
