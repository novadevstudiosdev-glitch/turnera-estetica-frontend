'use client';

import {
  AppBar,
  Box,
  Chip,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Toolbar,
  Button,
  IconButton,
  Stack,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import Link from 'next/link';
import { useEffect, useState, MouseEvent } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { AuthModal } from '../ui/AuthModal';
import { useRouter } from 'next/navigation';
import { keyframes } from '@mui/system';
import { products } from '@/lib/data';

const NAVIGATION_LINKS = [
  { label: 'Inicio', href: '#hero' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Testimonios', href: '#testimonios' },
  { label: 'Ubicación', href: '#ubicacion' },
];

const accountBreathing = keyframes`
  0% {
    opacity: 0.86;
    transform: translateY(0px) scale(1);
    filter: drop-shadow(0 0 0 rgba(212, 165, 165, 0));
  }
  50% {
    opacity: 1;
    transform: translateY(-6px) scale(1.03);
    filter: drop-shadow(0 8px 18px rgba(212, 165, 165, 0.38));
  }
  100% {
    opacity: 0.92;
    transform: translateY(0px) scale(1);
    filter: drop-shadow(0 0 0 rgba(212, 165, 165, 0));
  }
`;

const accountPing = keyframes`
  0%,
  70% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.85);
  }
  78% {
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.8);
  }
`;

const heartFloat = keyframes`
  0% {
    opacity: 0;
    transform: translate(-50%, 6px) scale(0.6);
  }
  12% {
    opacity: 0.9;
    transform: translate(calc(-50% - 2px), 0px) scale(0.95);
  }
  28% {
    opacity: 0.85;
    transform: translate(calc(-50% + 2px), -6px) scale(1);
  }
  45% {
    opacity: 0.7;
    transform: translate(calc(-50% - 2px), -12px) scale(1);
  }
  65% {
    opacity: 0.55;
    transform: translate(calc(-50% + 2px), -20px) scale(0.98);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -30px) scale(0.8);
  }
`;

export function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [productsModalOpen, setProductsModalOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [userName, setUserName] = useState<string | null>(null);
  const [accountAnchorEl, setAccountAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const displayName = userName
    ? userName.includes('@')
      ? userName.split('@')[0]
      : userName.split(' ')[0]
    : null;
  const accountMenuOpen = Boolean(accountAnchorEl);
  const accountInitial = displayName ? displayName.charAt(0).toUpperCase() : '';

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const readUser = () => {
      if (typeof window === 'undefined') return;
      const stored = localStorage.getItem('turnera_user');
      if (!stored) {
        setUserName(null);
        return;
      }
      try {
        const parsed = JSON.parse(stored) as {
          fullName?: string;
          name?: string;
          firstName?: string;
          email?: string;
        };
        const nameCandidates = [
          parsed?.fullName,
          parsed?.name,
          parsed?.firstName,
          parsed?.email,
        ]
          .map((value) => (value ?? '').trim())
          .filter((value) => value.length > 0);
        setUserName(nameCandidates[0] ?? null);
      } catch {
        setUserName(null);
      }
    };

    readUser();
    window.addEventListener('auth-changed', readUser);
    window.addEventListener('storage', readUser);
    return () => {
      window.removeEventListener('auth-changed', readUser);
      window.removeEventListener('storage', readUser);
    };
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

  const handleOpenAuth = (nextTab?: number) => {
    setAuthOpen(true);
    setTab(nextTab ?? 0);
    setMobileMenuOpen(false);
  };

  const handleAccountClick = (event: MouseEvent<HTMLElement>) => {
    if (userName) {
      setAccountAnchorEl(event.currentTarget);
    } else {
      handleOpenAuth(0);
    }
  };

  const handleCloseAccountMenu = () => {
    setAccountAnchorEl(null);
  };

  const handleGoProfile = () => {
    handleCloseAccountMenu();
    setMobileMenuOpen(false);
    router.push('/dashboard');
  };

  const handleLogout = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('turnera_access_token');
    localStorage.removeItem('turnera_user');
    window.dispatchEvent(new Event('auth-changed'));
    router.push('/');
    setMobileMenuOpen(false);
    handleCloseAccountMenu();
  };

  const productsByCategory = products.reduce<Record<string, typeof products>>((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});

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
              <Button
                onClick={() => setProductsModalOpen(true)}
                disableRipple
                disableFocusRipple
                sx={navItemStyle}
              >
                Productos
              </Button>
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
            {displayName ? (
              <>
                <Button
                  onClick={handleAccountClick}
                  endIcon={<PersonOutlineIcon sx={{ fontSize: 20 }} />}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    color: '#2C2C2C',
                    borderRadius: '999px',
                    px: 1.2,
                    py: 0.8,
                    gap: 1.2,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(212, 165, 165, 0.4)',
                    boxShadow: '0 8px 18px rgba(212, 165, 165, 0.16)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: '50%',
                      background:
                        'linear-gradient(135deg, rgba(238,187,195,0.85), rgba(212,165,165,0.9))',
                      color: '#2C2C2C',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {accountInitial}
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Typography sx={{ fontSize: '0.78rem', color: '#9B7C7C', lineHeight: 1.2 }}>
                      Mi cuenta
                    </Typography>
                    <Typography sx={{ fontSize: '0.98rem', fontWeight: 600, lineHeight: 1.3 }}>
                      {displayName}
                    </Typography>
                  </Box>
                </Button>
                <Menu
                  anchorEl={accountAnchorEl}
                  open={accountMenuOpen}
                  onClose={handleCloseAccountMenu}
                  PaperProps={{
                    sx: {
                      borderRadius: 2,
                      mt: 1,
                      minWidth: 220,
                      boxShadow: '0 20px 45px rgba(0,0,0,0.12)',
                      border: '1px solid rgba(212, 165, 165, 0.25)',
                    },
                  }}
                >
                  <MenuItem onClick={handleGoProfile}>
                    <ListItemIcon>
                      <PersonOutlineIcon fontSize="small" />
                    </ListItemIcon>
                    Mi perfil
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ color: '#B02E2E' }}>
                    <ListItemIcon sx={{ color: 'inherit' }}>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Cerrar sesión
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Tooltip title="Ingresar / Registrarse" placement="bottom" arrow>
                <IconButton
                  aria-label="Cuenta"
                  onClick={() => handleOpenAuth(0)}
                  disableRipple
                  sx={{
                    p: 1.3,
                    color: '#D4A5A5',
                    backgroundColor: 'transparent',
                    borderRadius: '999px',
                    position: 'relative',
                    animation: `${accountBreathing} 1.4s ease-in-out infinite`,
                    transition: 'color 0.2s ease, transform 0.2s ease',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: 34,
                      height: 34,
                      borderRadius: '50%',
                      border: '1px solid rgba(212, 165, 165, 0.35)',
                      transform: 'translate(-50%, -50%) scale(0.85)',
                      opacity: 0,
                      animation: `${accountPing} 8s ease-out infinite`,
                      pointerEvents: 'none',
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      left: '50%',
                      bottom: 2,
                      width: '0%',
                      height: 2,
                      borderRadius: 999,
                      background: 'rgba(212, 165, 165, 0.6)',
                      transform: 'translateX(-50%)',
                      opacity: 0,
                      transition: 'all 0.2s ease',
                    },
                    '&:hover': {
                      animationPlayState: 'paused',
                      transform: 'translateY(-3px)',
                      color: '#B68484',
                      backgroundColor: 'transparent',
                    },
                    '&:hover::before': {
                      animationPlayState: 'paused',
                    },
                    '&:hover::after': {
                      width: '70%',
                      opacity: 1,
                    },
                    '&:active': {
                      transform: 'translateY(-3px) scale(0.96)',
                    },
                    '&.Mui-focusVisible': {
                      animationPlayState: 'paused',
                      boxShadow: '0 0 0 4px rgba(238, 187, 195, 0.18)',
                    },
                  }}
                >
                  <PersonOutlineIcon sx={{ fontSize: 28 }} />
                  <Box
                    sx={{
                      position: 'absolute',
                      left: '50%',
                      top: 6,
                      width: 13,
                      height: 13,
                      transform: 'translateX(-50%)',
                      pointerEvents: 'none',
                      animation: `${heartFloat} 2.8s ease-in-out infinite`,
                      animationDelay: '0.4s',
                      color: '#EE8FA0',
                    }}
                  >
                    <FavoriteIcon
                      sx={{
                        fontSize: 13,
                        filter: 'drop-shadow(0 6px 10px rgba(238, 143, 160, 0.35))',
                      }}
                    />
                  </Box>
                </IconButton>
              </Tooltip>
            )}

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
              onClick={() => {
                setProductsModalOpen(true);
                setMobileMenuOpen(false);
              }}
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
              Productos
            </Button>
            <Button
              fullWidth
              onClick={displayName ? handleGoProfile : () => handleOpenAuth(0)}
              startIcon={<PersonOutlineIcon />}
              sx={{
                ...navItemStyle,
                justifyContent: 'flex-start',
                width: '100%',
                fontSize: '1rem',
                px: 0,
                color: '#2C2C2C',
              }}
            >
              {displayName ? `Perfil de ${displayName}` : 'Cuenta'}
            </Button>
            {displayName && (
              <Button
                fullWidth
                onClick={handleLogout}
                sx={{
                  ...navItemStyle,
                  justifyContent: 'flex-start',
                  width: '100%',
                  fontSize: '1rem',
                  px: 0,
                  color: '#7A5A5A',
                }}
              >
                Cerrar sesión
              </Button>
            )}
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
      <Dialog
        open={productsModalOpen}
        onClose={() => setProductsModalOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ pr: 6 }}>
          Todos los productos por categoria
          <IconButton
            onClick={() => setProductsModalOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
            aria-label="Cerrar productos"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5}>
            {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
              <Box key={category}>
                <Typography sx={{ fontWeight: 700, color: '#8F5161', mb: 1.2 }}>
                  {category}
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                    gap: 1.5,
                  }}
                >
                  {categoryProducts.map((product) => (
                    <Box
                      key={product.id}
                      sx={{
                        border: '1px solid #ECE7E3',
                        borderRadius: '12px',
                        p: 1.5,
                        backgroundColor: '#FFFFFF',
                      }}
                    >
                      <Box
                        component="img"
                        src={product.image}
                        alt={product.name}
                        sx={{
                          width: '100%',
                          height: 120,
                          objectFit: 'cover',
                          borderRadius: '8px',
                          mb: 1,
                        }}
                      />
                      <Typography sx={{ fontWeight: 700, color: '#1A1A1A' }}>
                        {product.icon} {product.name}
                      </Typography>
                      <Typography sx={{ fontSize: '0.88rem', color: '#666666', mt: 0.5 }}>
                        {product.description}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                        <Chip
                          label={product.presentation}
                          size="small"
                          sx={{ backgroundColor: '#EFEDEB', color: '#555555' }}
                        />
                      </Stack>
                      <Typography sx={{ fontWeight: 700, color: '#C48A9A', mt: 1 }}>
                        {product.price}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Stack>
        </DialogContent>
      </Dialog>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} tab={tab} onTabChange={setTab} />
    </AppBar>
  );
}
