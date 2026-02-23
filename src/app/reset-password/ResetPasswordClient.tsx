'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
const resetPasswordUrl = `${apiBaseUrl.replace(/\/$/, '')}/api/auth/reset-password`;

const isStrongPassword = (value: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).*$/.test(value);

type StatusState = 'idle' | 'loading' | 'success' | 'error';

export default function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<StatusState>('idle');
  const [message, setMessage] = useState<string>('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const token = useMemo(() => searchParams?.get('token') ?? '', [searchParams]);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Falta el token de recuperacion. Por favor revisa tu correo nuevamente.');
    }
  }, [token]);

  const handleSubmit = async () => {
    if (!token) return;
    if (!password || password.length < 8 || !isStrongPassword(password)) {
      setStatus('error');
      setMessage('La contrasena no cumple los requisitos.');
      return;
    }
    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Las contrasenas no coinciden.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      if (!resetPasswordUrl) {
        throw new Error('Falta configurar NEXT_PUBLIC_API_BASE_URL.');
      }
      const response = await fetch(resetPasswordUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => null)) as {
          message?: string | string[];
        } | null;
        const messageText = Array.isArray(errorData?.message)
          ? errorData?.message.join(' ')
          : errorData?.message;
        throw new Error(messageText ?? 'No se pudo restablecer la contrasena.');
      }

      setStatus('success');
      setMessage('Contrasena actualizada. Te llevamos al login.');
      setTimeout(() => {
        router.replace('/?auth=login&next=/dashboard');
      }, 1200);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'No se pudo restablecer la contrasena.');
    }
  };

  return (
    <Box sx={{ backgroundColor: '#FFF9F9', minHeight: '100vh', py: { xs: 6, md: 10 } }}>
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: '20px',
            border: '1px solid #F0DEDE',
            boxShadow: '0 12px 26px rgba(0,0,0,0.08)',
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={2.5} alignItems="stretch" textAlign="center">
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#2C2C2C' }}>
                Recuperar contrasena
              </Typography>

              {message && (
                <Alert severity={status === 'error' ? 'error' : 'success'}>{message}</Alert>
              )}

              <TextField
                fullWidth
                label="Nueva contrasena"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Confirmar contrasena"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showConfirmPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'
                        }
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={status === 'loading' || !token}
                sx={{ borderRadius: '999px', py: 1.2 }}
              >
                {status === 'loading' ? <CircularProgress size={22} /> : 'Guardar nueva contrasena'}
              </Button>

              {status === 'error' && !token && (
                <Button
                  variant="outlined"
                  onClick={() => router.replace('/?auth=login&next=/dashboard')}
                >
                  Ir al login
                </Button>
              )}

              <Typography sx={{ color: '#6B6B6B', fontSize: '0.88rem' }}>
                Minimo 8 caracteres, con mayuscula, minuscula, numero y simbolo.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
