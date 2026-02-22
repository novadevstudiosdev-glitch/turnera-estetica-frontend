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
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import { useEffect, useState } from 'react';
import {
  LOCATIONS,
  LocationKey,
  getAvailableDaysLabel,
  getTimeSlots,
  isDateAvailable,
} from '@/lib/booking';


type ServiceOption = {
  id: string;
  name: string;
};

export function ReservaModal() {
  const [open, setOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationKey | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientNote, setPatientNote] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [servicesError, setServicesError] = useState<string | null>(null);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  const appointmentsUrl = `${apiBaseUrl.replace(/\/$/, '')}/api/appointments`;
  const servicesUrl = `${apiBaseUrl.replace(/\/$/, '')}/api/services`;
  const paymentUrl = (process.env.NEXT_PUBLIC_PAYMENT_URL ?? '').trim();
  const hasPaymentUrl = paymentUrl.length > 0;

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
          }))
          .filter((item) => item.id);
        if (mounted) {
          setServices(normalized);
          if (normalized.length === 0) {
            setServicesError('No hay servicios disponibles para reservar.');
          } else {
            setServicesError(null);
          }
        }
      } catch {
        if (mounted) {
          setServicesError('No se pudieron cargar los servicios disponibles.');
          setServices([]);
        }
      }
    };

    loadServices();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [apiBaseUrl, servicesUrl]);

  const handleClose = () => {
    setOpen(false);
    setPaymentDialogOpen(false);
  };
  const handleLocationChange = (location: LocationKey) => {
    setSelectedLocation(location);
    setSelectedDate('');
    setSelectedTime(null);
  };
  const handleDateChange = (value: string) => {
    setSelectedDate(value);
    setSelectedTime(null);
  };

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

  const menuProps = {
    PaperProps: {
      sx: {
        backgroundColor: '#FFFFFF',
        border: '1px solid #E9E4E2',
        borderRadius: '16px',
        boxShadow: '0 10px 24px rgba(0,0,0,0.1)',
      },
    },
    MenuListProps: {
      sx: {
        '& .MuiMenuItem-root': {
          color: '#2C2C2C',
          borderRadius: '12px',
          mx: 0.5,
          my: 0.5,
        },
        '& .MuiMenuItem-root:hover': {
          backgroundColor: '#F5E6E8',
        },
        '& .MuiMenuItem-root.Mui-selected': {
          backgroundColor: '#EEBBC3',
          color: '#FFFFFF',
        },
        '& .MuiMenuItem-root.Mui-selected:hover': {
          backgroundColor: '#FFB8C6',
        },
      },
    },
  };

  const todayValue = new Date().toISOString().split('T')[0];
  const availableDaysLabel = selectedLocation ? getAvailableDaysLabel(selectedLocation) : '';
  const timeSlots =
    selectedLocation && selectedDate ? getTimeSlots(selectedLocation, selectedDate) : [];
  const shouldShowNoSlotsMessage =
    selectedLocation && selectedDate
      ? !isDateAvailable(selectedLocation, selectedDate) || timeSlots.length === 0
      : false;
  const selectedLocationLabel = selectedLocation
    ? LOCATIONS.find((item) => item.id === selectedLocation)?.label ?? ''
    : '';
  const selectedService = services.find((service) => service.id === selectedServiceId);
  const formatDate = (value: string) => {
    if (!value) return '';
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };
  const summaryItems = [
    { label: 'Tratamiento', value: selectedService?.name || 'Pendiente' },
    { label: 'Sede', value: selectedLocationLabel || 'Pendiente' },
    { label: 'Fecha', value: formatDate(selectedDate) || 'Pendiente' },
    { label: 'Horario', value: selectedTime || 'Pendiente' },
    { label: 'Nombre', value: patientName || 'Pendiente' },
    { label: 'Telefono', value: patientPhone || 'Pendiente' },
    { label: 'Email', value: patientEmail || 'Pendiente' },
  ];
  const summaryNote = patientNote.trim();

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setAlertOpen(true);
  };

  const validateReservation = () => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('turnera_access_token');
    if (!token) {
      showAlert('Para confirmar la reserva necesitas iniciar sesion.');
      return false;
    }
    if (
      !selectedLocation ||
      !selectedDate ||
      !selectedTime ||
      !selectedServiceId ||
      !patientName ||
      !patientPhone ||
      !patientEmail
    ) {
      showAlert('Completa todos los datos para confirmar la reserva.');
      return false;
    }
    if (!selectedService) {
      showAlert('Selecciona un tratamiento valido para continuar.');
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
    if (!hasPaymentUrl) {
      showAlert('Falta configurar la pasarela de pago.');
      return false;
    }
    return true;
  };

  const createAppointment = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('turnera_access_token');
      if (!token) {
        showAlert('Para confirmar la reserva necesitas iniciar sesion.');
        return false;
      }
      const notesParts: string[] = [];
      if (selectedLocationLabel) {
        notesParts.push(`Sede: ${selectedLocationLabel}`);
      }
      if (summaryNote) {
        notesParts.push(`Motivo: ${summaryNote}`);
      }
      const payload = {
        serviceId: selectedService.id,
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

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return true;
    } catch {
      showAlert('No se pudo confirmar la reserva. Intenta nuevamente.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirm = () => {
    if (!validateReservation()) return;
    setPaymentDialogOpen(true);
  };

  const handleProceedToPayment = async () => {
    const ok = await createAppointment();
    if (!ok) return;
    setPaymentDialogOpen(false);
    setOpen(false);
    if (typeof window !== 'undefined') {
      window.location.href = paymentUrl;
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
                onChange={(event) => setPatientName(event.target.value)}
                sx={textFieldSx}
              />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.9rem', color: '#3D3D3D', mb: 1 }}>Teléfono</Typography>
              <TextField
                fullWidth
                placeholder="+54 9 11 1234-5678"
                value={patientPhone}
                onChange={(event) => setPatientPhone(event.target.value)}
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
                Tratamiento
              </Typography>
              <TextField
                fullWidth
                select
                value={selectedServiceId}
                onChange={(event) => setSelectedServiceId(event.target.value)}
                SelectProps={{
                  IconComponent: KeyboardArrowDownIcon,
                  displayEmpty: true,
                  MenuProps: menuProps,
                }}
                sx={textFieldSx}
              >
                <MenuItem disabled value="">
                  Seleccioná un tratamiento
                </MenuItem>
                {services.length > 0 ? (
                  services.map((service) => (
                    <MenuItem key={service.id} value={service.id}>
                      {service.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled value="no-services">
                    No hay servicios disponibles
                  </MenuItem>
                )}
              </TextField>
              {servicesError && (
                <Typography sx={{ mt: 1, fontSize: '0.82rem', color: '#B00020' }}>
                  {servicesError}
                </Typography>
              )}
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
              <TextField
                fullWidth
                type="date"
                InputLabelProps={{ shrink: true }}
                value={selectedDate}
                onChange={(event) => handleDateChange(event.target.value)}
                disabled={!selectedLocation}
                inputProps={{ min: todayValue }}
                sx={textFieldSx}
              />
              <Typography sx={{ mt: 1, fontSize: '0.82rem', color: '#666666' }}>
                {selectedLocation
                  ? `Días disponibles: ${availableDaysLabel}`
                  : 'Selecciona una sede para ver los días disponibles.'}
              </Typography>
            </Box>
          </Box>

          <Typography sx={{ color: '#2C2C2C', fontWeight: 500, mb: 2 }}>
            Horarios disponibles
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 1.5,
              mb: 3,
            }}
          >
            {timeSlots.map((slot) => {
              const isSelected = selectedTime === slot;
              return (
                <Button
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  variant="outlined"
                  sx={{
                    borderRadius: '20px',
                    px: 2,
                    py: 1.2,
                    borderWidth: '2px',
                    borderColor: '#EEBBC3',
                    backgroundColor: isSelected ? '#EEBBC3' : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : '#2C2C2C',
                    textTransform: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: isSelected ? '#EEBBC3' : '#F5E6E8',
                      transform: 'translateY(-2px)',
                      borderColor: '#FFB8C6',
                    },
                  }}
                >
                  {slot}
                </Button>
              );
            })}
          </Box>
          {shouldShowNoSlotsMessage && (
            <Typography sx={{ color: '#9C6B6B', fontSize: '0.9rem', mb: 3 }}>
              No hay turnos disponibles este día
            </Typography>
          )}

          <Box sx={{ mb: 4 }}>
            <Typography sx={{ fontSize: '0.9rem', color: '#3D3D3D', mb: 1 }}>
              Motivo de consulta (opcional)
            </Typography>
            <TextField
              fullWidth
              multiline
              minRows={3}
              placeholder="Contanos tu consulta"
              value={patientNote}
              onChange={(event) => setPatientNote(event.target.value)}
              sx={textFieldSx}
            />
          </Box>

          <Box
            sx={{
              mb: 4,
              p: 3,
              borderRadius: '16px',
              backgroundColor: '#FDF4F6',
              border: '1px solid #F5E6E8',
            }}
          >
            <Typography sx={{ fontWeight: 600, color: '#2C2C2C' }}>Resumen del turno</Typography>
            <Box sx={{ display: 'grid', gap: 1.2, mt: 2 }}>
              {summaryItems.map((item) => {
                const isPending = item.value === 'Pendiente';
                return (
                  <Box
                    key={item.label}
                    sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}
                  >
                    <Typography sx={{ fontSize: '0.86rem', color: '#6B6B6B' }}>
                      {item.label}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '0.9rem',
                        color: isPending ? '#B28C8C' : '#2C2C2C',
                        fontWeight: isPending ? 500 : 600,
                        textAlign: 'right',
                      }}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
            {summaryNote && (
              <Typography sx={{ mt: 2, fontSize: '0.86rem', color: '#6B6B6B' }}>
                Motivo: {summaryNote}
              </Typography>
            )}
            <Typography sx={{ mt: 1.5, fontSize: '0.78rem', color: '#9C6B6B' }}>
              Revisá que los datos sean correctos antes de confirmar.
            </Typography>
          </Box>

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
