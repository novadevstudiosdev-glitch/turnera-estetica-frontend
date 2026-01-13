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
        backgroundColor: '#1A1A1A',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="body2"
          sx={{
            color: '#999999',
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
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  border: '1px solid rgba(196, 138, 154, 0.2)',
                  padding: '16px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(196, 138, 154, 0.1)',
                    borderColor: '#C48A9A',
                  },
                }}
              >
                <Typography
                  sx={{
                    color: '#CCCCCC',
                    fontWeight: 600,
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
