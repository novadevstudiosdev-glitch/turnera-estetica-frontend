'use client';

import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  Grow,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import { useEffect, useState } from 'react';

const TIME_SLOTS = ['09:00 AM', '10:30 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];
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

export function ReservaModal() {
  const [open, setOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-reserva-modal', handler);
    return () => window.removeEventListener('open-reserva-modal', handler);
  }, []);

  const handleClose = () => setOpen(false);

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
        <Box component="form" onSubmit={(event) => event.preventDefault()}>
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
              <TextField fullWidth placeholder="Ingresá tu nombre" sx={textFieldSx} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.9rem', color: '#3D3D3D', mb: 1 }}>
                Teléfono
              </Typography>
              <TextField fullWidth placeholder="+54 9 11 1234-5678" sx={textFieldSx} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.9rem', color: '#3D3D3D', mb: 1 }}>
                Email
              </Typography>
              <TextField fullWidth placeholder="Ingresá tu email" sx={textFieldSx} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.9rem', color: '#3D3D3D', mb: 1 }}>
                Tratamiento
              </Typography>
              <TextField
                fullWidth
                select
                defaultValue=""
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
                {TREATMENTS.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.9rem', color: '#3D3D3D', mb: 1 }}>
                Fecha
              </Typography>
              <TextField
                fullWidth
                type="date"
                InputLabelProps={{ shrink: true }}
                sx={textFieldSx}
              />
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
            {TIME_SLOTS.map((slot) => {
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

          <Box sx={{ mb: 4 }}>
            <Typography sx={{ fontSize: '0.9rem', color: '#3D3D3D', mb: 1 }}>
              Motivo de consulta (opcional)
            </Typography>
            <TextField
              fullWidth
              multiline
              minRows={3}
              placeholder="Contanos tu consulta"
              sx={textFieldSx}
            />
          </Box>

          <Button
            fullWidth
            variant="contained"
            size="large"
            type="submit"
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
                boxShadow: '0 12px 24px rgba(238, 187, 195, 0.35)',
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
    </Dialog>
  );
}
