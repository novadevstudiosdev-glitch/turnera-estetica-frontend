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
import { RequireAuth } from '@/components/auth/RequireAuth';

type AppointmentStatus =
  | 'Pendiente'
  | 'Confirmado'
  | 'Reprogramado'
  | 'Cancelado'
  | 'Completado'
  | 'No asistio';

type Appointment = {
  id: string;
  service: string;
  location: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: AppointmentStatus;
  serviceId?: string;
  patientName?: string;
  patientEmail?: string;
  patientPhone?: string;
  patientNotes?: string;
};

type ApiAppointment = Record<string, unknown>;

const initialAppointments: Appointment[] = [];

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
const appointmentsBaseUrl = `${apiBaseUrl.replace(/\/$/, '')}/api/appointments`;
const appointmentsMyUrl = `${appointmentsBaseUrl}/my-appointments`;

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
    case 'Completado':
      return 'success';
    case 'No asistio':
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
  if (['Cancelado', 'Completado', 'No asistio'].includes(appointment.status)) return false;
  const dateTime = toDateTime(appointment.date, appointment.time);
  if (!dateTime) return false;
  const diffHours = (dateTime.getTime() - Date.now()) / 36e5;
  return diffHours >= 48;
};

const normalizeStatus = (value: unknown): AppointmentStatus => {
  const normalized = String(value ?? '').toLowerCase();
  if (['pending', 'pendiente'].includes(normalized)) return 'Pendiente';
  if (['confirmado', 'confirmed'].includes(normalized)) return 'Confirmado';
  if (['reprogramado', 'rescheduled'].includes(normalized)) return 'Reprogramado';
  if (['cancelado', 'canceled', 'cancelled'].includes(normalized)) return 'Cancelado';
  if (['completed', 'completado'].includes(normalized)) return 'Completado';
  if (
    ['no_show', 'no-show', 'no show', 'noasistio', 'no asistio', 'no asistió'].includes(normalized)
  ) {
    return 'No asistio';
  }
  return 'Pendiente';
};

const resolveDateTime = (raw: ApiAppointment) => {
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
      const iso = parsed.toISOString();
      return {
        date: iso.slice(0, 10),
        time: rawTime ? rawTime.slice(0, 5) : iso.slice(11, 16),
      };
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
    (raw.service as { name?: string } | undefined)?.name ??
    (raw.service as string | undefined) ??
    (raw.serviceName as string | undefined) ??
    (raw.title as string | undefined) ??
    'Servicio';
  const serviceId =
    (raw.serviceId as string | undefined) ??
    (raw.service as { id?: string } | undefined)?.id;
  const patientNotes = (raw.patientNotes as string | undefined) ?? (raw.notes as string | undefined);
  const locationMatch = patientNotes?.match(/Sede:\s*([^|]+)/i);
  const locationValue =
    locationMatch?.[1]?.trim() ??
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
    serviceId,
    patientName:
      (raw.patientName as string | undefined) ??
      (raw.user as { fullName?: string } | undefined)?.fullName,
    patientEmail:
      (raw.patientEmail as string | undefined) ??
      (raw.user as { email?: string } | undefined)?.email,
    patientPhone:
      (raw.patientPhone as string | undefined) ??
      (raw.user as { phone?: string } | undefined)?.phone,
    patientNotes,
  };
};

export default function ClientDashboardPage() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
}

function DashboardContent() {
  const router = useRouter();
  const [appointments, setAppointments] = useState(initialAppointments);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
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
        if (!token) {
          if (mounted) {
            setAppointments([]);
            setError('Necesitas iniciar sesion para ver tus turnos.');
          }
          return;
        }
        const response = await fetch(appointmentsMyUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('turnera_access_token');
              localStorage.removeItem('turnera_user');
              localStorage.removeItem('turnera_google_picture');
              window.dispatchEvent(new Event('auth-changed'));
            }
            router.replace('/?auth=login&next=/dashboard');
            return;
          }
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
        const normalized = list.map((item, index) =>
          normalizeAppointment(item as ApiAppointment, index)
        );
        if (mounted) {
          setAppointments(normalized);
          if (normalized.length === 0) {
            setError('No se encontraron turnos para tu cuenta.');
          }
        }
      } catch (err) {
        if (mounted) {
          setError('No se pudieron cargar los turnos desde el servidor.');
          setAppointments([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (appointmentsMyUrl) {
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

  const handleCancel = async (id: string, reason?: string) => {
    try {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('turnera_access_token') : null;
      if (!token) {
        setError('Necesitas iniciar sesion para cancelar un turno.');
        return;
      }
      const payload = reason?.trim() ? { cancellationReason: reason.trim() } : {};
      const response = await fetch(`${appointmentsBaseUrl}/${id}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
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

  const handleOpenCancel = (id: string) => {
    setCancelTargetId(id);
    setCancelReason('');
  };

  const handleCloseCancel = () => {
    setCancelTargetId(null);
    setCancelReason('');
  };

  const handleConfirmCancel = async () => {
    if (!cancelTargetId) return;
    await handleCancel(cancelTargetId, cancelReason);
    setCancelTargetId(null);
    setCancelReason('');
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
      if (!token) {
        setError('Necesitas iniciar sesion para reprogramar un turno.');
        return;
      }
      if (!rescheduleTarget.serviceId) {
        setError('No se pudo identificar el servicio del turno.');
        return;
      }
      if (!rescheduleTarget.patientName || !rescheduleTarget.patientEmail || !rescheduleTarget.patientPhone) {
        setError('Faltan datos del paciente para reprogramar.');
        return;
      }

      const createResponse = await fetch(appointmentsBaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceId: rescheduleTarget.serviceId,
          appointmentDate: newDate,
          appointmentTime: newTime,
          patientName: rescheduleTarget.patientName,
          patientEmail: rescheduleTarget.patientEmail,
          patientPhone: rescheduleTarget.patientPhone,
          patientNotes: rescheduleTarget.patientNotes,
        }),
      });
      if (!createResponse.ok) {
        throw new Error(`HTTP ${createResponse.status}`);
      }
      const createdRaw = (await createResponse.json()) as ApiAppointment;

      const cancelResponse = await fetch(`${appointmentsBaseUrl}/${rescheduleTarget.id}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cancellationReason: 'Reprogramado por el paciente' }),
      });

      if (!cancelResponse.ok) {
        const createdId = String((createdRaw as { id?: string }).id ?? '');
        if (createdId) {
          await fetch(`${appointmentsBaseUrl}/${createdId}/cancel`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ cancellationReason: 'Reprogramacion fallida' }),
          });
        }
        throw new Error('No se pudo cancelar el turno anterior.');
      }

      const normalized = normalizeAppointment(createdRaw, 0);
      setAppointments((prev) =>
        [normalized, ...prev.filter((appt) => appt.id !== rescheduleTarget.id)]
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
                      onClick={() => handleOpenCancel(appt.id)}
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

      <Dialog open={Boolean(cancelTargetId)} onClose={handleCloseCancel} fullWidth maxWidth="xs">
        <DialogTitle>Eliminar turno</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#6B6B6B' }}>
            ¿Está seguro que quiere eliminar el turno?
          </Typography>
          <TextField
            label="Motivo de cancelación (opcional)"
            value={cancelReason}
            onChange={(event) => setCancelReason(event.target.value)}
            fullWidth
            multiline
            minRows={3}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseCancel}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleConfirmCancel}
            sx={{
              backgroundColor: '#EEBBC3',
              color: '#2C2C2C',
              '&:hover': { backgroundColor: '#FFB8C6' },
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

