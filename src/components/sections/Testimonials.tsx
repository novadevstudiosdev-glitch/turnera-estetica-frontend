'use client';

import { Box, Container, Card, CardContent, Typography, Rating, Avatar } from '@mui/material';
import { SectionTitle } from '../ui/SectionTitle';
import { testimonials } from '@/lib/data';

export function TestimonialsSection() {
  return (
    <Box
      id="testimonios"
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: 'transparent',
      }}
    >
      <Container maxWidth="lg">
        <SectionTitle
          title="Lo Que Dicen Nuestros Clientes"
          subtitle="Testimonios de personas que han transformado su belleza con MOK"
        />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
            gap: 4,
            mt: 2,
          }}
        >
          {testimonials.map((testimonial) => (
            <Box key={testimonial.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '16px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E9E4E2',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 12px 26px rgba(0, 0, 0, 0.08)',
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Rating */}
                  <Box sx={{ mb: 2 }}>
                    <Rating
                      value={testimonial.rating}
                      readOnly
                      size="medium"
                      sx={{ color: '#D4A5A5' }}
                    />
                  </Box>

                  {/* Comment */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#7A7A7A',
                      mb: 3,
                      flex: 1,
                      fontStyle: 'italic',
                      lineHeight: 1.8,
                      fontSize: '0.95rem',
                    }}
                  >
                    &quot;{testimonial.comment}&quot;
                  </Typography>

                  {/* Client Info */}
                  <Box sx={{ borderTop: '1px solid #E9E4E2', pt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          backgroundColor: '#F5E6E8',
                        }}
                      >
                        {testimonial.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: '#3A3A3A',
                          }}
                        >
                          {testimonial.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#7A7A7A',
                            fontSize: '0.8rem',
                          }}
                        >
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
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
