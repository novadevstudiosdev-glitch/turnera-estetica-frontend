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
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

type AdminStatus = 'Pendiente' | 'Confirmado' | 'Reprogramado' | 'Cancelado';

type AdminAppointment = {
  id: string;
  clientName: string;
  service: string;
  date: string;
  time: string;
  location: string;
  status: AdminStatus;
};

type ApiAppointment = Record<string, unknown>;

const initialAdminAppointments: AdminAppointment[] = [
  {
    id: 'AP-2001',
    clientName: 'Valentina Perez',
    service: 'Mesoterapia Facial',
    date: '2026-02-20',
    time: '10:30',
    location: 'Rosario',
    status: 'Pendiente',
  },
  {
    id: 'AP-2002',
    clientName: 'Lucia Ramirez',
    service: 'Botox',
    date: '2026-02-20',
    time: '12:00',
    location: 'Correa',
    status: 'Confirmado',
  },
  {
    id: 'AP-2003',
    clientName: 'Julian Gomez',
    service: 'Limpieza profunda',
    date: '2026-02-21',
    time: '15:00',
    location: 'Rosario',
    status: 'Pendiente',
  },
];

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
const appointmentsUrl = `${apiBaseUrl.replace(/\/$/, '')}/api/appointments`;

const statusColor = (status: AdminStatus) => {
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

const normalizeStatus = (value: unknown): AdminStatus => {
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

const normalizeAppointment = (raw: ApiAppointment, index: number): AdminAppointment => {
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
  const clientValue =
    (raw.clientName as string | undefined) ??
    (raw.customerName as string | undefined) ??
    (raw.user as { fullName?: string; name?: string } | undefined)?.fullName ??
    (raw.user as { fullName?: string; name?: string } | undefined)?.name ??
    'Cliente';
  const { date, time } = resolveDateTime(raw);
  return {
    id,
    clientName: clientValue,
    service: serviceValue,
    location: locationValue,
    date: date || new Date().toISOString().slice(0, 10),
    time: time || '09:00',
    status: normalizeStatus(raw.status),
  };
};

export default function AdminDashboardPage() {
  const [appointments, setAppointments] = useState(initialAdminAppointments);
  const [editing, setEditing] = useState<AdminAppointment | null>(null);
  const [editValues, setEditValues] = useState({
    date: '',
    time: '',
    status: 'Pendiente' as AdminStatus,
    service: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const stats = useMemo(() => {
    return {
      total: appointments.length,
      pending: appointments.filter((appt) => appt.status === 'Pendiente').length,
      confirmed: appointments.filter((appt) => appt.status === 'Confirmado').length,
      canceled: appointments.filter((appt) => appt.status === 'Cancelado').length,
    };
  }, [appointments]);

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
            setAppointments(initialAdminAppointments);
          }
        }
      } catch {
        if (mounted) {
          setError('No se pudieron cargar los turnos desde el servidor.');
          setAppointments(initialAdminAppointments);
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

  const handleOpenEdit = (appointment: AdminAppointment) => {
    setEditing(appointment);
    setEditValues({
      date: appointment.date,
      time: appointment.time,
      status: appointment.status,
      service: appointment.service,
    });
  };

  const handleSaveEdit = async () => {
    if (!editing) return;
    try {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('turnera_access_token') : null;
      const response = await fetch(`${appointmentsUrl}/${editing.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          date: editValues.date,
          time: editValues.time,
          status: editValues.status,
          service: editValues.service,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === editing.id
            ? {
                ...appt,
                date: editValues.date,
                time: editValues.time,
                status: editValues.status,
                service: editValues.service,
              }
            : appt
        )
      );
      setEditing(null);
    } catch {
      setError('No se pudo actualizar el turno. Intenta nuevamente.');
    }
  };

  const handleCancelAppointment = async (id: string) => {
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

  return (
    <Box sx={{ backgroundColor: '#FDF7F7', minHeight: '100vh', py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        <Stack spacing={2} sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#2C2C2C' }}>
            Dashboard admin
          </Typography>
          <Typography sx={{ color: '#6B6B6B' }}>
            Gestiona todos los turnos, actualiza fechas y estados.
          </Typography>
        </Stack>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ mb: 4 }}
        >
          {[
            { label: 'Total', value: stats.total },
            { label: 'Pendientes', value: stats.pending },
            { label: 'Confirmados', value: stats.confirmed },
            { label: 'Cancelados', value: stats.canceled },
          ].map((card) => (
            <Card key={card.label} sx={{ flex: 1, borderRadius: '18px' }}>
              <CardContent>
                <Typography sx={{ color: '#7A7A7A', mb: 1 }}>{card.label}</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>

        <Stack spacing={2}>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          )}
          {!loading && error && (
            <Typography sx={{ color: '#B00020' }}>{error}</Typography>
          )}
          {!loading && appointments.map((appt) => (
            <Card key={appt.id} sx={{ borderRadius: '18px', border: '1px solid #F0DEDE' }}>
              <CardContent
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: { xs: '1fr', md: '1.5fr 1fr auto' },
                  alignItems: { xs: 'stretch', md: 'center' },
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {appt.clientName}
                  </Typography>
                  <Typography sx={{ color: '#7A7A7A' }}>{appt.service}</Typography>
                  <Typography sx={{ color: '#7A7A7A' }}>
                    {appt.date} - {appt.time} | {appt.location}
                  </Typography>
                </Box>

                <Box>
                  <Chip label={appt.status} color={statusColor(appt.status)} />
                </Box>

                <Stack spacing={1}>
                  <Button variant="outlined" onClick={() => handleOpenEdit(appt)}>
                    Editar
                  </Button>
                  <Button
                    variant="text"
                    sx={{ color: '#B00020' }}
                    onClick={() => handleCancelAppointment(appt.id)}
                  >
                    Cancelar
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Container>

      <Dialog open={Boolean(editing)} onClose={() => setEditing(null)} fullWidth maxWidth="sm">
        <DialogTitle>Editar turno</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, mt: 1 }}>
          <TextField
            label="Servicio"
            value={editValues.service}
            onChange={(event) => setEditValues((prev) => ({ ...prev, service: event.target.value }))}
            fullWidth
          />
          <TextField
            label="Fecha"
            type="date"
            value={editValues.date}
            onChange={(event) => setEditValues((prev) => ({ ...prev, date: event.target.value }))}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Hora"
            type="time"
            value={editValues.time}
            onChange={(event) => setEditValues((prev) => ({ ...prev, time: event.target.value }))}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            select
            label="Estado"
            value={editValues.status}
            onChange={(event) =>
              setEditValues((prev) => ({
                ...prev,
                status: event.target.value as AdminStatus,
              }))
            }
          >
            {['Pendiente', 'Confirmado', 'Reprogramado', 'Cancelado'].map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setEditing(null)}>Cerrar</Button>
          <Button variant="contained" onClick={handleSaveEdit}>
            Guardar cambios
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
