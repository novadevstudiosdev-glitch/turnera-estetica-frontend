'use client';

import { Box, Container, Typography } from '@mui/material';
import { useState } from 'react';
import { brands } from '@/lib/data';

export function BrandsCarouselSection() {
  const [displayedBrands] = useState(() => [...brands, ...brands]);

  return (
    <Box
      component="section"
      sx={{
        py: 6,
        backgroundColor: 'transparent',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="body2"
          sx={{
            color: '#7A7A7A',
            fontSize: '0.9rem',
            textAlign: 'center',
            mb: 4,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          Marcas de Confianza
        </Typography>

        <Box
          sx={{
            display: 'flex',
            overflow: 'hidden',
            position: 'relative',
            gap: 4,
          }}
        >
          {/* Carrusel móvil */}
          <Box
            sx={{
              display: 'flex',
              gap: 4,
              animation: 'scroll 20s linear infinite',
              '@keyframes scroll': {
                '0%': {
                  transform: 'translateX(0)',
                },
                '100%': {
                  transform: `translateX(-${50}%)`,
                },
              },
              '&:hover': {
                animationPlayState: 'paused',
              },
            }}
          >
            {displayedBrands.map((brand, index) => (
              <Box
                key={index}
                sx={{
                  flex: '0 0 auto',
                  width: '150px',
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E9E4E2',
                  padding: '16px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#D4A5A5',
                  },
                }}
              >
                <Typography
                  sx={{
                    color: '#3A3A3A',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    textAlign: 'center',
                  }}
                >
                  {brand.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
