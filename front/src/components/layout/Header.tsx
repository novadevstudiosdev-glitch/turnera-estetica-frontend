'use client';

import { AppBar, Box, Container, Toolbar, Button, useTheme, useMediaQuery } from '@mui/material';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const BRAND_COLOR = '#D4A5A5';

export function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 10,
  });

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
      elevation={0}
      sx={{
        backgroundColor: 'rgba(248, 245, 242, 0.95)',
        backdropFilter: 'blur(6px)',
        color: '#1A1A1A',
        transition: 'box-shadow 0.3s ease',
        boxShadow: trigger ? '0 8px 24px rgba(0, 0, 0, 0.08)' : 'none',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            py: { xs: 2, md: 1.5 },
          }}
        >
          {/* Logo */}
          <Link href="/" aria-label="Inicio">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                height: 60,
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.04)',
                },
              }}
            >
              <Image
                src="/logo.png"
                alt="MOK Centro Médico Estético"
                width={180}
                height={60}
                priority
                style={{ objectFit: 'contain' }}
              />
            </Box>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {navigationLinks.map((link) => (
                <Button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  sx={{
                    color: '#1A1A1A',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    textTransform: 'none',
                    px: 2,
                    py: 1,
                    borderRadius: '10px',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '10px',
                      background: `linear-gradient(
                        135deg,
                        rgba(212,165,165,0.14) 0%,
                        rgba(212,165,165,0.06) 100%
                      )`,
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      zIndex: -1,
                    },
                    '&:hover': {
                      color: BRAND_COLOR,
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

          {/* CTA Desktop */}
          {!isMobile && (
            <Button
              onClick={() => handleNavClick('#contacto')}
              sx={{
                backgroundColor: BRAND_COLOR,
                color: '#fff',
                borderRadius: '14px',
                px: 3,
                py: 1.2,
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: '#c99696',
                },
              }}
            >
              Reservar
            </Button>
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
        </Toolbar>

        {/* Mobile Navigation */}
        {isMobile && mobileMenuOpen && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              pb: 2,
              pt: 1,
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
                  px: 2,
                }}
              >
                {link.label}
              </Button>
            ))}

            <Button
              fullWidth
              onClick={() => handleNavClick('#contacto')}
              sx={{
                mt: 1,
                backgroundColor: BRAND_COLOR,
                color: '#fff',
                borderRadius: '12px',
                py: 1.2,
                '&:hover': {
                  backgroundColor: '#c99696',
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
