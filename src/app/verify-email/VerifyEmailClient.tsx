'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@mui/material';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
const verifyEmailUrl = `${apiBaseUrl.replace(/\/$/, '')}/api/auth/verify-email`;

type StatusState = 'idle' | 'loading' | 'success' | 'error';

export default function VerifyEmailClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<StatusState>('idle');
  const [message, setMessage] = useState<string>('');

  const token = useMemo(() => searchParams?.get('token') ?? '', [searchParams]);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Falta el token de verificacion. Por favor revisa tu correo nuevamente.');
      return;
    }

    let mounted = true;
    const controller = new AbortController();

    const verify = async () => {
      setStatus('loading');
      try {
        if (!verifyEmailUrl) {
          throw new Error('Falta configurar NEXT_PUBLIC_API_BASE_URL.');
        }
        const response = await fetch(verifyEmailUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
          signal: controller.signal,
        });
        if (!response.ok) {
          const errorData = (await response.json().catch(() => null)) as {
            message?: string | string[];
          } | null;
          const messageText = Array.isArray(errorData?.message)
            ? errorData?.message.join(' ')
            : errorData?.message;
          throw new Error(messageText ?? 'No se pudo verificar el correo.');
        }

        if (!mounted) return;
        setStatus('success');
        setMessage('Correo verificado con exito. Te vamos a llevar a tu cuenta.');

        const storedUser =
          typeof window !== 'undefined' ? localStorage.getItem('turnera_user') : null;
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser) as { role?: string };
            const role = parsed?.role?.toLowerCase();
            router.replace(role === 'admin' ? '/admin' : '/dashboard');
            return;
          } catch {
            // ignore
          }
        }

        router.replace('/?auth=login&next=/dashboard');
      } catch (error) {
        if (!mounted) return;
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'No se pudo verificar el correo.');
      }
    };

    verify();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [router, token]);

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
            <Stack spacing={2} alignItems="center" textAlign="center">
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#2C2C2C' }}>
                Verificacion de correo
              </Typography>
              {status === 'loading' && <CircularProgress />}
              {message ? (
                <Typography sx={{ color: status === 'error' ? '#B00020' : '#6B6B6B' }}>
                  {message}
                </Typography>
              ) : null}
              {status === 'error' && (
                <Button
                  variant="contained"
                  onClick={() => router.replace('/?auth=login&next=/dashboard')}
                  sx={{ borderRadius: '999px' }}
                >
                  Ir al login
                </Button>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
