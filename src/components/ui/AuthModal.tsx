'use client';

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Grow,
  IconButton,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useMemo, useState } from 'react';

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
  tab: number;
  onTabChange: (value: number) => void;
};

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const GoogleLogo = () => (
  <Box
    component="svg"
    viewBox="0 0 18 18"
    sx={{ width: 18, height: 18, display: 'block' }}
    aria-hidden="true"
  >
    <path
      fill="#4285F4"
      d="M17.64 9.2045c0-.638-.0573-1.2518-.1636-1.8409H9v3.4818h4.8445c-.2082 1.125-.8418 2.0782-1.7895 2.7164v2.2582h2.9055c1.7018-1.5664 2.68-3.8741 2.68-6.6155z"
    />
    <path
      fill="#34A853"
      d="M9 18c2.43 0 4.4673-.8064 5.9564-2.1818l-2.9055-2.2582c-.8064.54-1.8364.8591-3.0509.8591-2.3455 0-4.3336-1.5841-5.0455-3.7105H.9573v2.3305C2.4382 16.5736 5.4818 18 9 18z"
    />
    <path
      fill="#FBBC05"
      d="M3.9545 10.7086A5.41 5.41 0 013.6364 9c0-.5932.1045-1.1686.3181-1.7086V4.9609H.9573A8.9965 8.9965 0 000 9c0 1.4527.3477 2.8282.9573 4.0391l2.9972-2.3305z"
    />
    <path
      fill="#EA4335"
      d="M9 3.5795c1.3218 0 2.5073.4545 3.44 1.3455l2.58-2.58C13.4636.891 11.4264 0 9 0 5.4818 0 2.4382 1.4264.9573 3.9609l2.9972 2.3305C4.6664 5.1636 6.6545 3.5795 9 3.5795z"
    />
  </Box>
);

export function AuthModal({ open, onClose, tab, onTabChange }: AuthModalProps) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const resetValidation = () => setSubmitted(false);

  const loginErrors = useMemo(() => {
    if (!submitted) return { email: false, password: false };
    return {
      email: !loginEmail || !isValidEmail(loginEmail),
      password: !loginPassword || loginPassword.length < 6,
    };
  }, [loginEmail, loginPassword, submitted]);

  const registerErrors = useMemo(() => {
    if (!submitted) return { name: false, email: false, password: false };
    return {
      name: !registerName.trim(),
      email: !registerEmail || !isValidEmail(registerEmail),
      password: !registerPassword || registerPassword.length < 6,
    };
  }, [registerEmail, registerName, registerPassword, submitted]);

  const handleLogin = () => {
    setSubmitted(true);
    if (!loginErrors.email && !loginErrors.password) {
      console.log('login', { email: loginEmail });
      onClose();
    }
  };

  const handleRegister = () => {
    setSubmitted(true);
    if (!registerErrors.name && !registerErrors.email && !registerErrors.password) {
      console.log('register', { name: registerName, email: registerEmail });
      onClose();
    }
  };

  const handleGoogleAuth = () => {
    // TODO: Integrar con tu proveedor de autenticación (NextAuth/Firebase) cuando corresponda.
    console.log('google-auth');
  };

  const textFieldSx = {
    '& .MuiInputBase-root': {
      borderRadius: '14px',
      backgroundColor: '#FFFFFF',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#E6DDDA',
      borderWidth: '1px',
    },
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#DCCBC6',
    },
    '& .MuiInputBase-input': {
      padding: '14px 16px',
      fontSize: '0.96rem',
      color: '#2C2C2C',
    },
    '& .MuiInputLabel-root': {
      color: '#6B6B6B',
      fontWeight: 500,
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#D4A5A5',
    },
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#D4A5A5',
      boxShadow: '0 0 0 4px rgba(212, 165, 165, 0.15)',
    },
  } as const;

  const actionButtonSx = {
    borderRadius: '999px',
    minHeight: 50,
    backgroundColor: '#EEBBC3',
    color: '#2C2C2C',
    border: '1px solid #D4A5A5',
    boxShadow: '0 10px 22px rgba(238, 187, 195, 0.25)',
    textTransform: 'none',
    fontWeight: 600,
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#FFB8C6',
      boxShadow: '0 14px 26px rgba(238, 187, 195, 0.32)',
      transform: 'translateY(-1px)',
    },
    '&:active': {
      transform: 'scale(0.98)',
    },
  } as const;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Grow}
      TransitionProps={{ timeout: 220 }}
      fullWidth
      maxWidth="xs"
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(4px)',
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: '24px',
          backgroundColor: '#FFFCFA',
          boxShadow: '0 20px 55px rgba(0,0,0,0.14)',
          maxWidth: 440,
          width: '100%',
          overflow: 'visible',
        },
      }}
    >
      <DialogContent sx={{ p: { xs: 3, md: 4 }, position: 'relative' }}>
        <IconButton
          aria-label="Cerrar"
          onClick={onClose}
          sx={{ position: 'absolute', right: 12, top: 12, color: '#3D3D3D' }}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontFamily: '"Cormorant Garamond", serif',
              fontWeight: 600,
              color: '#2C2C2C',
              mb: 0.5,
            }}
          >
            Mi cuenta
          </Typography>
          <Typography sx={{ color: '#6B6B6B' }}>Accedé para reservar más rápido</Typography>
        </Box>

        <Tabs
          value={tab}
          onChange={(_, value) => {
            resetValidation();
            onTabChange(value);
          }}
          variant="fullWidth"
          aria-label="Autenticación"
          sx={{
            mb: 3,
            p: 0.5,
            backgroundColor: '#F5EAEA',
            borderRadius: '999px',
            border: '1px solid #EFE3E3',
            minHeight: 44,
            '& .MuiTabs-indicator': {
              display: 'none',
            },
          }}
        >
          <Tab
            disableRipple
            label="Ingresar"
            sx={{
              minHeight: 38,
              textTransform: 'none',
              fontWeight: 600,
              color: '#7A7A7A',
              borderRadius: '999px',
              '&.Mui-selected': {
                color: '#2C2C2C',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
              },
            }}
          />
          <Tab
            disableRipple
            label="Crear cuenta"
            sx={{
              minHeight: 38,
              textTransform: 'none',
              fontWeight: 600,
              color: '#7A7A7A',
              borderRadius: '999px',
              '&.Mui-selected': {
                color: '#2C2C2C',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
              },
            }}
          />
        </Tabs>

        <Box sx={{ display: 'grid', gap: 2, mb: 3 }}>
          <Button
            fullWidth
            onClick={handleGoogleAuth}
            startIcon={<GoogleLogo />}
            aria-label="Continuar con Google"
            sx={{
              borderRadius: '12px',
              minHeight: 48,
              backgroundColor: '#FFFFFF',
              color: '#2C2C2C',
              border: '1px solid #E1DDD8',
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 6px 18px rgba(0,0,0,0.04)',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: '#FFF7F8',
                boxShadow: '0 10px 22px rgba(0,0,0,0.08)',
              },
            }}
          >
            Continuar con Google
          </Button>
        </Box>

        {tab === 0 && (
          <Box sx={{ display: 'grid', gap: 2 }}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={loginEmail}
              onChange={(event) => setLoginEmail(event.target.value)}
              error={loginErrors.email}
              helperText={loginErrors.email ? 'Ingresá un email válido.' : ' '}
              FormHelperTextProps={{ sx: { marginLeft: 0 } }}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Contraseña"
              type={showLoginPassword ? 'text' : 'password'}
              variant="outlined"
              value={loginPassword}
              onChange={(event) => setLoginPassword(event.target.value)}
              error={loginErrors.password}
              helperText={loginErrors.password ? 'Mínimo 6 caracteres.' : ' '}
              FormHelperTextProps={{ sx: { marginLeft: 0 } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showLoginPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      onClick={() => setShowLoginPassword((prev) => !prev)}
                      edge="end"
                      sx={{ color: '#B68484' }}
                    >
                      {showLoginPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={textFieldSx}
            />
            <Button fullWidth onClick={handleLogin} sx={actionButtonSx}>
              Ingresar
            </Button>
          </Box>
        )}

        {tab === 1 && (
          <Box sx={{ display: 'grid', gap: 2 }}>
            <TextField
              fullWidth
              label="Nombre"
              variant="outlined"
              value={registerName}
              onChange={(event) => setRegisterName(event.target.value)}
              error={registerErrors.name}
              helperText={registerErrors.name ? 'Ingresá tu nombre.' : ' '}
              FormHelperTextProps={{ sx: { marginLeft: 0 } }}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={registerEmail}
              onChange={(event) => setRegisterEmail(event.target.value)}
              error={registerErrors.email}
              helperText={registerErrors.email ? 'Ingresá un email válido.' : ' '}
              FormHelperTextProps={{ sx: { marginLeft: 0 } }}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Contraseña"
              type={showRegisterPassword ? 'text' : 'password'}
              variant="outlined"
              value={registerPassword}
              onChange={(event) => setRegisterPassword(event.target.value)}
              error={registerErrors.password}
              helperText={registerErrors.password ? 'Mínimo 6 caracteres.' : ' '}
              FormHelperTextProps={{ sx: { marginLeft: 0 } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showRegisterPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      onClick={() => setShowRegisterPassword((prev) => !prev)}
                      edge="end"
                      sx={{ color: '#B68484' }}
                    >
                      {showRegisterPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={textFieldSx}
            />
            <Button fullWidth onClick={handleRegister} sx={actionButtonSx}>
              Crear cuenta
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
