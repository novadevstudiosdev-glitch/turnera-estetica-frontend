'use client';

import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Box, Container, Link as MuiLink, Typography } from '@mui/material';

const quickLinks = [
  { label: 'Inicio', href: '#' },
  { label: 'Tratamiento', href: '#servicios' },
  { label: 'Ubicacion', href: '#ubicacion' },
  { label: 'Tienda Online', href: '#catalogo' },
  { label: 'Testimonios', href: '#testimonios' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: InstagramIcon, href: 'https://www.instagram.com/dra.jaquelinagrassetti', label: 'Instagram' },
    { icon: WhatsAppIcon, href: 'https://wa.me/543417511529', label: 'WhatsApp' },
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
          <Box sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5,
                flexWrap: 'wrap',
              }}
            >
              <Typography
                sx={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontWeight: 600,
                  letterSpacing: '3px',
                  fontSize: { xs: '1.5rem', md: '1.75rem' },
                  color: '#D4A5A5',
                }}
              >
                JG
              </Typography>
              <Box
                aria-hidden="true"
                sx={{
                  width: '1px',
                  height: 24,
                  backgroundColor: '#E0E0E0',
                }}
              />
              <Typography
                sx={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontStyle: 'italic',
                  fontWeight: 300,
                  letterSpacing: '0.08em',
                  color: '#666666',
                  fontSize: '0.82rem',
                }}
              >
                Dra. Jaquelina Grassetti
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#7A7A7A', mb: 3 }}>
              Consultorio Medico Estetico de excelencia. Tratamientos profesionales con resultados garantizados.
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Enlaces Rapidos
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'center' }}>
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

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Contacto
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: '#7A7A7A' }}>
                Telefono: +54 341 751-1529
              </Typography>
              <Typography variant="body2" sx={{ color: '#3A3A3A', fontWeight: 600, mt: 1 }}>
                Redes Sociales
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <MuiLink
                      key={`contact-${social.label}`}
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
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Acceso de Usuario
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'center' }}>
              <MuiLink
                href="/?auth=register"
                sx={{
                  color: '#7A7A7A',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                  '&:hover': {
                    color: '#3A3A3A',
                  },
                }}
              >
                Registro
              </MuiLink>
              <MuiLink
                href="/?auth=login"
                sx={{
                  color: '#7A7A7A',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                  '&:hover': {
                    color: '#3A3A3A',
                  },
                }}
              >
                Ingreso
              </MuiLink>
            </Box>
          </Box>

        </Box>

        <Box
          sx={{
            borderTop: '1px solid #EFE3E3',
            mt: 4,
            pt: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
              '@media (max-width: 600px)': {
                flexDirection: 'column',
                textAlign: 'center',
              },
            }}
          >
            <Typography sx={{ color: '#8C8C8C', fontSize: '0.85rem' }}>
              &copy; 2026 Consultorio M&eacute;dico Est&eacute;tico. Todos los derechos reservados.
            </Typography>

            <MuiLink
              href="https://www.novadevstudios.com/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: '#8C8C8C',
                fontSize: '0.85rem',
                textDecoration: 'none',
                '&:hover': { color: '#D4A5A5', textDecoration: 'underline' },
              }}
            >
              Made by Novadev Studios
            </MuiLink>
          </Box>

          <Box
            sx={{
              mt: 1,
              maxWidth: 900,
              mx: 'auto',
              textAlign: 'center',
              pb: 1,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: '#8C8C8C',
                fontSize: '0.74rem',
                lineHeight: 1.35,
              }}
            >
              Este sitio est&aacute; protegido por reCAPTCHA y se aplican la{' '}
              <Box
                component="a"
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'inherit',
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': { color: '#D4A5A5', textDecoration: 'underline' },
                }}
              >
                Pol&iacute;tica de Privacidad
              </Box>{' '}
              y los{' '}
              <Box
                component="a"
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'inherit',
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': { color: '#D4A5A5', textDecoration: 'underline' },
                }}
              >
                T&eacute;rminos de Servicio
              </Box>{' '}
              de Google.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
