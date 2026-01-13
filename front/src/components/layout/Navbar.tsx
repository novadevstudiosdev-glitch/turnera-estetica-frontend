'use client';

import { AppBar, Box, Container, Toolbar, Button, useTheme, useMediaQuery } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const NAVIGATION_LINKS = [
  { label: 'Inicio', href: '#hero' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Testimonios', href: '#testimonios' },
  { label: 'Ubicación', href: '#ubicacion' },
  { label: 'Contacto', href: '#contacto' },
];

export function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                height: 70,
                '&:hover': {
                  transform: 'scale(1.08)',
                },
              }}
            >
              <Image
                src="/logo.png"
                alt="MOK Logo"
                width={180}
                height={180}
                priority
                style={{
                  objectFit: 'contain',
                }}
              />
            </Box>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {NAVIGATION_LINKS.map((link) => (
                <Button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  sx={{
                    color: '#1A1A1A',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    textTransform: 'none',
                    position: 'relative',
                    px: 2,
                    py: 1,
                    borderRadius: '8px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '8px',
                      background:
                        'linear-gradient(135deg, rgba(196, 138, 154, 0.1) 0%, rgba(138, 124, 138, 0.1) 100%)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      zIndex: -1,
                    },
                    '&:hover': {
                      color: '#C48A9A',
                      '&::before': {
                        opacity: 1,
                      },
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
            {NAVIGATION_LINKS.map((link) => (
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
