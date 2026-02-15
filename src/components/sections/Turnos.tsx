'use client';

import { Box, Button, Chip, Container, MenuItem, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  LOCATIONS,
  LocationKey,
  getAvailableDaysLabel,
  getTimeSlots,
  isDateAvailable,
} from '@/lib/booking';

const TREATMENTS = [
  'Toxina Botulínica',
  'Rellenos con Ácido Hialurónico',
  'Hilos Tensores',
  'Bioestimuladores de Colágeno',
  'Peeling Químico',
  'Mesoterapia Facial',
  'Plasma Rico en Plaquetas',
  'Limpieza Facial Profunda',
  'Radiofrecuencia',
  'Otro / Consulta General',
];

export function TurnosSection() {
  const [selectedLocation, setSelectedLocation] = useState<LocationKey | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedTreatment, setSelectedTreatment] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');

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
      borderColor: '#E9E4E2',
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
      boxShadow: '0 0 0 3px rgba(238, 187, 195, 0.2)',
    },
    '& .MuiSelect-icon': {
      color: '#D4A5A5',
    },
  } as const;

  const menuProps = {
    PaperProps: {
      sx: {
        backgroundColor: '#FFFFFF',
        border: '1px solid #E9E4E2',
        borderRadius: '16px',
        boxShadow: '0 10px 24px rgba(0,0,0,0.08)',
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
    Boolean(selectedLocation && selectedDate) &&
    (!isDateAvailable(selectedLocation, selectedDate) || timeSlots.length === 0);
  const selectedLocationLabel = selectedLocation
    ? LOCATIONS.find((item) => item.id === selectedLocation)?.label ?? ''
    : '';
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
    { label: 'Tratamiento', value: selectedTreatment || 'Pendiente' },
    { label: 'Sede', value: selectedLocationLabel || 'Pendiente' },
    { label: 'Fecha', value: formatDate(selectedDate) || 'Pendiente' },
    { label: 'Horario', value: selectedTime || 'Pendiente' },
    { label: 'Nombre', value: patientName || 'Pendiente' },
    { label: 'WhatsApp', value: patientPhone || 'Pendiente' },
  ];

  return (
    <Box
      id="turnos"
      component="section"
      sx={{
        py: { xs: 10, md: 12 },
        backgroundColor: '#F5E6E8',
        backgroundImage:
          'radial-gradient(circle at 15% 20%, rgba(255, 229, 236, 0.18) 0%, rgba(255, 229, 236, 0) 55%), radial-gradient(circle at 85% 10%, rgba(255, 229, 236, 0.16) 0%, rgba(255, 229, 236, 0) 60%), radial-gradient(circle at 70% 85%, rgba(255, 229, 236, 0.14) 0%, rgba(255, 229, 236, 0) 55%)',
      }}
    >
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box
          sx={{
            width: '100%',
            maxWidth: '600px',
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            boxShadow: '0 15px 50px rgba(0,0,0,0.08)',
            p: { xs: 4, md: 7.5 },
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: { xs: '2.1rem', md: '2.5rem' },
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
              color: '#3D3D3D',
              fontSize: '1rem',
              mb: 5,
            }}
          >
            Atención personalizada en minutos
          </Typography>

          <Box sx={{ display: 'grid', gap: 3, mb: 4 }}>
            <Box>
              <Typography sx={{ fontSize: '0.9rem', color: '#3D3D3D', mb: 1 }}>
                Tratamiento
              </Typography>
              <TextField
                fullWidth
                select
                value={selectedTreatment}
                onChange={(event) => setSelectedTreatment(event.target.value)}
                SelectProps={{
                  IconComponent: KeyboardArrowDownIcon,
                  MenuProps: menuProps,
                  displayEmpty: true,
                }}
                sx={textFieldSx}
              >
                <MenuItem disabled value="">
                  Seleccioná un tratamiento
                </MenuItem>
                {TREATMENTS.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.9rem', color: '#3D3D3D', mb: 1 }}>
                Seleccione lugar de atenciÃ³n
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
                  EstÃ¡s reservando en:{' '}
                  <strong>
                    {LOCATIONS.find((item) => item.id === selectedLocation)?.label}
                  </strong>
                </Typography>
              )}
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.9rem', color: '#3D3D3D', mb: 1 }}>
                Fecha
              </Typography>
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
                  ? `DÃ­as disponibles: ${availableDaysLabel}`
                  : 'SeleccionÃ¡ una sede para ver los dÃ­as disponibles.'}
              </Typography>
            </Box>
          </Box>

          <Typography sx={{ color: '#2C2C2C', fontWeight: 500, mb: 2 }}>
            Horarios disponibles
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 1.5,
              mb: 4,
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
            <Typography sx={{ color: '#9C6B6B', fontSize: '0.9rem', mb: 4 }}>
              No hay turnos disponibles este dÃ­a
            </Typography>
          )}

          <Box sx={{ display: 'grid', gap: 3, mb: 5 }}>
            <Box>
              <Typography sx={{ fontSize: '0.9rem', color: '#3D3D3D', mb: 1 }}>
                Nombre y apellido
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
              <Typography sx={{ fontSize: '0.9rem', color: '#3D3D3D', mb: 1 }}>
                WhatsApp
              </Typography>
              <TextField
                fullWidth
                placeholder="Ingresá tu número"
                value={patientPhone}
                onChange={(event) => setPatientPhone(event.target.value)}
                sx={textFieldSx}
              />
            </Box>
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
            <Typography sx={{ mt: 1.5, fontSize: '0.78rem', color: '#9C6B6B' }}>
              Revisá que los datos sean correctos antes de confirmar.
            </Typography>
          </Box>

          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<CalendarMonthIcon />}
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
                boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
              },
            }}
          >
            Confirmar reserva
          </Button>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: { xs: 2, md: 4 },
              mt: 3,
            }}
          >
            {['Atención personalizada', 'Equipamiento de última generación'].map((label) => (
              <Chip
                key={label}
                icon={<CheckCircleOutlineIcon sx={{ color: '#D4A5A5' }} />}
                label={label}
                sx={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E9E4E2',
                  borderRadius: '999px',
                  color: '#3D3D3D',
                  fontWeight: 400,
                }}
              />
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
