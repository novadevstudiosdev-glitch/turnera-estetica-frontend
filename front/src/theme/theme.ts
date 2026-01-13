import { createTheme } from '@mui/material/styles';

// Paleta de colores
const PRIMARY_COLOR = '#FFF8E7'; // Blanco crema
const SECONDARY_COLOR = '#D4A5A5'; // Rosa viejo
const BACKGROUND_COLOR = '#FFF8E7'; // Blanco crema
const TEXT_COLOR = '#1A1A1A'; // Negro
const LIGHT_GRAY = '#E8E3DF';

export const theme = createTheme({
  palette: {
    primary: {
      main: PRIMARY_COLOR,
      light: '#FFF8E7',
      dark: '#A06B7D',
      contrastText: '#fff',
    },
    secondary: {
      main: SECONDARY_COLOR,
      light: '#FFF8E7',
      dark: '#6B5A6C',
      contrastText: '#fff',
    },
    background: {
      default: BACKGROUND_COLOR,
      paper: '#FFF8E7',
    },
    text: {
      primary: TEXT_COLOR,
      secondary: '#666666',
    },
    divider: LIGHT_GRAY,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
      '@media (max-width:600px)': {
        fontSize: '1.25rem',
      },
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.9rem',
      lineHeight: 1.6,
      fontWeight: 400,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          padding: '12px 32px',
          fontSize: '1rem',
          fontWeight: 600,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(196, 138, 154, 0.25)',
          },
        },
        contained: {
          boxShadow: '0 2px 8px rgba(196, 138, 154, 0.15)',
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
      },
      variants: [
        {
          props: { variant: 'contained' },
          style: {
            background: "#D4A5A5"
          },
        },
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease',
          backgroundColor: '#FFFFFF',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            '& fieldset': {
              borderColor: SECONDARY_COLOR,
              borderWidth: '1.5px',
            },
            '&:hover fieldset': {
              borderColor: SECONDARY_COLOR,
            },
            '&.Mui-focused fieldset': {
              borderColor: SECONDARY_COLOR,
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: BACKGROUND_COLOR,
          color: TEXT_COLOR,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
});

export default theme;
