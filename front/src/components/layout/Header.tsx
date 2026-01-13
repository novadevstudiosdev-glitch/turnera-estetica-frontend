'use client';

import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

export function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationLinks = [
    { label: 'Inicio', href: '#hero' },
    { label: 'Servicios', href: '#servicios' },
    { label: 'Testimonios', href: '#testimonios' },
    { label: 'Ubicación', href: '#ubicacion' },
    { label: 'Contacto', href: '#contacto' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: '#F8F5F2',
        color: '#1A1A1A',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        borderBottom: '1px solid #E8E3DF',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: { xs: '16px 0', md: '12px 0' },
          }}
        >
          {/* Logo */}
          <Link href="/">
            <Box
              sx={{
                fontSize: '1.5rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #C48A9A 0%, #8A7C8A 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                cursor: 'pointer',
                letterSpacing: '-0.02em',
              }}
            >
              MOK
            </Box>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 4 }}>
              {navigationLinks.map((link) => (
                <Button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  sx={{
                    color: '#1A1A1A',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    textTransform: 'none',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -4,
                      left: 0,
                      width: 0,
                      height: '2px',
                      backgroundColor: '#C48A9A',
                      transition: 'width 0.3s ease',
                    },
                    '&:hover::after': {
                      width: '100%',
                    },
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <Button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              sx={{
                color: '#1A1A1A',
                minWidth: 'auto',
                p: 1,
              }}
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </Button>
          )}

          {/* CTA Button - Desktop */}
          {!isMobile && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleNavClick('#contacto')}
              sx={{
                borderRadius: '12px',
                px: 3,
              }}
            >
              Reservar
            </Button>
          )}
        </Toolbar>

        {/* Mobile Navigation */}
        {isMobile && mobileMenuOpen && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              pb: 2,
              borderTop: '1px solid #E8E3DF',
              pt: 2,
            }}
          >
            {navigationLinks.map((link) => (
              <Button
                key={link.href}
                fullWidth
                onClick={() => handleNavClick(link.href)}
                sx={{
                  justifyContent: 'flex-start',
                  color: '#1A1A1A',
                  textTransform: 'none',
                  fontSize: '1rem',
                }}
              >
                {link.label}
              </Button>
            ))}
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => handleNavClick('#contacto')}
              sx={{ mt: 1 }}
            >
              Reservar
            </Button>
          </Box>
        )}
      </Container>
    </AppBar>
  );
}
