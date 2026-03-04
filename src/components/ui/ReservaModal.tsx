'use client';

import {
  Alert,
  Box,
  Button,
  Chip,
  DialogActions,
  Dialog,
  DialogContent,
  DialogTitle,
  Grow,
  IconButton,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { esES } from '@mui/x-date-pickers/locales';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/es';
import { useCallback, useEffect, useState } from 'react';
import { LOCATIONS, LocationKey, getAvailableDaysLabel, isDateAvailable } from '@/lib/booking';

type ServiceOption = {
  id: string;
  name: string;
  depositAmount: number;
};

type AvailableSlot = {
  time: string;
  available: boolean;
  reason?: string;
};

export function ReservaModal() {
  dayjs.locale('es');
  const [open, setOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationKey | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientNameError, setPatientNameError] = useState<string | null>(null);
  const [patientPhoneError, setPatientPhoneError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [weekUnavailable, setWeekUnavailable] = useState(false);
  const [weekCheckLoading, setWeekCheckLoading] = useState(false);
  const [availabilityByDate, setAvailabilityByDate] = useState<Record<string, boolean | null>>({});
  const [monthLoading, setMonthLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => dayjs());
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [servicesError, setServicesError] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  const appointmentsUrl = `${apiBaseUrl.replace(/\/$/, '')}/api/appointments`;
  const paymentsUrl = `${apiBaseUrl.replace(/\/$/, '')}/api/payments/create-preference`;
  const servicesUrl = `${apiBaseUrl.replace(/\/$/, '')}/api/services`;
  const availableSlotsUrl = `${appointmentsUrl}/available-slots`;

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-reserva-modal', handler);
    return () => window.removeEventListener('open-reserva-modal', handler);
  }, []);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const loadServices = async () => {
      if (!apiBaseUrl) {
        setServicesError('Falta configurar NEXT_PUBLIC_API_BASE_URL.');
        return;
      }
      try {
        const response = await fetch(servicesUrl, { signal: controller.signal });
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
          .map((item) => ({
            id: String((item as { id?: string }).id ?? ''),
            name: String((item as { name?: string }).name ?? 'Servicio'),
            depositAmount: Number(
              (item as { depositAmount?: number | string }).depositAmount ?? 0,
            ),
          }))
          .filter((item) => item.id);
        if (mounted) {
          setServices(normalized);
          if (normalized.length === 0) {
            setServicesError('No hay servicios disponibles para reservar.');
            setSelectedServiceId('');
          } else {
            setServicesError(null);
            setSelectedServiceId((prev) => prev || normalized[0].id);
          }
        }
      } catch {
        if (mounted) {
          setServicesError('No se pudieron cargar los servicios disponibles.');
          setServices([]);
          setSelectedServiceId('');
        }
      }
    };

    loadServices();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [apiBaseUrl, servicesUrl]);

  useEffect(() => {
    if (!selectedDate || !selectedServiceId || !selectedLocation) {
      setAvailableSlots([]);
      setSlotsError(null);
      setSlotsLoading(false);
      return;
    }
    if (!isDateAvailable(selectedLocation, selectedDate)) {
      setAvailableSlots([]);
      setSlotsError(null);
      setSlotsLoading(false);
      return;
    }
    if (!apiBaseUrl) {
      setSlotsError('Falta configurar NEXT_PUBLIC_API_BASE_URL.');
      setAvailableSlots([]);
      return;
    }

    let mounted = true;
    const controller = new AbortController();

    const loadAvailableSlots = async () => {
      setSlotsLoading(true);
      setSlotsError(null);
      try {
        const query = new URLSearchParams({
          serviceId: selectedServiceId,
          date: selectedDate,
        }).toString();
        const response = await fetch(`${availableSlotsUrl}?${query}`, {
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
          .map((item) => {
            const timeValue = String((item as { time?: string }).time ?? '').trim();
            const available = Boolean((item as { available?: boolean }).available);
            const reason = (item as { reason?: string }).reason;
            if (!timeValue) return null;
            return {
              time: timeValue.slice(0, 5),
              available,
              reason,
            } as AvailableSlot;
          })
          .filter((slot): slot is AvailableSlot => Boolean(slot));
        if (mounted) {
          setAvailableSlots(normalized);
          if (selectedDate) {
            const hasAvailable = normalized.some((slot) => slot.available);
            setAvailabilityByDate((prev) => ({ ...prev, [selectedDate]: hasAvailable }));
          }
        }
      } catch {
        if (mounted) {
          setSlotsError('No se pudieron cargar los horarios disponibles.');
          setAvailableSlots([]);
        }
      } finally {
        if (mounted) {
          setSlotsLoading(false);
        }
      }
    };

    loadAvailableSlots();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [apiBaseUrl, availableSlotsUrl, selectedDate, selectedLocation, selectedServiceId]);

  useEffect(() => {
    if (!selectedTime) return;
    const availableTimes = availableSlots.filter((slot) => slot.available).map((slot) => slot.time);
    if (!availableTimes.includes(selectedTime)) {
      setSelectedTime(null);
    }
  }, [availableSlots, selectedTime]);

  const handleClose = () => {
    setOpen(false);
    setPaymentDialogOpen(false);
  };
  const handleLocationChange = (location: LocationKey) => {
    setSelectedLocation(location);
    setSelectedDate('');
    setSelectedTime(null);
    setDateError(null);
    setWeekUnavailable(false);
    setAvailabilityByDate({});
  };
  const handleDateChange = (value: string) => {
    setSelectedDate(value);
    setSelectedTime(null);
    if (value) {
      setCurrentMonth(dayjs(value));
    }
  };
  const handleNameChange = (value: string) => {
    const sanitized = value.replace(/[^\p{L}\s'-]/gu, '');
    setPatientName(sanitized);
    setPatientNameError(value !== sanitized ? 'Solo se permiten letras y espacios.' : null);
  };
  const handlePhoneChange = (value: string) => {
    const hasInvalidChars = /[^\d+()\s-]/.test(value);
    const sanitized = value.replace(/[^\d+()\s-]/g, '');
    setPatientPhone(sanitized);
    const digits = sanitized.replace(/\D/g, '');
    if (hasInvalidChars) {
      setPatientPhoneError('Solo se permiten números.');
      return;
    }
    if (digits.length > 0 && (digits.length < 8 || digits.length > 15)) {
      setPatientPhoneError('Ingresá un teléfono válido.');
      return;
    }
    setPatientPhoneError(null);
  };

  const toLocalDateValue = (date: Date) => {
    const local = new Date(date);
    local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
    return local.toISOString().slice(0, 10);
  };

  const getWeekDates = (dateValue: string) => {
    const date = new Date(`${dateValue}T00:00:00`);
    if (Number.isNaN(date.getTime())) return [];
    const day = date.getDay();
    const mondayOffset = (day + 6) % 7;
    const monday = new Date(date);
    monday.setDate(date.getDate() - mondayOffset);
    return Array.from({ length: 7 }, (_, index) => {
      const current = new Date(monday);
      current.setDate(monday.getDate() + index);
      return toLocalDateValue(current);
    });
  };

  const getMonthDates = (monthValue: Dayjs) => {
    const start = monthValue.startOf('month');
    const daysInMonth = monthValue.daysInMonth();
    return Array.from({ length: daysInMonth }, (_, index) =>
      start.add(index, 'day').format('YYYY-MM-DD'),
    );
  };

  const fetchAvailabilityForDate = useCallback(
    async (dateValue: string, signal?: AbortSignal) => {
      if (!apiBaseUrl || !selectedServiceId) return null;
      if (selectedLocation && !isDateAvailable(selectedLocation, dateValue)) return false;
      try {
        const query = new URLSearchParams({
          serviceId: selectedServiceId,
          date: dateValue,
        }).toString();
        const response = await fetch(`${availableSlotsUrl}?${query}`, { signal });
        if (!response.ok) return null;
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
        return list.some((item) => Boolean((item as { available?: boolean }).available));
      } catch {
        return null;
      }
    },
    [apiBaseUrl, availableSlotsUrl, selectedLocation, selectedServiceId],
  );

  const textFieldSx = {
    '& .MuiInputBase-root': {
      borderRadius: '12px',
      backgroundColor: '#FFFFFF',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#DDDDDD',
      borderWidth: '1px',
    },
    '& .MuiInputBase-input': {
      padding: '14px 18px',
      fontSize: '0.98rem',
      color: '#2C2C2C',
    },
    '& .MuiInputBase-input::placeholder': {
      color: '#999999',
      opacity: 1,
    },
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#EEBBC3',
      boxShadow: '0 0 0 4px rgba(238, 187, 195, 0.1)',
    },
    '& .MuiSelect-icon': {
      color: '#666666',
    },
  } as const;

  const availableDaysLabel = selectedLocation ? getAvailableDaysLabel(selectedLocation) : '';
  const availableTimeSlots = availableSlots
    .filter((slot) => slot.available)
    .map((slot) => slot.time);
  const showWeekUnavailable = weekUnavailable && !slotsError;
  const timeSlots = selectedDate && !dateError && !showWeekUnavailable
    ? availableSlots.filter((slot) => slot.available)
    : [];
  const shouldShowNoSlotsMessage =
    selectedDate && !dateError && !showWeekUnavailable
      ? !slotsLoading && !slotsError && availableTimeSlots.length === 0
      : false;
  const selectedLocationLabel = selectedLocation
    ? (LOCATIONS.find((item) => item.id === selectedLocation)?.label ?? '')
    : '';
  const showAlert = (message: string) => {
    setAlertMessage(message);
    setAlertOpen(true);
  };

  const parseResponsePayload = async (response: Response) => {
    const rawText = await response.text();

    if (!rawText) {
      return null;
    }

    try {
      return JSON.parse(rawText) as unknown;
    } catch {
      return rawText;
    }
  };

  const getErrorMessage = (payload: unknown, fallback: string) => {
    if (typeof payload === 'string' && payload.trim()) {
      return payload;
    }

    if (payload && typeof payload === 'object') {
      const message = (payload as { message?: unknown }).message;

      if (typeof message === 'string' && message.trim()) {
        return message;
      }

      if (Array.isArray(message) && message.length > 0) {
        return message.join(' | ');
      }

      const error = (payload as { error?: unknown }).error;
      if (typeof error === 'string' && error.trim()) {
        return error;
      }
    }

    return fallback;
  };

  useEffect(() => {
    if (!selectedLocation || !selectedDate) {
      setDateError(null);
      return;
    }
    if (!isDateAvailable(selectedLocation, selectedDate)) {
      setDateError('No hay atención ese día.');
      setAvailableSlots([]);
      setSelectedTime(null);
      return;
    }
    setDateError(null);
  }, [selectedDate, selectedLocation]);

  useEffect(() => {
    if (!open) return;
    setCurrentMonth(selectedDate ? dayjs(selectedDate) : dayjs());
  }, [open, selectedDate]);

  useEffect(() => {
    if (!open || !selectedLocation || !selectedServiceId || !apiBaseUrl) {
      setMonthLoading(false);
      return;
    }
    const monthDates = getMonthDates(currentMonth).filter((dateValue) =>
      isDateAvailable(selectedLocation, dateValue),
    );
    const pendingDates = monthDates.filter((dateValue) => availabilityByDate[dateValue] === undefined);
    if (pendingDates.length === 0) {
      setMonthLoading(false);
      return;
    }
    let mounted = true;
    const controller = new AbortController();

    const loadMonthAvailability = async () => {
      setMonthLoading(true);
      const results: Record<string, boolean | null> = {};
      const queue = [...pendingDates];
      const concurrency = Math.min(5, queue.length);
      const worker = async () => {
        while (queue.length > 0 && !controller.signal.aborted) {
          const dateValue = queue.shift();
          if (!dateValue) break;
          const available = await fetchAvailabilityForDate(dateValue, controller.signal);
          results[dateValue] = available;
        }
      };
      try {
        await Promise.all(Array.from({ length: concurrency }, () => worker()));
        if (mounted && Object.keys(results).length > 0) {
          setAvailabilityByDate((prev) => ({ ...prev, ...results }));
        }
      } finally {
        if (mounted) setMonthLoading(false);
      }
    };

    loadMonthAvailability();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [
    apiBaseUrl,
    availabilityByDate,
    currentMonth,
    fetchAvailabilityForDate,
    open,
    selectedLocation,
    selectedServiceId,
  ]);

  useEffect(() => {
    if (!selectedLocation || !selectedServiceId || !selectedDate || !apiBaseUrl) {
      setWeekUnavailable(false);
      setWeekCheckLoading(false);
      return;
    }
    if (dateError) {
      setWeekUnavailable(false);
      setWeekCheckLoading(false);
      return;
    }
    let mounted = true;
    const controller = new AbortController();

    const checkWeekAvailability = async () => {
      setWeekCheckLoading(true);
      try {
        const weekDates = getWeekDates(selectedDate).filter((dateValue) =>
          selectedLocation ? isDateAvailable(selectedLocation, dateValue) : true,
        );
        if (weekDates.length === 0) {
          if (mounted) setWeekUnavailable(true);
          return;
        }
        const results = await Promise.all(
          weekDates.map(async (dateValue) => ({
            date: dateValue,
            available: await fetchAvailabilityForDate(dateValue, controller.signal),
          })),
        );
        if (mounted) {
          const availabilityMap = results.reduce<Record<string, boolean | null>>((acc, item) => {
            acc[item.date] = item.available;
            return acc;
          }, {});
          setAvailabilityByDate((prev) => ({ ...prev, ...availabilityMap }));
          const hasKnown = results.some((item) => item.available !== null);
          const hasAvailable = results.some((item) => item.available === true);
          setWeekUnavailable(hasKnown ? !hasAvailable : false);
        }
      } finally {
        if (mounted) setWeekCheckLoading(false);
      }
    };

    checkWeekAvailability();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [apiBaseUrl, availableSlotsUrl, dateError, selectedDate, selectedLocation, selectedServiceId]);

  const validateReservation = () => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('turnera_access_token');
    if (!token) {
      showAlert('Para confirmar la reserva necesitas iniciar sesion.');
      return false;
    }
    if (patientNameError) {
      showAlert(patientNameError);
      return false;
    }
    if (patientPhoneError) {
      showAlert(patientPhoneError);
      return false;
    }
    if (
      !selectedLocation ||
      !selectedDate ||
      !selectedTime ||
      !patientName ||
      !patientPhone ||
      !patientEmail
    ) {
      showAlert('Completa todos los datos para confirmar la reserva.');
      return false;
    }
    const phoneDigits = patientPhone.replace(/\D/g, '');
    if (phoneDigits.length < 8) {
      showAlert('Ingresá un teléfono válido.');
      return false;
    }
    if (dateError) {
      showAlert(dateError);
      return false;
    }
    if (showWeekUnavailable) {
      showAlert('No hay turnos disponibles en esa semana.');
      return false;
    }
    if (!selectedServiceId) {
      showAlert('No hay tratamientos disponibles para reservar.');
      return false;
    }
    if (slotsLoading) {
      showAlert('Espera a que se carguen los horarios disponibles.');
      return false;
    }
    if (slotsError) {
      showAlert(slotsError);
      return false;
    }
    if (selectedTime && !availableTimeSlots.includes(selectedTime)) {
      showAlert('El horario seleccionado ya no esta disponible.');
      return false;
    }
    if (!apiBaseUrl) {
      showAlert('Falta configurar NEXT_PUBLIC_API_BASE_URL.');
      return false;
    }
    if (servicesError) {
      showAlert(servicesError);
      return false;
    }
    return true;
  };

  const createAppointment = async () => {
    try {
      const token = localStorage.getItem('turnera_access_token');
      if (!token) {
        showAlert('Para confirmar la reserva necesitas iniciar sesion.');
        return null;
      }
      const notesParts: string[] = [];
      if (selectedLocationLabel) {
        notesParts.push(`Sede: ${selectedLocationLabel}`);
      }
      if (!selectedServiceId) {
        showAlert('No hay tratamientos disponibles para reservar.');
        return null;
      }
      const payload = {
        serviceId: selectedServiceId,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        patientName,
        patientPhone,
        patientEmail,
        patientNotes: notesParts.length > 0 ? notesParts.join(' | ') : undefined,
      };

      const response = await fetch(appointmentsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const parsed = await parseResponsePayload(response);

      if (!response.ok) {
        const message = getErrorMessage(
          parsed,
          `No se pudo confirmar la reserva (HTTP ${response.status}).`,
        );
        throw new Error(message);
      }

      const appointmentId = String((parsed as { id?: string }).id ?? '').trim();
      return appointmentId || null;
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'No se pudo confirmar la reserva. Intenta nuevamente.';
      console.error('Error creando turno', error);
      showAlert(message);
      return null;
    }
  };

  const createPaymentPreference = async (appointmentId: string) => {
    try {
      const token = localStorage.getItem('turnera_access_token');
      if (!token) {
        showAlert('Para confirmar la reserva necesitas iniciar sesion.');
        return null;
      }

      const selectedService = services.find((service) => service.id === selectedServiceId);
      if (!selectedService) {
        showAlert('No se pudo identificar el tratamiento seleccionado.');
        return null;
      }

      const amount = Number.isFinite(selectedService.depositAmount)
        ? selectedService.depositAmount
        : 0;

      if (amount <= 0) {
        return null;
      }

      const response = await fetch(paymentsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          appointmentId,
          amount,
          description: `Reserva de ${selectedService.name}`,
          payer: {
            email: patientEmail,
            name: patientName,
          },
        }),
      });

      const payload = (await parseResponsePayload(response)) as {
        initPoint?: string;
        sandboxInitPoint?: string;
        checkoutUrl?: string;
        message?: string | string[];
        error?: string;
      } | null;

      if (!response.ok) {
        const message = getErrorMessage(
          payload,
          `No se pudo crear la preferencia de pago (HTTP ${response.status}).`,
        );
        throw new Error(message);
      }

      console.info('Respuesta de preferencia MP', payload);

      return (
        payload?.checkoutUrl ??
        payload?.initPoint ??
        payload?.sandboxInitPoint ??
        null
      );
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'No se pudo iniciar el pago online.';
      console.error('Error creando preferencia de pago', error);
      showAlert(message);
      return null;
    }
  };

  const handleConfirm = () => {
    if (!validateReservation()) return;
    setPaymentDialogOpen(true);
  };

  const handleProceedToPayment = async () => {
    setIsSubmitting(true);
    try {
      const appointmentId = await createAppointment();
      if (!appointmentId) return;

      const paymentLink = await createPaymentPreference(appointmentId);

      if (!paymentLink) {
        showAlert(
          'El turno fue creado, pero no se pudo iniciar el pago online. Contactanos para completarlo.',
        );
        return;
      }

      setPaymentDialogOpen(false);
      setOpen(false);

      if (typeof window !== 'undefined') {
        window.location.href = paymentLink;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Grow}
      TransitionProps={{ timeout: 250 }}
      fullWidth
      maxWidth="sm"
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(5px)',
        },
      }}
      PaperProps={{
        id: 'modalReservaTurnos',
        sx: {
          borderRadius: '24px',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 18px 50px rgba(0,0,0,0.12)',
        },
      }}
    >
      <DialogContent sx={{ p: { xs: 3, md: 5 }, position: 'relative' }}>
        <Box
          component="form"
          onSubmit={(event) => {
            event.preventDefault();
            handleConfirm();
          }}
        >
          <IconButton
            aria-label="Cerrar"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 16, top: 16, color: '#3D3D3D' }}
          >
            <CloseIcon />
          </IconButton>

          <Typography
            variant="h2"
            sx={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: { xs: '2rem', md: '2.3rem' },
              color: '#2C2C2C',
              letterSpacing: '0.04em',
              fontWeight: 600,
              textAlign: 'center',
              mb: 1,
            }}
          >
            Reservá tu consulta
          </Typography>
          <Typography
            sx={{
              textAlign: 'center',
              color: '#666666',
              fontSize: '1rem',
              mb: 4,
            }}
          >
            Atención personalizada en minutos
          </Typography>

          <Box sx={{ display: 'grid', gap: 3, mb: 3 }}>
            <Box>
              <Typography sx={{ fontSize: '0.9rem', color: '#3D3D3D', mb: 1 }}>
                Nombre completo
              </Typography>
              <TextField
                fullWidth
                placeholder="Ingresá tu nombre"
                value={patientName}
                onChange={(event) => handleNameChange(event.target.value)}
                error={Boolean(patientNameError)}
                helperText={patientNameError ?? ' '}
                sx={textFieldSx}
              />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.9rem', color: '#3D3D3D', mb: 1 }}>Teléfono</Typography>
              <TextField
                fullWidth
                placeholder="+54 9 11 1234-5678"
                value={patientPhone}
                onChange={(event) => handlePhoneChange(event.target.value)}
                error={Boolean(patientPhoneError)}
                helperText={patientPhoneError ?? ' '}
                sx={textFieldSx}
              />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.9rem', color: '#3D3D3D', mb: 1 }}>Email</Typography>
              <TextField
                fullWidth
                placeholder="Ingresá tu email"
                value={patientEmail}
                onChange={(event) => setPatientEmail(event.target.value)}
                sx={textFieldSx}
              />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.9rem', color: '#3D3D3D', mb: 1 }}>
                Seleccione lugar de atención
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                {LOCATIONS.map((location) => {
                  const isSelected = selectedLocation === location.id;
                  return (
                    <Button
                      key={location.id}
                      onClick={() => handleLocationChange(location.id)}
                      variant={isSelected ? 'contained' : 'outlined'}
                      sx={{
                        borderRadius: '999px',
                        px: 3,
                        py: 1,
                        borderColor: '#EEBBC3',
                        backgroundColor: isSelected ? '#EEBBC3' : '#FFFFFF',
                        color: isSelected ? '#2C2C2C' : '#3D3D3D',
                        textTransform: 'none',
                        fontWeight: 500,
                        boxShadow: isSelected ? '0 8px 20px rgba(238, 187, 195, 0.3)' : 'none',
                        '&:hover': {
                          backgroundColor: isSelected ? '#FFB8C6' : '#F5E6E8',
                          borderColor: '#FFB8C6',
                        },
                      }}
                    >
                      {location.label}
                    </Button>
                  );
                })}
              </Box>
              {selectedLocation && (
                <Typography sx={{ mt: 1.2, fontSize: '0.82rem', color: '#666666' }}>
                  Estás reservando en:{' '}
                  <strong>{LOCATIONS.find((item) => item.id === selectedLocation)?.label}</strong>
                </Typography>
              )}
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.9rem', color: '#3D3D3D', mb: 1 }}>Fecha</Typography>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="es"
                localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
              >
                <DatePicker
                  value={selectedDate ? dayjs(selectedDate) : null}
                  onChange={(newValue: Dayjs | null) =>
                    handleDateChange(
                      newValue && newValue.isValid() ? newValue.format('YYYY-MM-DD') : '',
                    )
                  }
                  onMonthChange={(newMonth: Dayjs) => setCurrentMonth(newMonth)}
                  disabled={!selectedLocation}
                  disablePast
                  shouldDisableDate={(value: Dayjs) => {
                    if (!selectedLocation) return true;
                    const dateValue = value.format('YYYY-MM-DD');
                    if (!isDateAvailable(selectedLocation, dateValue)) return true;
                    const knownAvailability = availabilityByDate[dateValue];
                    // Solo habilitar fechas confirmadas como disponibles.
                    return knownAvailability !== true;
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: Boolean(dateError || showWeekUnavailable),
                      helperText: dateError
                        ? dateError
                        : showWeekUnavailable
                          ? 'No hay turnos disponibles en esa semana.'
                          : monthLoading
                            ? 'Cargando disponibilidad del mes...'
                            : weekCheckLoading
                              ? 'Verificando disponibilidad de la semana...'
                              : ' ',
                      sx: textFieldSx,
                    },
                  }}
                />
              </LocalizationProvider>
              <Typography sx={{ mt: 1, fontSize: '0.82rem', color: '#666666' }}>
                {selectedLocation
                  ? `Dí­as disponibles: ${availableDaysLabel}`
                  : 'Selecciona una sede para ver los días disponibles.'}
              </Typography>
            </Box>
          </Box>

          <Typography sx={{ color: '#2C2C2C', fontWeight: 500, mb: 2 }}>
            Horarios disponibles
          </Typography>
          {slotsLoading ? (
            <Typography sx={{ color: '#9C6B6B', fontSize: '0.9rem', mb: 3 }}>
              Cargando horarios...
            </Typography>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                gap: 1.5,
                mb: 3,
              }}
            >
              {timeSlots.map((slot) => {
                const isSelected = selectedTime === slot.time;
                const isAvailable = slot.available;
                return (
                  <Button
                    key={slot.time}
                    onClick={() => setSelectedTime(slot.time)}
                    variant="outlined"
                    disabled={!isAvailable}
                    title={slot.reason ?? (isAvailable ? 'Disponible' : 'No disponible')}
                    sx={{
                      borderRadius: '20px',
                      px: 2,
                      py: 1.2,
                      borderWidth: '2px',
                      borderColor: isAvailable ? '#EEBBC3' : '#E0E0E0',
                      backgroundColor: isSelected ? '#EEBBC3' : '#FFFFFF',
                      color: isSelected ? '#FFFFFF' : isAvailable ? '#2C2C2C' : '#B0B0B0',
                      textTransform: 'none',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: isAvailable ? (isSelected ? '#EEBBC3' : '#F5E6E8') : '#FFFFFF',
                        transform: isAvailable ? 'translateY(-2px)' : 'none',
                        borderColor: isAvailable ? '#FFB8C6' : '#E0E0E0',
                      },
                      '&.Mui-disabled': {
                        opacity: 1,
                        borderColor: '#E0E0E0',
                        backgroundColor: '#F7F4F5',
                        color: '#B0B0B0',
                        textDecoration: 'line-through',
                      },
                    }}
                  >
                    {slot.time}
                  </Button>
                );
              })}
            </Box>
          )}
          {shouldShowNoSlotsMessage && (
            <Typography sx={{ color: '#9C6B6B', fontSize: '0.9rem', mb: 3 }}>
              No hay turnos disponibles este d­a
            </Typography>
          )}
          {slotsError && (
            <Typography sx={{ color: '#B00020', fontSize: '0.9rem', mb: 3 }}>
              {slotsError}
            </Typography>
          )}

          <Typography sx={{ mb: 2, fontSize: '0.9rem', color: '#8B6B6B', textAlign: 'center' }}>
            La consulta es paga. Al confirmar seras redirigido al pago.
          </Typography>

          <Button
            fullWidth
            variant="contained"
            size="large"
            type="submit"
            startIcon={<CalendarMonthIcon />}
            disabled={isSubmitting}
            sx={{
              borderRadius: '12px',
              py: '18px',
              backgroundColor: '#EEBBC3',
              color: '#2C2C2C',
              fontWeight: 600,
              textTransform: 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#FFB8C6',
                boxShadow: '0 12px 24px rgba(238, 187, 195, 0.35)',
              },
            }}
          >
            {isSubmitting ? 'Confirmando...' : 'Confirmar reserva'}
          </Button>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: { xs: 2, md: 4 },
              mt: 3,
              pt: 3,
              borderTop: '1px solid #F5E6E8',
            }}
          >
            <Chip
              icon={<VerifiedUserOutlinedIcon sx={{ color: '#D4A5A5' }} />}
              label="Atención personalizada"
              sx={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E9E4E2',
                borderRadius: '999px',
                color: '#3D3D3D',
                fontWeight: 400,
              }}
            />
            <Chip
              icon={<CheckCircleOutlineIcon sx={{ color: '#D4A5A5' }} />}
              label="Equipamiento de última generación"
              sx={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E9E4E2',
                borderRadius: '999px',
                color: '#3D3D3D',
                fontWeight: 400,
              }}
            />
          </Box>
        </Box>
      </DialogContent>
      <Snackbar
        open={alertOpen}
        autoHideDuration={4000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setAlertOpen(false)} severity="warning" sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>

      <Dialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Consulta paga</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#6B6B6B', lineHeight: 1.7 }}>
            La consulta tiene costo. Al continuar vas a ser redirigido a la pasarela de pago para
            completar la reserva.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setPaymentDialogOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleProceedToPayment}
            disabled={isSubmitting}
            sx={{
              backgroundColor: '#EEBBC3',
              color: '#2C2C2C',
              '&:hover': { backgroundColor: '#FFB8C6' },
            }}
          >
            Ir a pagar
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}
