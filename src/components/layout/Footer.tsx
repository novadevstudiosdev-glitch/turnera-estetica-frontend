'use client';

import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import { Box, Container, Divider, Link as MuiLink, Typography } from '@mui/material';

const quickLinks = [
  { label: 'Inicio', href: '#' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Ubicacion', href: '#ubicacion' },
  { label: 'Contacto', href: '#contacto' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: FacebookIcon, href: '#', label: 'Facebook' },
    { icon: InstagramIcon, href: 'https://www.instagram.com/dra.jaquelinagrassetti', label: 'Instagram' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#FFFFFF',
        color: '#3A3A3A',
        py: 8,
        mt: 12,
        borderTop: '1px solid #E9E4E2',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
            gap: 4,
            mb: 6,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#3A3A3A',
                mb: 2,
              }}
            >
              JG
            </Typography>
            <Typography variant="body2" sx={{ color: '#7A7A7A', mb: 3 }}>
              Consultorio Medico Estetico de excelencia. Tratamientos profesionales con resultados garantizados.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <MuiLink
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: '#D4A5A5',
                      transition: 'color 0.2s ease',
                      '&:hover': {
                        color: '#C9A0A0',
                      },
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Icon sx={{ fontSize: '1.5rem' }} />
                  </MuiLink>
                );
              })}
            </Box>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Enlaces Rapidos
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {quickLinks.map((link) => (
                <MuiLink
                  key={link.label}
                  href={link.href}
                  sx={{
                    color: '#7A7A7A',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                    '&:hover': {
                      color: '#3A3A3A',
                    },
                  }}
                >
                  {link.label}
                </MuiLink>
              ))}
            </Box>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Contacto
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography variant="body2" sx={{ color: '#7A7A7A' }}>
                Telefono: +54 341 751-1529
              </Typography>
              <Typography variant="body2" sx={{ color: '#7A7A7A' }}>
                Instagram:{' '}
                <MuiLink
                  href="https://www.instagram.com/dra.jaquelinagrassetti"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: '#7A7A7A', textDecoration: 'none' }}
                >
                  @dra.jaquelinagrassetti
                </MuiLink>
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Horarios
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ color: '#3A3A3A', fontWeight: 600 }}>
                  Rosario
                </Typography>
                <Typography variant="body2" sx={{ color: '#3A3A3A' }}>
                  Lunes: 14:00 - 19:30
                </Typography>
                <Typography variant="body2" sx={{ color: '#7A7A7A' }}>
                  Jueves: 08:00 - 15:00
                </Typography>
                <Typography variant="body2" sx={{ color: '#7A7A7A' }}>
                  Viernes: 08:00 - 14:00
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#3A3A3A', fontWeight: 600 }}>
                  Correa
                </Typography>
                <Typography variant="body2" sx={{ color: '#7A7A7A' }}>
                  Martes: 07:00 - 16:00
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ backgroundColor: '#E9E4E2', my: 4 }} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: '#7A7A7A' }}>
            &copy; {currentYear} MOK - Consultorio Medico Estetico. Todos los derechos reservados.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <MuiLink
              href="#"
              sx={{
                color: '#7A7A7A',
                textDecoration: 'none',
                fontSize: '0.9rem',
                '&:hover': {
                  color: '#3A3A3A',
                },
              }}
            >
              Politica de Privacidad
            </MuiLink>
            <MuiLink
              href="#"
              sx={{
                color: '#7A7A7A',
                textDecoration: 'none',
                fontSize: '0.9rem',
                '&:hover': {
                  color: '#3A3A3A',
                },
              }}
            >
              Terminos de Uso
            </MuiLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
