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
        backgroundColor: '#1A1A1A',
        color: '#FFFFFF',
        py: 8,
        mt: 12,
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
                fontWeight: 700,
                background: 'linear-gradient(135deg, #C48A9A 0%, #8A7C8A 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: 2,
              }}
            >
              MOK
            </Typography>
            <Typography variant="body2" sx={{ color: '#CCCCCC', mb: 3 }}>
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
                      color: '#C48A9A',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: '#FFFFFF',
                        transform: 'translateY(-2px)',
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
                    color: '#CCCCCC',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                    '&:hover': {
                      color: '#C48A9A',
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
              <Typography variant="body2" sx={{ color: '#CCCCCC' }}>
                📞 {contactInfo.phone}
              </Typography>
              <Typography variant="body2" sx={{ color: '#CCCCCC' }}>
                💬{' '}
                <MuiLink href={`https://wa.me/${contactInfo.whatsapp.replace(/\s/g, '')}`}>
                  {contactInfo.whatsapp}
                </MuiLink>
              </Typography>
              <Typography variant="body2" sx={{ color: '#CCCCCC' }}>
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
                <Typography variant="body2" sx={{ color: '#999999', fontSize: '0.85rem' }}>
                  Lunes a Viernes
                </Typography>
                <Typography variant="body2" sx={{ color: '#CCCCCC' }}>
                  {contactInfo.hours.weekday}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#999999', fontSize: '0.85rem' }}>
                  Sábado
                </Typography>
                <Typography variant="body2" sx={{ color: '#CCCCCC' }}>
                  {contactInfo.hours.saturday}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#999999', fontSize: '0.85rem' }}>
                  Domingo
                </Typography>
                <Typography variant="body2" sx={{ color: '#999999' }}>
                  {contactInfo.hours.sunday}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Divider */}
        <Divider sx={{ backgroundColor: '#333333', my: 4 }} />

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
          <Typography variant="body2" sx={{ color: '#999999' }}>
            &copy; {currentYear} MOK - Consultorio Médico Estético. Todos los derechos reservados.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <MuiLink
              href="#"
              sx={{
                color: '#999999',
                textDecoration: 'none',
                fontSize: '0.9rem',
                '&:hover': {
                  color: '#C48A9A',
                },
              }}
            >
              Política de Privacidad
            </MuiLink>
            <MuiLink
              href="#"
              sx={{
                color: '#999999',
                textDecoration: 'none',
                fontSize: '0.9rem',
                '&:hover': {
                  color: '#C48A9A',
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
