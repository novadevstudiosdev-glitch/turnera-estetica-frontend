'use client';

import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Grow,
  IconButton,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { submitFeedback } from '@/services/feedback';

type FeedbackModalProps = {
  open: boolean;
  onClose: () => void;
};

type FeedbackStatus = 'idle' | 'loading' | 'success' | 'error';

const MAX_CHARS = 300;
const MIN_CHARS = 10;

export function FeedbackModal({ open, onClose }: FeedbackModalProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<FeedbackStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const trimmed = content.trim();
  const contentLength = content.length;
  const isValid = trimmed.length >= MIN_CHARS && trimmed.length <= MAX_CHARS;

  const validationMessage = useMemo(() => {
    if (!submitted) return null;
    if (!trimmed.length) return 'El comentario no puede estar vacío.';
    if (trimmed.length < MIN_CHARS) return 'Mínimo 10 caracteres.';
    if (trimmed.length > MAX_CHARS) return `Máximo ${MAX_CHARS} caracteres.`;
    return null;
  }, [submitted, trimmed.length]);

  useEffect(() => {
    if (open) {
      setSubmitted(false);
      if (status !== 'success') {
        setErrorMessage(null);
      }
    }
  }, [open, status]);

  const handleClose = () => {
    if (status === 'success') {
      setStatus('idle');
      setContent('');
      setErrorMessage(null);
      setSubmitted(false);
    }
    onClose();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setContent(value.slice(0, MAX_CHARS));
    if (status === 'error') {
      setStatus('idle');
      setErrorMessage(null);
    }
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    if (!isValid || status === 'loading') return;

    setStatus('loading');
    setErrorMessage(null);
    try {
      await submitFeedback(trimmed);
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'No pudimos enviar tu comentario. Intentá nuevamente.'
      );
    }
  };

  const textFieldSx = {
    '& .MuiInputBase-root': {
      borderRadius: '14px',
      backgroundColor: '#FFFFFF',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#E6DDDA',
      borderWidth: '1px',
    },
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#DCCBC6',
    },
    '& .MuiInputBase-input': {
      padding: '14px 16px',
      fontSize: '0.96rem',
      color: '#2C2C2C',
    },
    '& .MuiInputLabel-root': {
      color: '#6B6B6B',
      fontWeight: 500,
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#D4A5A5',
    },
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#D4A5A5',
      boxShadow: '0 0 0 4px rgba(212, 165, 165, 0.15)',
    },
  } as const;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Grow}
      TransitionProps={{ timeout: 240 }}
      fullWidth
      maxWidth="sm"
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(20, 20, 20, 0.35)',
          backdropFilter: 'blur(6px)',
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: '24px',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 20px 50px rgba(0,0,0,0.14)',
        },
      }}
    >
      <DialogContent sx={{ p: { xs: 3, md: 4 }, position: 'relative' }}>
        <IconButton
          aria-label="Cerrar"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 16, top: 16, color: '#3D3D3D' }}
        >
          <CloseIcon />
        </IconButton>

        <Typography
          variant="h5"
          sx={{
            fontFamily: '"Cormorant Garamond", serif',
            fontWeight: 600,
            color: '#2C2C2C',
            textAlign: 'left',
            mb: 2,
            pr: 4,
          }}
        >
          Dejá tu comentario
        </Typography>

        {status === 'success' ? (
          <Box sx={{ display: 'grid', gap: 2 }}>
            <Typography sx={{ color: '#4A4A4A', fontSize: '1rem' }}>
              Gracias 🙌 Tu comentario quedará pendiente de aprobación.
            </Typography>
            <Button
              variant="contained"
              onClick={handleClose}
              sx={{
                alignSelf: 'flex-start',
                backgroundColor: '#EEBBC3',
                color: '#2C2C2C',
                border: '1px solid #D4A5A5',
                borderRadius: '999px',
                px: 3.5,
              }}
            >
              Cerrar
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gap: 2 }}>
            <TextField
              label="Comentario"
              placeholder="Escribí tu comentario acá..."
              multiline
              minRows={isMobile ? 4 : 5}
              maxRows={8}
              value={content}
              onChange={handleChange}
              error={Boolean(validationMessage)}
              sx={textFieldSx}
              inputProps={{ maxLength: MAX_CHARS }}
            />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
              }}
            >
              <Typography sx={{ color: '#B00020', fontSize: '0.9rem', minHeight: 20 }}>
                {validationMessage ?? ' '}
              </Typography>
              <Typography sx={{ color: '#7A7A7A', fontSize: '0.85rem' }}>
                {contentLength}/{MAX_CHARS}
              </Typography>
            </Box>

            {status === 'error' && errorMessage ? (
              <Typography sx={{ color: '#B00020', fontSize: '0.9rem' }}>
                {errorMessage}
              </Typography>
            ) : null}

            <Box
              sx={{
                display: 'flex',
                gap: 1.5,
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'flex-end',
              }}
            >
              <Button
                variant="outlined"
                onClick={handleClose}
                disabled={status === 'loading'}
                sx={{
                  borderRadius: '999px',
                  borderColor: '#E6DDDA',
                  color: '#3A3A3A',
                  '&:hover': {
                    borderColor: '#DCCBC6',
                    backgroundColor: '#F8F5F4',
                  },
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={status === 'loading'}
                sx={{
                  borderRadius: '999px',
                  backgroundColor: '#EEBBC3',
                  color: '#2C2C2C',
                  border: '1px solid #D4A5A5',
                  minWidth: 140,
                }}
              >
                {status === 'loading' ? (
                  <CircularProgress size={18} sx={{ color: '#2C2C2C' }} />
                ) : (
                  'Enviar'
                )}
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
