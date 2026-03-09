'use client';

import { useEffect, useState } from 'react';
import {
  Fab,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Rating,
  Stack,
  Typography,
} from '@mui/material';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { createReview } from '@/services/reviews';

type AppointmentOption = {
  id: string;
  label: string;
  status: string;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
const appointmentsMyUrl = apiBaseUrl
  ? `${apiBaseUrl.replace(/\/$/, '')}/api/appointments/my-appointments`
  : '';

const isCompletedStatus = (value: unknown) => {
  const normalized = String(value ?? '').toLowerCase();
  return normalized === 'completed' || normalized === 'completado';
};

const resolveAppointmentDateTime = (raw: Record<string, unknown>) => {
  const rawDate =
    (raw.appointmentDate as string | undefined) ??
    (raw.date as string | undefined) ??
    (raw.start as string | undefined) ??
    (raw.datetime as string | undefined) ??
    (raw.dateTime as string | undefined);
  const rawTime =
    (raw.appointmentTime as string | undefined) ??
    (raw.time as string | undefined) ??
    (raw.startTime as string | undefined);

  if (rawDate) {
    const parsed = new Date(rawDate);
    if (!Number.isNaN(parsed.getTime())) {
      return {
        date: parsed.toLocaleDateString('es-AR'),
        time: rawTime ? rawTime.slice(0, 5) : parsed.toISOString().slice(11, 16),
      };
    }
    if (rawDate.includes('T')) {
      return { date: rawDate.slice(0, 10), time: rawDate.slice(11, 16) };
    }
    return { date: rawDate.slice(0, 10), time: rawTime ? rawTime.slice(0, 5) : '' };
  }

  return { date: '', time: '' };
};

const normalizeAppointmentOption = (raw: Record<string, unknown>, index: number): AppointmentOption => {
  const idValue =
    (raw.id as string | number | undefined) ??
    (raw._id as string | number | undefined) ??
    (raw.appointmentId as string | number | undefined) ??
    `appt-${index + 1}`;
  const serviceValue =
    (raw.service as { name?: string } | undefined)?.name ??
    (raw.serviceName as string | undefined) ??
    (raw.title as string | undefined) ??
    'Servicio';
  const { date, time } = resolveAppointmentDateTime(raw);
  const labelParts = [serviceValue, date, time].filter(Boolean);
  return {
    id: String(idValue),
    status: String(raw.status ?? '').toLowerCase(),
    label: labelParts.join(' · ') || `Turno ${index + 1}`,
  };
};

export function ReviewFloatingButton() {
  const [open, setOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [appointmentId, setAppointmentId] = useState('');
  const [appointments, setAppointments] = useState<AppointmentOption[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const readAuth = () => {
      if (typeof window === 'undefined') return;
      const user = localStorage.getItem('turnera_user');
      const token = localStorage.getItem('turnera_access_token');
      setIsAuthenticated(Boolean(user || token));
    };
    readAuth();
    window.addEventListener('auth-changed', readAuth);
    window.addEventListener('storage', readAuth);
    return () => {
      window.removeEventListener('auth-changed', readAuth);
      window.removeEventListener('storage', readAuth);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setOpen(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!open) return;
    if (typeof window === 'undefined') return;
    const storedUser = localStorage.getItem('turnera_user');
    if (storedUser && !name) {
      try {
        const parsed = JSON.parse(storedUser) as { fullName?: string; name?: string; email?: string };
        const fallbackName = parsed.fullName || parsed.name || parsed.email || '';
        if (fallbackName) setName(fallbackName);
      } catch {
        // ignore
      }
    }
  }, [open, name]);

  useEffect(() => {
    if (!open) return;
    if (typeof window === 'undefined') return;
    let mounted = true;
    const controller = new AbortController();

    const loadAppointments = async () => {
      setAppointmentsLoading(true);
      try {
        const token = localStorage.getItem('turnera_access_token');
        if (!token) {
          if (mounted) {
            setAppointments([]);
          }
          return;
        }
        if (!appointmentsMyUrl) {
          if (mounted) {
            setAppointments([]);
          }
          return;
        }
        const response = await fetch(appointmentsMyUrl, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const rawText = await response.text();
        let parsed: unknown = rawText;
        try {
          parsed = JSON.parse(rawText);
        } catch {
          parsed = rawText;
        }
        const list = Array.isArray(parsed)
          ? parsed
          : Array.isArray((parsed as { data?: unknown }).data)
            ? ((parsed as { data?: unknown }).data as unknown[])
            : [];
        const normalized = list
          .map((item, index) => normalizeAppointmentOption(item as Record<string, unknown>, index))
          .filter((item) => isCompletedStatus(item.status));
        if (mounted) {
          setAppointments(normalized);
          if (!appointmentId && normalized.length > 0) {
            setAppointmentId(normalized[0].id);
          }
        }
      } catch {
        if (mounted) {
          setAppointments([]);
        }
      } finally {
        if (mounted) setAppointmentsLoading(false);
      }
    };

    loadAppointments();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [open]);

  const handleOpen = () => {
    setOpen(true);
    setError(null);
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  const handleSubmit = () => {
    if (typeof window === 'undefined') return;
    const cleanName = name.trim();
    const cleanComment = comment.trim();
    const safeRating = rating ?? 0;
    if (!appointmentId) {
      setError('No podés dejar una reseña hasta que saques un turno.');
      return;
    }
    if (!cleanName) {
      setError('Completa tu nombre.');
      return;
    }
    if (safeRating < 1) {
      setError('Selecciona una calificación.');
      return;
    }
    const token = localStorage.getItem('turnera_access_token');
    if (!token) {
      setError('Necesitas iniciar sesión para dejar una reseña.');
      return;
    }
    setSubmitting(true);
    createReview(
      {
        rating: Math.min(5, Math.max(1, safeRating)),
        appointmentId,
        comment: cleanComment || undefined,
        reviewerName: cleanName,
      },
      token,
    )
      .then(() => {
        setName('');
        setComment('');
        setRating(null);
        setAppointmentId('');
        setOpen(false);
      })
      .catch((err: unknown) => {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('No pudimos enviar tu reseña.');
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <Tooltip title="Dejar reseña" placement="left" arrow>
        <Fab
          aria-label="Dejar reseña"
          onClick={handleOpen}
          sx={{
            position: 'fixed',
            right: { xs: 16, md: 24 },
            bottom: { xs: 12, md: 18 },
            zIndex: 1400,
            backgroundColor: '#C47A85',
            color: '#FFFFFF',
            boxShadow: '0 12px 24px rgba(196, 122, 133, 0.35)',
            '&:hover': {
              backgroundColor: '#B56C77',
              boxShadow: '0 16px 30px rgba(196, 122, 133, 0.45)',
            },
          }}
        >
          <RateReviewIcon sx={{ fontSize: 28 }} />
        </Fab>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>Dejar reseña</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 4, overflow: 'visible' }}>
          <TextField
            label="Nombre"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Tu nombre"
            sx={{ mt: 0.5 }}
          />
          <TextField
            label="Comentario"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Contanos tu experiencia"
            multiline
            minRows={3}
          />
          <Stack spacing={1}>
            <Typography sx={{ color: '#6B6B6B', fontSize: '0.85rem' }}>
              Calificación
            </Typography>
            <Rating
              value={rating}
              onChange={(_, value) => setRating(value)}
              sx={{ color: '#D4A5A5' }}
            />
          </Stack>
          {error && <Typography sx={{ color: '#B00020', fontSize: '0.9rem' }}>{error}</Typography>}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting || appointmentsLoading}
          >
            {submitting ? 'Enviando...' : 'Enviar reseña'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

