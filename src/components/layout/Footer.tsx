'use client';

import { Box, Container, Typography, Link as MuiLink, Divider } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

import { contactInfo } from '@/lib/data';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: FacebookIcon, href: '#', label: 'Facebook' },
    { icon: InstagramIcon, href: '#', label: 'Instagram' },
  
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
          {/* Branding */}
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
              MOK
            </Typography>
            <Typography variant="body2" sx={{ color: '#7A7A7A', mb: 3 }}>
              Consultorio Médico Estético de excelencia. Tratamientos profesionales con resultados
              garantizados.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <MuiLink
                    key={social.label}
                    href={social.href}
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

          {/* Enlaces Rápidos */}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Enlaces Rápidos
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {['Servicios', 'Testimonios', 'Ubicación', 'Contacto'].map((link) => (
                <MuiLink
                  key={link}
                  href="#"
                  sx={{
                    color: '#7A7A7A',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                    '&:hover': {
                      color: '#3A3A3A',
                    },
                  }}
                >
                  {link}
                </MuiLink>
              ))}
            </Box>
          </Box>

          {/* Contacto */}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Contacto
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography variant="body2" sx={{ color: '#7A7A7A' }}>
                📞 {contactInfo.phone}
              </Typography>
              <Typography variant="body2" sx={{ color: '#7A7A7A' }}>
                💬{' '}
                <MuiLink href={`https://wa.me/${contactInfo.whatsapp.replace(/\s/g, '')}`}>
                  {contactInfo.whatsapp}
                </MuiLink>
              </Typography>
              <Typography variant="body2" sx={{ color: '#7A7A7A' }}>
                ✉️ <MuiLink href={`mailto:${contactInfo.email}`}>{contactInfo.email}</MuiLink>
              </Typography>
            </Box>
          </Box>

          {/* Horarios */}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Horarios
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box>
                <Typography variant="body2" sx={{ color: '#7A7A7A', fontSize: '0.85rem' }}>
                  Lunes a Viernes
                </Typography>
                <Typography variant="body2" sx={{ color: '#3A3A3A' }}>
                  {contactInfo.hours.weekday}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#7A7A7A', fontSize: '0.85rem' }}>
                  Sábado
                </Typography>
                <Typography variant="body2" sx={{ color: '#3A3A3A' }}>
                  {contactInfo.hours.saturday}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#7A7A7A', fontSize: '0.85rem' }}>
                  Domingo
                </Typography>
                <Typography variant="body2" sx={{ color: '#7A7A7A' }}>
                  {contactInfo.hours.sunday}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Divider */}
        <Divider sx={{ backgroundColor: '#E9E4E2', my: 4 }} />

        {/* Copyright */}
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
            &copy; {currentYear} MOK - Consultorio Médico Estético. Todos los derechos reservados.
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
              Política de Privacidad
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
              Términos de Uso
            </MuiLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
