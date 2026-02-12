'use client';

import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import Link from 'next/link';
import { useEffect, useState } from 'react';
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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenReserva = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('open-reserva-modal'));
    }
  };

  const navItemStyle = {
    color: '#2C2C2C',
    fontSize: '0.95rem',
    fontWeight: 500,
    fontFamily: 'Poppins, sans-serif',
    textTransform: 'none',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    transform: 'none',
    borderRadius: '0',
    minWidth: 'auto',
    px: 2.25,
    py: 1,
    transition: 'color 0.25s ease',
    '&:hover': {
      color: '#EEBBC3',
      backgroundColor: 'transparent',
      boxShadow: 'none',
      transform: 'none',
    },
    '&:active': {
      backgroundColor: 'transparent',
      boxShadow: 'none',
      transform: 'none',
    },
    '&.Mui-focusVisible': {
      color: '#EEBBC3',
      backgroundColor: 'transparent',
      boxShadow: 'none',
      transform: 'none',
    },
    '&:focus-visible': {
      color: '#EEBBC3',
      backgroundColor: 'transparent',
      boxShadow: 'none',
      transform: 'none',
    },
  } as const;

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 255, 255, 0.88)',
        color: '#2C2C2C',
        boxShadow: isScrolled ? '0 6px 24px rgba(0,0,0,0.08)' : '0 2px 20px rgba(0,0,0,0.04)',
        borderBottom: '1px solid rgba(212, 165, 165, 0.12)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 3, md: 7.5 } }}>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: 80,
            padding: 0,
          }}
        >
          {/* Logo */}
          <Link href="/">
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 2,
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                height: 80,
                '&:hover': {
                  transform: 'scale(1.02)',
                },
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
                  height: 30,
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
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', gap: 1.5 }}>
              {NAVIGATION_LINKS.map((link) => (
                <Button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  disableRipple
                  disableFocusRipple
                  sx={navItemStyle}
                >
                  {link.label}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Button
              variant="contained"
              onClick={handleOpenReserva}
              sx={{
                borderRadius: '25px',
                px: { xs: 2.6, md: 3.5 },
                py: { xs: 0.9, md: 1.1 },
                fontSize: { xs: '0.85rem', md: '0.95rem' },
                backgroundColor: '#EEBBC3',
                color: '#2C2C2C',
                border: '1px solid #D4A5A5',
                boxShadow: '0 6px 18px rgba(238, 187, 195, 0.25)',
                textTransform: 'none',
                fontWeight: 500,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#FFB8C6',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 14px 26px rgba(238, 187, 195, 0.35)',
                },
              }}
            >
              Reservar
            </Button>

            {/* Mobile Menu Button */}
            {isMobile && (
              <Button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                sx={{
                  color: '#2C2C2C',
                  minWidth: 'auto',
                  p: 1,
                }}
              >
                {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </Button>
            )}
          </Box>
        </Toolbar>

        {/* Mobile Navigation */}
        {isMobile && mobileMenuOpen && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              pb: 2,
              borderTop: '1px solid #E9E4E2',
              pt: 2,
              backgroundColor: '#FFFFFF',
            }}
          >
            {NAVIGATION_LINKS.map((link) => (
              <Button
                key={link.href}
                fullWidth
                onClick={() => handleNavClick(link.href)}
                disableRipple
                disableFocusRipple
                sx={{
                  ...navItemStyle,
                  justifyContent: 'flex-start',
                  width: '100%',
                  fontSize: '1rem',
                  px: 0,
                }}
              >
                {link.label}
              </Button>
            ))}
            <Button
              fullWidth
              variant="contained"
              onClick={handleOpenReserva}
              sx={{
                mt: 1,
                borderRadius: '25px',
                backgroundColor: '#EEBBC3',
                color: '#2C2C2C',
                border: '1px solid #D4A5A5',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#FFB8C6',
                },
              }}
            >
              Reservar
            </Button>
          </Box>
        )}
      </Container>
    </AppBar>
  );
}
