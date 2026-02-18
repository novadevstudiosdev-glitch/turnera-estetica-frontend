'use client';

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type AppointmentStatus = 'Pendiente' | 'Confirmado' | 'Reprogramado' | 'Cancelado';

type Appointment = {
  id: string;
  service: string;
  location: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: AppointmentStatus;
};

type ApiAppointment = Record<string, unknown>;

const initialAppointments: Appointment[] = [
  {
    id: 'AP-1001',
    service: 'Mesoterapia Facial',
    location: 'Rosario',
    date: '2026-03-10',
    time: '15:30',
    status: 'Confirmado',
  },
  {
    id: 'AP-1002',
    service: 'Limpieza profunda',
    location: 'Correa',
    date: '2026-02-25',
    time: '11:00',
    status: 'Pendiente',
  },
  {
    id: 'AP-1003',
    service: 'Botox',
    location: 'Rosario',
    date: '2026-02-18',
    time: '09:00',
    status: 'Pendiente',
  },
];

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
const appointmentsUrl = `${apiBaseUrl.replace(/\/$/, '')}/api/appointments`;

const statusColor = (status: AppointmentStatus) => {
  switch (status) {
    case 'Confirmado':
      return 'success';
    case 'Pendiente':
      return 'warning';
    case 'Reprogramado':
      return 'info';
    case 'Cancelado':
      return 'default';
    default:
      return 'default';
  }
};

const toDateTime = (date: string, time: string) => {
  const parsed = new Date(`${date}T${time}:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const canModify = (appointment: Appointment) => {
  if (appointment.status === 'Cancelado') return false;
  const dateTime = toDateTime(appointment.date, appointment.time);
  if (!dateTime) return false;
  const diffHours = (dateTime.getTime() - Date.now()) / 36e5;
  return diffHours >= 48;
};

const normalizeStatus = (value: unknown): AppointmentStatus => {
  const normalized = String(value ?? '').toLowerCase();
  if (['confirmado', 'confirmed'].includes(normalized)) return 'Confirmado';
  if (['reprogramado', 'rescheduled'].includes(normalized)) return 'Reprogramado';
  if (['cancelado', 'canceled', 'cancelled'].includes(normalized)) return 'Cancelado';
  return 'Pendiente';
};

const resolveDateTime = (raw: ApiAppointment) => {
  const rawDate =
    (raw.date as string | undefined) ??
    (raw.appointmentDate as string | undefined) ??
    (raw.start as string | undefined) ??
    (raw.datetime as string | undefined) ??
    (raw.dateTime as string | undefined);

  const rawTime = (raw.time as string | undefined) ?? (raw.startTime as string | undefined);

  if (rawDate) {
    const parsed = new Date(rawDate);
    if (!Number.isNaN(parsed.getTime())) {
      const iso = parsed.toISOString();
      return { date: iso.slice(0, 10), time: iso.slice(11, 16) };
    }
    if (rawTime) {
      return { date: rawDate.slice(0, 10), time: rawTime.slice(0, 5) };
    }
    if (rawDate.includes('T')) {
      return { date: rawDate.slice(0, 10), time: rawDate.slice(11, 16) };
    }
  }

  return { date: '', time: '' };
};

const normalizeAppointment = (raw: ApiAppointment, index: number): Appointment => {
  const id = String(
    (raw.id as string | number | undefined) ??
      (raw._id as string | number | undefined) ??
      (raw.appointmentId as string | number | undefined) ??
      `AP-${index + 1}`
  );
  const serviceValue =
    (raw.service as string | undefined) ??
    (raw.serviceName as string | undefined) ??
    (raw.title as string | undefined) ??
    (raw.service as { name?: string; title?: string } | undefined)?.name ??
    (raw.service as { name?: string; title?: string } | undefined)?.title ??
    'Servicio';
  const locationValue =
    (raw.location as string | undefined) ??
    (raw.branch as string | undefined) ??
    (raw.city as string | undefined) ??
    (raw.location as { name?: string } | undefined)?.name ??
    'Sucursal';
  const { date, time } = resolveDateTime(raw);
  return {
    id,
    service: serviceValue,
    location: locationValue,
    date: date || new Date().toISOString().slice(0, 10),
    time: time || '09:00',
    status: normalizeStatus(raw.status),
  };
};

export default function ClientDashboardPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState(initialAppointments);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('turnera_user');
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as { role?: string };
      const role = parsed?.role?.toLowerCase();
      if (role === 'admin') {
        router.replace('/admin');
      }
    } catch {
      // ignore
    }
  }, [router]);

  const pendingAppointments = useMemo(
    () => appointments.filter((appt) => appt.status !== 'Cancelado'),
    [appointments]
  );

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const loadAppointments = async () => {
      setLoading(true);
      setError(null);
      try {
        const token =
          typeof window !== 'undefined' ? localStorage.getItem('turnera_access_token') : null;
        const response = await fetch(appointmentsUrl, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
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
        if (Array.isArray(parsed) && parsed.length > 0) {
          const normalized = parsed.map((item, index) =>
            normalizeAppointment(item as ApiAppointment, index)
          );
          if (mounted) setAppointments(normalized);
        } else {
          if (mounted) {
            setError('No se encontraron turnos en el servidor. Mostrando ejemplo.');
            setAppointments(initialAppointments);
          }
        }
      } catch (err) {
        if (mounted) {
          setError('No se pudieron cargar los turnos desde el servidor.');
          setAppointments(initialAppointments);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (appointmentsUrl) {
      loadAppointments();
    } else {
      setLoading(false);
      setError('Falta configurar NEXT_PUBLIC_API_BASE_URL.');
    }

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  const handleOpenReserva = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('open-reserva-modal'));
    }
  };

  const handleCancel = async (id: string) => {
    try {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('turnera_access_token') : null;
      const response = await fetch(`${appointmentsUrl}/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      setAppointments((prev) =>
        prev.map((appt) => (appt.id === id ? { ...appt, status: 'Cancelado' } : appt))
      );
    } catch {
      setError('No se pudo cancelar el turno. Intenta nuevamente.');
    }
  };

  const handleOpenReschedule = (appointment: Appointment) => {
    setRescheduleTarget(appointment);
    setNewDate(appointment.date);
    setNewTime(appointment.time);
    setRescheduleOpen(true);
  };

  const handleConfirmReschedule = async () => {
    if (!rescheduleTarget) return;
    if (!newDate || !newTime) return;

    try {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('turnera_access_token') : null;
      const response = await fetch(`${appointmentsUrl}/${rescheduleTarget.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          date: newDate,
          time: newTime,
          status: 'Reprogramado',
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === rescheduleTarget.id
            ? {
                ...appt,
                date: newDate,
                time: newTime,
                status: 'Reprogramado',
              }
            : appt
        )
      );
      setRescheduleOpen(false);
    } catch {
      setError('No se pudo reprogramar el turno. Intenta nuevamente.');
    }
  };

  return (
    <Box sx={{ backgroundColor: '#FFF9F9', minHeight: '100vh', py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        <Stack spacing={2} sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#2C2C2C' }}>
            Mi dashboard
          </Typography>
          <Typography sx={{ color: '#6B6B6B' }}>
            Gestiona tus turnos pendientes. Podras cancelar o reprogramar hasta 48 horas antes.
          </Typography>
          <Button
            variant="contained"
            onClick={handleOpenReserva}
            sx={{ alignSelf: 'flex-start', px: 3 }}
          >
            Sacar nuevo turno
          </Button>
        </Stack>

        <Stack spacing={3}>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          )}
          {!loading && error && (
            <Typography sx={{ color: '#B00020' }}>{error}</Typography>
          )}
          {!loading && pendingAppointments.map((appt) => {
            const canEdit = canModify(appt);
            const dateTime = toDateTime(appt.date, appt.time);
            return (
              <Card
                key={appt.id}
                sx={{
                  borderRadius: '20px',
                  border: '1px solid #F0DEDE',
                  boxShadow: '0 12px 26px rgba(0,0,0,0.08)',
                }}
              >
                <CardContent
                  sx={{
                    display: 'grid',
                    gap: 2,
                    gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr auto' },
                    alignItems: { xs: 'stretch', md: 'center' },
                  }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {appt.service}
                    </Typography>
                    <Typography sx={{ color: '#7A7A7A' }}>{appt.location}</Typography>
                    <Typography sx={{ color: '#7A7A7A', mt: 0.5 }}>
                      {dateTime
                        ? dateTime.toLocaleString('es-AR', {
                            dateStyle: 'full',
                            timeStyle: 'short',
                          })
                        : `${appt.date} ${appt.time}`}
                    </Typography>
                    {!canEdit && (
                      <Typography sx={{ color: '#B00020', fontSize: '0.85rem', mt: 1 }}>
                        Solo se puede modificar con 48 horas de anticipacion.
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip label={appt.status} color={statusColor(appt.status)} />
                  </Box>

                  <Stack spacing={1}>
                    <Button
                      variant="outlined"
                      disabled={!canEdit}
                      onClick={() => handleOpenReschedule(appt)}
                    >
                      Reprogramar
                    </Button>
                    <Button
                      variant="text"
                      disabled={!canEdit}
                      onClick={() => handleCancel(appt.id)}
                      sx={{ color: '#B00020' }}
                    >
                      Cancelar
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      </Container>

      <Dialog open={rescheduleOpen} onClose={() => setRescheduleOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Reprogramar turno</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, mt: 1 }}>
          <TextField
            label="Nueva fecha"
            type="date"
            value={newDate}
            onChange={(event) => setNewDate(event.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Nueva hora"
            type="time"
            value={newTime}
            onChange={(event) => setNewTime(event.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setRescheduleOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleConfirmReschedule}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
