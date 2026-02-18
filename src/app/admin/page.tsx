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
import { useRouter } from 'next/navigation';

type AdminStatus = 'Pendiente' | 'Confirmado' | 'Reprogramado' | 'Cancelado';

type AdminAppointment = {
  id: string;
  clientName: string;
  service: string;
  date: string;
  time: string;
  durationMinutes?: number;
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
    durationMinutes: 60,
    location: 'Rosario',
    status: 'Pendiente',
  },
  {
    id: 'AP-2002',
    clientName: 'Lucia Ramirez',
    service: 'Botox',
    date: '2026-02-20',
    time: '12:00',
    durationMinutes: 30,
    location: 'Correa',
    status: 'Confirmado',
  },
  {
    id: 'AP-2003',
    clientName: 'Julian Gomez',
    service: 'Limpieza profunda',
    date: '2026-02-21',
    time: '15:00',
    durationMinutes: 60,
    location: 'Rosario',
    status: 'Pendiente',
  },
  {
    id: 'AP-2004',
    clientName: 'Carla Miranda',
    service: 'Toxina Botulinica',
    date: '2026-02-22',
    time: '09:00',
    durationMinutes: 30,
    location: 'Rosario',
    status: 'Confirmado',
  },
  {
    id: 'AP-2005',
    clientName: 'Agostina Rios',
    service: 'Peeling Quimico',
    date: '2026-02-22',
    time: '16:30',
    durationMinutes: 60,
    location: 'Correa',
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
    durationMinutes:
      (raw.durationMinutes as number | undefined) ??
      (raw.duration as number | undefined) ??
      (raw.durationMin as number | undefined),
  };
};

export default function AdminDashboardPage() {
  const router = useRouter();
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
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const stats = useMemo(() => {
    return {
      total: appointments.length,
      pending: appointments.filter((appt) => appt.status === 'Pendiente').length,
      confirmed: appointments.filter((appt) => appt.status === 'Confirmado').length,
      canceled: appointments.filter((appt) => appt.status === 'Cancelado').length,
    };
  }, [appointments]);

  const monthStart = useMemo(() => {
    const base = new Date();
    const start = new Date(base.getFullYear(), base.getMonth() + monthOffset, 1);
    start.setHours(0, 0, 0, 0);
    return start;
  }, [monthOffset]);

  const monthLabel = useMemo(
    () => monthStart.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }),
    [monthStart]
  );

  const monthGridStart = useMemo(() => {
    const start = new Date(monthStart);
    const day = start.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    start.setDate(start.getDate() + diff);
    start.setHours(0, 0, 0, 0);
    return start;
  }, [monthStart]);

  const monthDays = useMemo(() => {
    return Array.from({ length: 42 }).map((_, index) => {
      const day = new Date(monthGridStart);
      day.setDate(monthGridStart.getDate() + index);
      return day;
    });
  }, [monthGridStart]);

  useEffect(() => {
    const inSameMonth =
      selectedDate.getFullYear() === monthStart.getFullYear() &&
      selectedDate.getMonth() === monthStart.getMonth();
    if (!inSameMonth) {
      setSelectedDate(monthStart);
    }
  }, [monthStart, selectedDate]);

  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    const startMinutes = 9 * 60;
    const endMinutes = 19 * 60;
    const step = 30;
    for (let minutes = startMinutes; minutes < endMinutes; minutes += step) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      slots.push(`${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`);
    }
    return slots;
  }, []);

  const parseTimeToMinutes = (time: string) => {
    const [hours, mins] = time.split(':').map((value) => Number(value));
    if (Number.isNaN(hours) || Number.isNaN(mins)) return 0;
    return hours * 60 + mins;
  };

  const formatDayLabel = (date: Date) =>
    date.toLocaleDateString('es-AR', { weekday: 'short' });

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const isSameMonth = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

  const getAppointmentForSlot = (date: Date, time: string) => {
    const dateKey = date.toISOString().slice(0, 10);
    const slotMinutes = parseTimeToMinutes(time);
    return appointments.find((appt) => {
      if (appt.date !== dateKey) return false;
      const startMinutes = parseTimeToMinutes(appt.time);
      const duration = appt.durationMinutes ?? 30;
      return slotMinutes >= startMinutes && slotMinutes < startMinutes + duration;
    });
  };

  const getAppointmentsForDay = (date: Date) => {
    const dateKey = date.toISOString().slice(0, 10);
    return appointments.filter((appt) => appt.date === dateKey);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('turnera_user');
    if (!stored) {
      setIsAdmin(false);
      router.replace('/dashboard');
      return;
    }
    try {
      const parsed = JSON.parse(stored) as { role?: string };
      const role = parsed?.role?.toLowerCase();
      if (role !== 'admin') {
        setIsAdmin(false);
        router.replace('/dashboard');
        return;
      }
      setIsAdmin(true);
    } catch {
      setIsAdmin(false);
      router.replace('/dashboard');
    }
  }, [router]);

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
        {isAdmin === false && (
          <Box
            sx={{
              borderRadius: '16px',
              border: '1px solid #F0DEDE',
              backgroundColor: '#FFFFFF',
              p: 3,
              mb: 3,
            }}
          >
            <Typography sx={{ fontWeight: 700, color: '#B02E2E' }}>
              Solo administradores pueden ver este panel.
            </Typography>
          </Box>
        )}
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
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            sx={{ alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between' }}
          >
            <Box>
              <Typography sx={{ fontWeight: 700, color: '#2C2C2C', mb: 0.5 }}>
                Agenda mensual
              </Typography>
              <Typography sx={{ color: '#6B6B6B' }}>{monthLabel}</Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" onClick={() => setMonthOffset((prev) => prev - 1)}>
                Mes anterior
              </Button>
              <Button variant="outlined" onClick={() => setMonthOffset(0)}>
                Mes actual
              </Button>
              <Button variant="outlined" onClick={() => setMonthOffset((prev) => prev + 1)}>
                Mes siguiente
              </Button>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
            <Chip label="Libre" sx={{ backgroundColor: '#FFFFFF', border: '1px solid #E6E0DD' }} />
            <Chip label="Ocupado" color="primary" />
            <Chip label="Pendiente" color="warning" />
            <Chip label="Confirmado" color="success" />
          </Stack>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          )}
          {!loading && error && (
            <Typography sx={{ color: '#B00020' }}>{error}</Typography>
          )}
          {!loading && (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.4fr 1fr' }, gap: 3 }}>
              <Box
                sx={{
                  borderRadius: '20px',
                  border: '1px solid #F0DEDE',
                  backgroundColor: '#FFFFFF',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
                    borderBottom: '1px solid #F0DEDE',
                    backgroundColor: '#FFF5F7',
                  }}
                >
                  {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'].map((label) => (
                    <Box key={label} sx={{ p: 1.5, textAlign: 'center' }}>
                      <Typography sx={{ fontWeight: 700, color: '#8B6B6B' }}>{label}</Typography>
                    </Box>
                  ))}
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
                  {monthDays.map((day) => {
                    const appointmentsForDay = getAppointmentsForDay(day);
                    const occupiedSlots = timeSlots.filter((slot) => getAppointmentForSlot(day, slot)).length;
                    const isInMonth = isSameMonth(day, monthStart);
                    const isSelected = isSameDay(day, selectedDate);
                    return (
                      <Box
                        key={day.toISOString()}
                        onClick={() => setSelectedDate(day)}
                        sx={{
                          minHeight: 120,
                          p: 1.5,
                          borderBottom: '1px solid #F5E6E8',
                          borderLeft: '1px solid #F5E6E8',
                          backgroundColor: isSelected ? '#F9E7EC' : '#FFFFFF',
                          opacity: isInMonth ? 1 : 0.4,
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease',
                          '&:hover': {
                            backgroundColor: isSelected ? '#F9E7EC' : '#FFF5F7',
                          },
                        }}
                      >
                        <Typography sx={{ fontWeight: 700, color: '#2C2C2C', mb: 0.5 }}>
                          {day.getDate()}
                        </Typography>
                        {appointmentsForDay.length > 0 ? (
                          <Stack spacing={0.5}>
                            <Typography sx={{ fontSize: '0.78rem', color: '#6B6B6B' }}>
                              {appointmentsForDay.length} turnos
                            </Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: '#8B6B6B' }}>
                              Ocupados: {occupiedSlots}
                            </Typography>
                          </Stack>
                        ) : (
                          <Typography sx={{ fontSize: '0.75rem', color: '#B8A4A4' }}>
                            Libre
                          </Typography>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              </Box>

              <Box
                sx={{
                  borderRadius: '20px',
                  border: '1px solid #F0DEDE',
                  backgroundColor: '#FFFFFF',
                  p: 2,
                }}
              >
                <Typography sx={{ fontWeight: 700, color: '#2C2C2C', mb: 1 }}>
                  {selectedDate.toLocaleDateString('es-AR', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                  })}
                </Typography>
                <Typography sx={{ color: '#6B6B6B', mb: 2 }}>
                  Horarios disponibles y ocupados
                </Typography>

                <Stack spacing={1.2}>
                  {timeSlots.map((time) => {
                    const appointment = getAppointmentForSlot(selectedDate, time);
                    return (
                      <Box
                        key={time}
                        onClick={() => appointment && handleOpenEdit(appointment)}
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: '90px 1fr',
                          gap: 2,
                          alignItems: 'center',
                          p: 1.2,
                          borderRadius: '12px',
                          backgroundColor: appointment ? '#F6E9ED' : '#FFFDFD',
                          border: '1px solid #F5E6E8',
                          cursor: appointment ? 'pointer' : 'default',
                        }}
                      >
                        <Typography sx={{ fontWeight: 600, color: '#8B6B6B' }}>{time}</Typography>
                        {appointment ? (
                          <Stack spacing={0.5}>
                            <Typography sx={{ fontWeight: 700 }}>{appointment.clientName}</Typography>
                            <Typography sx={{ fontSize: '0.85rem', color: '#6B6B6B' }}>
                              {appointment.service} | {appointment.location}
                            </Typography>
                            <Chip
                              label={appointment.status}
                              size="small"
                              color={statusColor(appointment.status)}
                              sx={{ alignSelf: 'flex-start' }}
                            />
                          </Stack>
                        ) : (
                          <Typography sx={{ fontSize: '0.82rem', color: '#B8A4A4' }}>
                            Libre
                          </Typography>
                        )}
                      </Box>
                    );
                  })}
                </Stack>
              </Box>
            </Box>
          )}
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
        <DialogActions sx={{ p: 3, gap: 1 }}>
          {editing && (
            <Button
              variant="text"
              sx={{ color: '#B00020' }}
              onClick={() => handleCancelAppointment(editing.id)}
            >
              Cancelar turno
            </Button>
          )}
          <Box sx={{ flex: 1 }} />
          <Button onClick={() => setEditing(null)}>Cerrar</Button>
          <Button variant="contained" onClick={handleSaveEdit}>
            Guardar cambios
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
