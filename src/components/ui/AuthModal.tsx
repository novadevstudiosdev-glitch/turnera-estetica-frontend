'use client';

import {
  Alert,
  Box,
  Button,
  Collapse,
  Dialog,
  DialogContent,
  Grow,
  IconButton,
  InputAdornment,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useMemo, useRef, useState } from 'react';

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
  tab: number;
  onTabChange: (value: number) => void;
};

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isStrongPassword = (value: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).*$/.test(value);

// 🔥 IMPORTANTE: Cambiar estas URLs según tu configuración
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

type GoogleProfile = {
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email?: string;
};

const decodeGoogleProfile = (credential: string): GoogleProfile | null => {
  try {
    const payload = credential.split('.')[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
    const decoded = atob(padded);
    return JSON.parse(decoded) as GoogleProfile;
  } catch {
    return null;
  }
};

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
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerSuccessOpen, setRegisterSuccessOpen] = useState(false);

  // Referencias para Google OAuth
  const googleInitializedRef = useRef(false);

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
      password:
        !registerPassword || registerPassword.length < 8 || !isStrongPassword(registerPassword),
    };
  }, [registerEmail, registerName, registerPassword, submitted]);

  const handleLogin = async () => {
    setSubmitted(true);
    if (!loginErrors.email && !loginErrors.password) {
      setLoginError(null);
      setLoginLoading(true);

      try {
        const recaptchaToken = await getRecaptchaToken('login');
        const baseUrl = API_BASE_URL.replace(/\/$/, '');
        const loginUrl = `${baseUrl}/api/auth/login`;

        const response = await fetch(loginUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: loginEmail.trim(),
            password: loginPassword,
            recaptchaToken,
          }),
        });

        if (!response.ok) {
          const errorData = (await response.json().catch(() => null)) as {
            message?: string | string[];
          } | null;
          const message = Array.isArray(errorData?.message)
            ? errorData?.message.join(' ')
            : errorData?.message;
          throw new Error(message ?? 'No se pudo iniciar sesión.');
        }

        const data = (await response.json()) as {
          accessToken: string;
          user: {
            id: string;
            email: string;
            fullName: string;
            role: string;
            emailVerified: boolean;
            avatarUrl?: string;
          };
        };

        if (typeof window !== 'undefined') {
          localStorage.setItem('turnera_access_token', data.accessToken);
          localStorage.setItem('turnera_user', JSON.stringify(data.user));
          if (data.user.avatarUrl) {
            localStorage.setItem('turnera_google_picture', data.user.avatarUrl);
          } else {
            localStorage.removeItem('turnera_google_picture');
          }
          window.dispatchEvent(new Event('auth-changed'));
        }

        onClose();
      } catch (error) {
        setLoginError(error instanceof Error ? error.message : 'Error al iniciar sesión.');
      } finally {
        setLoginLoading(false);
      }
    }
  };

  const handleRegister = async () => {
    setSubmitted(true);
    if (!registerErrors.name && !registerErrors.email && !registerErrors.password) {
      setRegisterError(null);
      setRegisterLoading(true);

      try {
        const recaptchaToken = await getRecaptchaToken('register');
        const baseUrl = API_BASE_URL.replace(/\/$/, '');
        const registerUrl = `${baseUrl}/api/auth/register`;

        const response = await fetch(registerUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName: registerName.trim(),
            email: registerEmail.trim(),
            password: registerPassword,
            recaptchaToken,
          }),
        });

        if (!response.ok) {
          const errorData = (await response.json().catch(() => null)) as {
            message?: string | string[];
          } | null;
          const message = Array.isArray(errorData?.message)
            ? errorData?.message.join(' ')
            : errorData?.message;
          throw new Error(message ?? 'No se pudo crear la cuenta.');
        }

        setRegisterSuccessOpen(true);
        setSubmitted(false);
        setRegisterName('');
        setRegisterPassword('');
        setLoginEmail(registerEmail.trim());
        setRegisterEmail('');
        onTabChange(0);
      } catch (error) {
        setRegisterError(error instanceof Error ? error.message : 'Error al registrar la cuenta.');
      } finally {
        setRegisterLoading(false);
      }
    }
  };

  const getRecaptchaToken = async (action: string) => {
    if (!RECAPTCHA_SITE_KEY) {
      console.warn('⚠️ RECAPTCHA_SITE_KEY no configurada, usando token fake');
      return 'fake-recaptcha-token-for-development';
    }

    if (typeof window === 'undefined' || !window.grecaptcha) {
      console.warn('⚠️ reCAPTCHA no disponible, usando token fake');
      return 'fake-recaptcha-token-for-development';
    }

    try {
      await new Promise<void>((resolve) => {
        window.grecaptcha?.ready(() => resolve());
      });
      return await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });
    } catch (error) {
      console.error('Error getting reCAPTCHA token:', error);
      return 'fake-recaptcha-token-for-development';
    }
  };

  const initializeGoogleSignIn = () => {
    if (googleInitializedRef.current) return;
    if (!GOOGLE_CLIENT_ID) {
      console.error('❌ GOOGLE_CLIENT_ID no configurado');
      return;
    }
    if (typeof window === 'undefined' || !window.google?.accounts?.id) {
      console.error('❌ Google Identity Services no disponible');
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCallback,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      googleInitializedRef.current = true;
      console.log('✅ Google Sign-In inicializado');
    } catch (error) {
      console.error('Error inicializando Google Sign-In:', error);
    }
  };

  const handleGoogleCallback = async (response: any) => {
    if (!response?.credential) {
      setGoogleError('No se pudo obtener el token de Google.');
      setGoogleLoading(false);
      return;
    }

    try {
      const googleToken = response.credential;
      const recaptchaToken = await getRecaptchaToken('google_auth');
      const baseUrl = API_BASE_URL.replace(/\/$/, '');
      const googleAuthUrl = `${baseUrl}/api/auth/google`;

      console.log('🔑 Enviando token a:', googleAuthUrl);

      const apiResponse = await fetch(googleAuthUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ googleToken, recaptchaToken }),
      });

      if (!apiResponse.ok) {
        const errorData = (await apiResponse.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(errorData?.message ?? 'No se pudo iniciar sesión con Google.');
      }

      const data = (await apiResponse.json()) as {
        accessToken: string;
        user: {
          id: string;
          email: string;
          fullName: string;
          role: string;
          emailVerified: boolean;
          avatarUrl?: string;
        };
      };

      if (typeof window !== 'undefined') {
        const googleProfile = decodeGoogleProfile(googleToken);
        const userPayload = {
          ...data.user,
          fullName: data.user.fullName || googleProfile?.name || googleProfile?.given_name || '',
          avatarUrl: data.user.avatarUrl || googleProfile?.picture,
        };
        localStorage.setItem('turnera_access_token', data.accessToken);
        localStorage.setItem('turnera_user', JSON.stringify(userPayload));
        if (googleProfile?.picture) {
          localStorage.setItem('turnera_google_picture', googleProfile.picture);
        }
        window.dispatchEvent(new Event('auth-changed'));
      }

      console.log('✅ Login con Google exitoso');
      setGoogleLoading(false);
      onClose();
    } catch (error) {
      console.error('❌ Error en Google auth:', error);
      setGoogleError(error instanceof Error ? error.message : 'Error al autenticar con Google.');
      setGoogleLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    if (!GOOGLE_CLIENT_ID) {
      setGoogleError('Falta configurar el Client ID de Google.');
      return;
    }

    setGoogleError(null);
    setGoogleLoading(true);

    try {
      // Inicializar si no está inicializado
      if (!googleInitializedRef.current) {
        initializeGoogleSignIn();
      }

      // Mostrar el prompt de Google
      if (window.google?.accounts?.id) {
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            setGoogleError('No se pudo mostrar el login de Google.');
            setGoogleLoading(false);
          }
        });
      } else {
        throw new Error('Google Identity Services no está disponible');
      }
    } catch (error) {
      console.error('Error al iniciar Google auth:', error);
      setGoogleError('Error al iniciar autenticación con Google.');
      setGoogleLoading(false);
    }
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
    <>
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
              disabled={googleLoading}
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
              {googleLoading ? 'Conectando...' : 'Continuar con Google'}
            </Button>
            {googleError ? (
              <Typography sx={{ color: '#B00020', fontSize: '0.9rem' }}>{googleError}</Typography>
            ) : null}
          </Box>

          {tab === 0 && (
            <Box sx={{ display: 'grid', gap: 2 }}>
              <Collapse in={registerSuccessOpen}>
                <Alert
                  severity="success"
                  onClose={() => setRegisterSuccessOpen(false)}
                  sx={{ mb: 1 }}
                >
                  Registro exitoso. Inicia sesión para continuar.
                </Alert>
              </Collapse>
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
                  ), //hola
                }}
                sx={textFieldSx}
              />
              <Button fullWidth onClick={handleLogin} disabled={loginLoading} sx={actionButtonSx}>
                {loginLoading ? 'Ingresando...' : 'Ingresar'}
              </Button>
              {loginError ? (
                <Typography sx={{ color: '#B00020', fontSize: '0.9rem' }}>{loginError}</Typography>
              ) : null}
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
                helperText={
                  registerErrors.password
                    ? 'Minimo 8, mayuscula, minuscula, numero y simbolo.'
                    : ' '
                }
                FormHelperTextProps={{ sx: { marginLeft: 0 } }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showRegisterPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                        }
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
              <Button
                fullWidth
                onClick={handleRegister}
                disabled={registerLoading}
                sx={actionButtonSx}
              >
                {registerLoading ? 'Creando cuenta...' : 'Crear cuenta'}
              </Button>
              {registerError ? (
                <Typography sx={{ color: '#B00020', fontSize: '0.9rem' }}>
                  {registerError}
                </Typography>
              ) : null}
            </Box>
          )}
        </DialogContent>
      </Dialog>
      <Snackbar
        open={registerSuccessOpen}
        autoHideDuration={4000}
        onClose={(_, reason) => {
          if (reason === 'clickaway') return;
          setRegisterSuccessOpen(false);
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          onClose={() => setRegisterSuccessOpen(false)}
          sx={{ width: '100%' }}
        >
          Registro exitoso
        </Alert>
      </Snackbar>
    </>
  );
}
