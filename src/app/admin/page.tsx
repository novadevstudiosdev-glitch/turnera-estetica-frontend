'use client';

import { Box, Button, Card, CardContent, Chip, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RequireAuth } from '@/components/auth/RequireAuth';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

type AdminStatus = 'Pendiente' | 'Confirmado' | 'Reprogramado' | 'Cancelado' | 'Completado' | 'No asistio';

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

const initialAdminAppointments: AdminAppointment[] = [];

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
    case 'Completado':
      return 'success';
    case 'No asistio':
      return 'default';
    default:
      return 'default';
  }
};

const normalizeStatus = (value: unknown): AdminStatus => {
  const normalized = String(value ?? '').toLowerCase();
  if (['pending', 'pendiente'].includes(normalized)) return 'Pendiente';
  if (['confirmado', 'confirmed'].includes(normalized)) return 'Confirmado';
  if (['reprogramado', 'rescheduled'].includes(normalized)) return 'Reprogramado';
  if (['cancelado', 'canceled', 'cancelled'].includes(normalized)) return 'Cancelado';
  if (['completed', 'completado'].includes(normalized)) return 'Completado';
  if (['no_show', 'no-show', 'no show', 'noasistio', 'no asistio', 'no asistió'].includes(normalized)) {
    return 'No asistio';
  }
  return 'Pendiente';
};

const toApiStatus = (status: AdminStatus) => {
  switch (status) {
    case 'Confirmado':
      return 'confirmed';
    case 'Cancelado':
      return 'cancelled';
    case 'Completado':
      return 'completed';
    case 'No asistio':
      return 'no_show';
    case 'Reprogramado':
      return 'pending';
    case 'Pendiente':
    default:
      return 'pending';
  }
};

const resolveDateTime = (raw: ApiAppointment) => {
  const rawDate = (raw.appointmentDate as string | undefined) ?? (raw.date as string | undefined) ?? (raw.start as string | undefined) ?? (raw.datetime as string | undefined) ?? (raw.dateTime as string | undefined);

  const rawTime = (raw.appointmentTime as string | undefined) ?? (raw.time as string | undefined) ?? (raw.startTime as string | undefined);

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

const normalizeAppointment = (raw: ApiAppointment, index: number): AdminAppointment => {
  const id = String((raw.id as string | number | undefined) ?? (raw._id as string | number | undefined) ?? (raw.appointmentId as string | number | undefined) ?? `AP-${index + 1}`);
  const serviceValue = (raw.service as { name?: string } | undefined)?.name ?? (raw.service as string | undefined) ?? (raw.serviceName as string | undefined) ?? (raw.title as string | undefined) ?? 'Servicio';
  const notesValue = (raw.patientNotes as string | undefined) ?? (raw.notes as string | undefined) ?? '';
  const locationMatch = notesValue.match(/Sede:\s*([^|]+)/i);
  const locationValue = locationMatch?.[1]?.trim() ?? (raw.location as string | undefined) ?? (raw.branch as string | undefined) ?? (raw.city as string | undefined) ?? (raw.location as { name?: string } | undefined)?.name ?? 'Sucursal';
  const clientValue = (raw.patientName as string | undefined) ?? (raw.clientName as string | undefined) ?? (raw.customerName as string | undefined) ?? (raw.user as { fullName?: string; name?: string } | undefined)?.fullName ?? (raw.user as { fullName?: string; name?: string } | undefined)?.name ?? 'Cliente';
  const { date, time } = resolveDateTime(raw);
  return {
    id,
    clientName: clientValue,
    service: serviceValue,
    location: locationValue,
    date: date || new Date().toISOString().slice(0, 10),
    time: time || '09:00',
    status: normalizeStatus(raw.status),
    durationMinutes: (raw.durationMinutes as number | undefined) ?? (raw.duration as number | undefined) ?? (raw.durationMin as number | undefined) ?? (raw.service as { durationMinutes?: number } | undefined)?.durationMinutes,
  };
};

export default function AdminDashboardPage() {
  return (
    <RequireAuth requiredRole="admin">
      <AdminDashboardContent />
    </RequireAuth>
  );
}

function AdminDashboardContent() {
  const router = useRouter();
  const [appointments, setAppointments] = useState(initialAdminAppointments);
  const [editing, setEditing] = useState<AdminAppointment | null>(null);
  const [editValues, setEditValues] = useState({
    date: '',
    time: '',
    status: 'Pendiente' as AdminStatus,
    service: '',
  });
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | AdminStatus>('Todos');
  const [locationFilter, setLocationFilter] = useState('Todas');
  const [sortBy, setSortBy] = useState<'date-asc' | 'date-desc' | 'name-asc'>('date-asc');

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

  const monthLabel = useMemo(() => monthStart.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }), [monthStart]);

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
    const inSameMonth = selectedDate.getFullYear() === monthStart.getFullYear() && selectedDate.getMonth() === monthStart.getMonth();
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

  const toDateTime = (appointment: AdminAppointment) => {
    const parsed = new Date(`${appointment.date}T${appointment.time}:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const parseTimeToMinutes = (time: string) => {
    const [hours, mins] = time.split(':').map((value) => Number(value));
    if (Number.isNaN(hours) || Number.isNaN(mins)) return 0;
    return hours * 60 + mins;
  };

  const formatDayLabel = (date: Date) => date.toLocaleDateString('es-AR', { weekday: 'short' });

  const isSameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const isSameMonth = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

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

  const todayKey = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const locationOptions = useMemo(() => {
    const unique = new Set(appointments.map((appt) => appt.location).filter(Boolean));
    return ['Todas', ...Array.from(unique)];
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    let list = appointments;

    if (normalizedSearch) {
      list = list.filter((appt) => [appt.clientName, appt.service, appt.location].join(' ').toLowerCase().includes(normalizedSearch));
    }

    if (statusFilter !== 'Todos') {
      list = list.filter((appt) => appt.status === statusFilter);
    }

    if (locationFilter !== 'Todas') {
      list = list.filter((appt) => appt.location === locationFilter);
    }

    const sorted = [...list];
    sorted.sort((a, b) => {
      if (sortBy === 'name-asc') {
        return a.clientName.localeCompare(b.clientName, 'es-AR');
      }
      const dateA = toDateTime(a)?.getTime() ?? 0;
      const dateB = toDateTime(b)?.getTime() ?? 0;
      return sortBy === 'date-desc' ? dateB - dateA : dateA - dateB;
    });

    return sorted;
  }, [appointments, locationFilter, searchTerm, sortBy, statusFilter]);

  const todayAppointments = useMemo(() => appointments.filter((appt) => appt.date === todayKey), [appointments, todayKey]);

  const upcomingAppointments = useMemo(() => {
    const now = new Date();
    return appointments
      .map((appt) => ({ appt, dateTime: toDateTime(appt) }))
      .filter((item): item is { appt: AdminAppointment; dateTime: Date } => item.dateTime !== null && item.dateTime >= now && item.appt.status !== 'Cancelado')
      .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime())
      .slice(0, 4)
      .map((item) => item.appt);
  }, [appointments]);

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
        const token = typeof window !== 'undefined' ? localStorage.getItem('turnera_access_token') : null;
        if (!token) {
          if (mounted) {
            setAppointments([]);
            setError('Necesitas iniciar sesion como admin para ver los turnos.');
          }
          return;
        }
        const response = await fetch(appointmentsUrl, {
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
            router.replace('/?auth=login&next=/admin');
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
        const list = Array.isArray(parsed) ? parsed : Array.isArray((parsed as { data?: unknown }).data) ? ((parsed as { data?: unknown }).data as unknown[]) : [];
        const normalized = list.map((item, index) => normalizeAppointment(item as ApiAppointment, index));
        if (mounted) {
          setAppointments(normalized);
          if (normalized.length === 0) {
            setError('No se encontraron turnos en el servidor.');
          }
        }
      } catch {
        if (mounted) {
          setError('No se pudieron cargar los turnos desde el servidor.');
          setAppointments([]);
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
      const token = typeof window !== 'undefined' ? localStorage.getItem('turnera_access_token') : null;
      if (!token) {
        setError('Necesitas iniciar sesion como admin para actualizar un turno.');
        return;
      }
      const response = await fetch(`${appointmentsUrl}/${editing.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          appointmentDate: editValues.date,
          appointmentTime: editValues.time,
          status: toApiStatus(editValues.status),
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const updatedRaw = (await response.json()) as ApiAppointment;
      const normalized = normalizeAppointment(updatedRaw, 0);
      setAppointments((prev) => prev.map((appt) => (appt.id === editing.id ? normalized : appt)));
      setEditing(null);
    } catch {
      setError('No se pudo actualizar el turno. Intenta nuevamente.');
    }
  };

  const handleCancelAppointment = async (id: string, reason?: string) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('turnera_access_token') : null;
      if (!token) {
        setError('Necesitas iniciar sesion como admin para cancelar un turno.');
        return;
      }
      const payload = reason?.trim()
        ? { cancellationReason: reason.trim() }
        : { cancellationReason: 'Cancelado por administracion' };
      const response = await fetch(`${appointmentsUrl}/${id}/cancel`, {
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
      setAppointments((prev) => prev.map((appt) => (appt.id === id ? { ...appt, status: 'Cancelado' } : appt)));
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
    await handleCancelAppointment(cancelTargetId, cancelReason);
    setCancelTargetId(null);
    setCancelReason('');
  };

  return (
    <Box sx={{ backgroundColor: '#FDF7F7', minHeight: '100vh', py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 } }}>
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
            <Typography sx={{ fontWeight: 700, color: '#B02E2E' }}>Solo administradores pueden ver este panel.</Typography>
          </Box>
        )}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#2C2C2C', mb: 0.5 }}>
              Panel de Administracion
            </Typography>
            <Typography sx={{ color: '#6B6B6B' }}>Gestiona turnos, estados y disponibilidad con una vista clara.</Typography>
          </Box>
          <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              onClick={() => {
                const today = new Date();
                setMonthOffset(0);
                setSelectedDate(today);
              }}
              sx={{
                borderRadius: '999px',
                px: 3,
                py: 1,
                backgroundColor: '#EEBBC3',
                color: '#2C2C2C',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#FFB8C6',
                },
              }}
            >
              Ver hoy
            </Button>
            <Button
              variant="outlined"
              onClick={() => setMonthOffset(0)}
              sx={{
                borderRadius: '999px',
                px: 3,
                py: 1,
                borderColor: '#E9E4E2',
                color: '#6B6B6B',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#EEBBC3',
                  backgroundColor: '#FDF4F6',
                },
              }}
            >
              Mes actual
            </Button>
          </Stack>
        </Box>

        {!loading && error && (
          <Box
            sx={{
              borderRadius: '16px',
              border: '1px solid #F0DEDE',
              backgroundColor: '#FFFFFF',
              p: 2.5,
              mb: 3,
            }}
          >
            <Typography sx={{ color: '#B00020' }}>{error}</Typography>
          </Box>
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              lg: 'repeat(4, minmax(0, 1fr))',
            },
            gap: { xs: 2, md: 3 },
            mb: 4,
          }}
        >
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <Card
                  key={`kpi-skeleton-${index}`}
                  sx={{
                    borderRadius: '18px',
                    border: '1px solid #F0DEDE',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                    <Skeleton width="45%" height={20} />
                    <Skeleton width="70%" height={36} sx={{ mt: 1 }} />
                    <Skeleton width="55%" height={16} sx={{ mt: 1 }} />
                  </CardContent>
                </Card>
              ))
            : [
                {
                  label: 'Turnos totales',
                  value: stats.total,
                  helper: `${todayAppointments.length} para hoy`,
                },
                { label: 'Pendientes', value: stats.pending, helper: 'Requieren confirmacion' },
                { label: 'Confirmados', value: stats.confirmed, helper: 'Listos para agenda' },
                { label: 'Cancelados', value: stats.canceled, helper: 'En el periodo' },
              ].map((card) => (
                <Card
                  key={card.label}
                  sx={{
                    borderRadius: '18px',
                    border: '1px solid #F0DEDE',
                    backgroundColor: '#FFFFFF',
                    transition: 'box-shadow 0.2s ease',
                    '&:hover': {
                      boxShadow: '0 10px 24px rgba(26, 26, 26, 0.06)',
                    },
                  }}
                >
                  <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                    <Typography sx={{ color: '#7A7A7A', fontSize: '0.86rem', mb: 1 }}>{card.label}</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#2C2C2C' }}>
                      {card.value}
                    </Typography>
                    <Typography sx={{ color: '#9C6B6B', fontSize: '0.8rem', mt: 1 }}>{card.helper}</Typography>
                  </CardContent>
                </Card>
              ))}
        </Box>

        <Stack spacing={4}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' },
              gap: { xs: 2, md: 3 },
            }}
          >
            <Card
              sx={{
                borderRadius: '20px',
                border: '1px solid #F0DEDE',
                backgroundColor: '#FFFFFF',
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack spacing={2.5}>
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: '#2C2C2C', mb: 0.5 }}>Acciones rapidas</Typography>
                    <Typography sx={{ color: '#6B6B6B', fontSize: '0.9rem' }}>Atajos frecuentes para gestionar el dia.</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                      gap: 1.5,
                    }}
                  >
                    {[
                      {
                        label: 'Ver hoy',
                        action: () => {
                          const today = new Date();
                          setMonthOffset(0);
                          setSelectedDate(today);
                        },
                      },
                      { label: 'Mes actual', action: () => setMonthOffset(0) },
                      { label: 'Pendientes', action: () => setStatusFilter('Pendiente') },
                      { label: 'Confirmados', action: () => setStatusFilter('Confirmado') },
                    ].map((item) => (
                      <Button
                        key={item.label}
                        variant="outlined"
                        onClick={item.action}
                        sx={{
                          borderRadius: '12px',
                          py: 1.2,
                          borderColor: '#E9E4E2',
                          color: '#6B6B6B',
                          textTransform: 'none',
                          fontWeight: 600,
                          backgroundColor: '#FFFFFF',
                          '&:hover': {
                            borderColor: '#EEBBC3',
                            backgroundColor: '#FDF4F6',
                          },
                        }}
                      >
                        {item.label}
                      </Button>
                    ))}
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Card
              sx={{
                borderRadius: '20px',
                border: '1px solid #F0DEDE',
                backgroundColor: '#FFFFFF',
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack spacing={2.5}>
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: '#2C2C2C', mb: 0.5 }}>Resumen del dia</Typography>
                    <Typography sx={{ color: '#6B6B6B', fontSize: '0.9rem' }}>Vista rapida de actividad y proximos turnos.</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                      gap: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        borderRadius: '14px',
                        border: '1px solid #F5E6E8',
                        backgroundColor: '#FFFDFD',
                        p: 1.5,
                      }}
                    >
                      <Typography sx={{ fontSize: '0.82rem', color: '#8B6B6B' }}>Turnos hoy</Typography>
                      <Typography sx={{ fontWeight: 700, color: '#2C2C2C', fontSize: '1.4rem' }}>{todayAppointments.length}</Typography>
                    </Box>
                    <Box
                      sx={{
                        borderRadius: '14px',
                        border: '1px solid #F5E6E8',
                        backgroundColor: '#FFFDFD',
                        p: 1.5,
                      }}
                    >
                      <Typography sx={{ fontSize: '0.82rem', color: '#8B6B6B' }}>Pendientes</Typography>
                      <Typography sx={{ fontWeight: 700, color: '#2C2C2C', fontSize: '1.4rem' }}>{stats.pending}</Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 600, color: '#2C2C2C', mb: 1 }}>Proximos turnos</Typography>
                    {loading ? (
                      <Stack spacing={1}>
                        {Array.from({ length: 3 }).map((_, index) => (
                          <Skeleton key={`upcoming-${index}`} height={30} />
                        ))}
                      </Stack>
                    ) : upcomingAppointments.length > 0 ? (
                      <Stack spacing={1}>
                        {upcomingAppointments.map((appt) => (
                          <Box
                            key={`upcoming-${appt.id}`}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: 1.5,
                              borderRadius: '12px',
                              border: '1px solid #F5E6E8',
                              p: 1.2,
                            }}
                          >
                            <Box>
                              <Typography sx={{ fontWeight: 600, color: '#2C2C2C' }}>{appt.clientName}</Typography>
                              <Typography sx={{ fontSize: '0.82rem', color: '#6B6B6B' }}>
                                {appt.service} - {appt.time}
                              </Typography>
                            </Box>
                            <Chip label={appt.status} size="small" color={statusColor(appt.status)} />
                          </Box>
                        ))}
                      </Stack>
                    ) : (
                      <Box
                        sx={{
                          borderRadius: '12px',
                          border: '1px dashed #E6E0DD',
                          p: 2,
                          textAlign: 'center',
                        }}
                      >
                        <Typography sx={{ color: '#8B6B6B', fontSize: '0.9rem' }}>No hay turnos proximos cargados.</Typography>
                      </Box>
                    )}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>

          <Card
            sx={{
              borderRadius: '20px',
              border: '1px solid #F0DEDE',
              backgroundColor: '#FFFFFF',
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Stack spacing={2.5}>
                <Box>
                  <Typography sx={{ fontWeight: 700, color: '#2C2C2C', mb: 0.5 }}>Listado de turnos</Typography>
                  <Typography sx={{ color: '#6B6B6B', fontSize: '0.9rem' }}>Filtra y gestiona los turnos desde una vista ordenada.</Typography>
                </Box>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ alignItems: { xs: 'stretch', md: 'center' } }}>
                  <TextField label="Buscar" placeholder="Cliente, servicio o sede" size="small" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} sx={{ flex: 1, backgroundColor: '#FFFFFF' }} />
                  <TextField select label="Estado" size="small" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as AdminStatus | 'Todos')} sx={{ minWidth: 160, backgroundColor: '#FFFFFF' }}>
                    <MenuItem value="Todos">Todos</MenuItem>
                    {['Pendiente', 'Confirmado', 'Reprogramado', 'Cancelado', 'Completado', 'No asistio'].map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField select label="Sede" size="small" value={locationFilter} onChange={(event) => setLocationFilter(event.target.value)} sx={{ minWidth: 160, backgroundColor: '#FFFFFF' }}>
                    {locationOptions.map((location) => (
                      <MenuItem key={location} value={location}>
                        {location}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField select label="Ordenar por" size="small" value={sortBy} onChange={(event) => setSortBy(event.target.value as 'date-asc' | 'date-desc' | 'name-asc')} sx={{ minWidth: 180, backgroundColor: '#FFFFFF' }}>
                    <MenuItem value="date-asc">Fecha (proximos)</MenuItem>
                    <MenuItem value="date-desc">Fecha (recientes)</MenuItem>
                    <MenuItem value="name-asc">Cliente (A-Z)</MenuItem>
                  </TextField>
                </Stack>

                {loading ? (
                  <Box sx={{ display: 'grid', gap: 1.5 }}>
                    {Array.from({ length: 6 }).map((_, index) => (
                      <Skeleton key={`table-skeleton-${index}`} height={42} />
                    ))}
                  </Box>
                ) : filteredAppointments.length === 0 ? (
                  <Box
                    sx={{
                      borderRadius: '16px',
                      border: '1px dashed #E6E0DD',
                      p: { xs: 2, md: 3 },
                      textAlign: 'center',
                    }}
                  >
                    <Typography sx={{ color: '#6B6B6B', mb: 2 }}>No hay turnos para los filtros seleccionados.</Typography>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('Todos');
                        setLocationFilter('Todas');
                        setSortBy('date-asc');
                      }}
                      sx={{
                        borderRadius: '999px',
                        px: 3,
                        py: 1,
                        borderColor: '#E9E4E2',
                        color: '#6B6B6B',
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          borderColor: '#EEBBC3',
                          backgroundColor: '#FDF4F6',
                        },
                      }}
                    >
                      Limpiar filtros
                    </Button>
                  </Box>
                ) : (
                  <TableContainer
                    sx={{
                      borderRadius: '16px',
                      border: '1px solid #F0DEDE',
                      overflow: 'hidden',
                    }}
                  >
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ backgroundColor: '#FFF5F7' }}>
                          {['Cliente', 'Servicio', 'Fecha', 'Hora', 'Sede', 'Estado', 'Acciones'].map((label) => (
                            <TableCell key={label} sx={{ fontWeight: 700, color: '#8B6B6B', fontSize: '0.82rem' }}>
                              {label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredAppointments.map((appt) => {
                          const dateLabel = new Date(`${appt.date}T00:00:00`).toLocaleDateString('es-AR', {
                            day: '2-digit',
                            month: 'short',
                          });
                          return (
                            <TableRow
                              key={`row-${appt.id}`}
                              hover
                              sx={{
                                '&:last-of-type td': { borderBottom: 'none' },
                              }}
                            >
                              <TableCell sx={{ fontWeight: 600, color: '#2C2C2C' }}>{appt.clientName}</TableCell>
                              <TableCell sx={{ color: '#6B6B6B' }}>{appt.service}</TableCell>
                              <TableCell sx={{ color: '#6B6B6B' }}>{dateLabel}</TableCell>
                              <TableCell sx={{ color: '#6B6B6B' }}>{appt.time}</TableCell>
                              <TableCell sx={{ color: '#6B6B6B' }}>{appt.location}</TableCell>
                              <TableCell>
                                <Chip label={appt.status} size="small" color={statusColor(appt.status)} />
                              </TableCell>
                              <TableCell>
                                <Stack direction="row" spacing={1}>
                                  <IconButton size="small" onClick={() => handleOpenEdit(appt)} sx={{ color: '#8B6B6B' }} aria-label="Editar turno">
                                    <EditOutlinedIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton size="small" onClick={() => handleOpenCancel(appt.id)} sx={{ color: '#B00020' }} aria-label="Cancelar turno" disabled={appt.status === 'Cancelado'}>
                                    <DeleteOutlineIcon fontSize="small" />
                                  </IconButton>
                                </Stack>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Stack>
            </CardContent>
          </Card>
          <Card
            sx={{
              borderRadius: '20px',
              border: '1px solid #F0DEDE',
              backgroundColor: '#FFFFFF',
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Stack spacing={2.5}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between' }}>
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: '#2C2C2C', mb: 0.5 }}>Agenda mensual</Typography>
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
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                  </Box>
                )}
                {!loading && (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', lg: '1.4fr 1fr' },
                      gap: 3,
                    }}
                  >
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
                              <Typography sx={{ fontWeight: 700, color: '#2C2C2C', mb: 0.5 }}>{day.getDate()}</Typography>
                              {appointmentsForDay.length > 0 ? (
                                <Stack spacing={0.5}>
                                  <Typography sx={{ fontSize: '0.78rem', color: '#6B6B6B' }}>{appointmentsForDay.length} turnos</Typography>
                                  <Typography sx={{ fontSize: '0.75rem', color: '#8B6B6B' }}>Ocupados: {occupiedSlots}</Typography>
                                </Stack>
                              ) : (
                                <Typography sx={{ fontSize: '0.75rem', color: '#B8A4A4' }}>Libre</Typography>
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
                      <Typography sx={{ color: '#6B6B6B', mb: 2 }}>Horarios disponibles y ocupados</Typography>

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
                                  <Chip label={appointment.status} size="small" color={statusColor(appointment.status)} sx={{ alignSelf: 'flex-start' }} />
                                </Stack>
                              ) : (
                                <Typography sx={{ fontSize: '0.82rem', color: '#B8A4A4' }}>Libre</Typography>
                              )}
                            </Box>
                          );
                        })}
                      </Stack>
                    </Box>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>

      <Dialog open={Boolean(editing)} onClose={() => setEditing(null)} fullWidth maxWidth="sm">
        <DialogTitle>Editar turno</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, mt: 1 }}>
          <TextField label="Servicio" value={editValues.service} onChange={(event) => setEditValues((prev) => ({ ...prev, service: event.target.value }))} fullWidth disabled />
          <TextField label="Fecha" type="date" value={editValues.date} onChange={(event) => setEditValues((prev) => ({ ...prev, date: event.target.value }))} InputLabelProps={{ shrink: true }} />
          <TextField label="Hora" type="time" value={editValues.time} onChange={(event) => setEditValues((prev) => ({ ...prev, time: event.target.value }))} InputLabelProps={{ shrink: true }} />
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
            {['Pendiente', 'Confirmado', 'Reprogramado', 'Cancelado', 'Completado', 'No asistio'].map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          {editing && (
            <Button variant="text" sx={{ color: '#B00020' }} onClick={() => handleOpenCancel(editing.id)}>
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

