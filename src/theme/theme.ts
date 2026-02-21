import { createTheme } from '@mui/material/styles';

// Paleta de colores
const PRIMARY_COLOR = '#EEBBC3'; // Rosa medio
const SECONDARY_COLOR = '#D4A5A5'; // Rosa viejo
const BACKGROUND_COLOR = '#FFFFFF'; // Blanco
const TEXT_COLOR = '#2C2C2C';
const LIGHT_GRAY = '#E9E4E2';

export const theme = createTheme({
  palette: {
    primary: {
      main: PRIMARY_COLOR,
      light: '#FFE5EC',
      dark: '#C9A0A0',
      contrastText: '#2C2C2C',
    },
    secondary: {
      main: SECONDARY_COLOR,
      light: '#F5E6E8',
      dark: '#C9A0A0',
      contrastText: '#2C2C2C',
    },
    background: {
      default: BACKGROUND_COLOR,
      paper: '#FFFFFF',
    },
    text: {
      primary: TEXT_COLOR,
      secondary: '#3D3D3D',
    },
    divider: LIGHT_GRAY,
  },
  typography: {
    fontFamily: '"Poppins", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: '3.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '0.04em',
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h2: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '0.04em',
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
      fontWeight: 500,
      fontSize: '1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '25px',
          padding: '12px 28px',
          fontSize: '1rem',
          fontWeight: 500,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 10px 24px rgba(0, 0, 0, 0.12)',
          },
        },
        contained: {
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
        },
        outlined: {
          borderWidth: '1px',
        },
      },
      variants: [
        {
          props: { variant: 'contained' },
          style: {
            background: PRIMARY_COLOR,
            color: TEXT_COLOR,
          },
        },
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 8px 22px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease',
          backgroundColor: '#FFFFFF',
          '&:hover': {
            boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
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
              borderColor: LIGHT_GRAY,
              borderWidth: '1px',
            },
            '&:hover fieldset': {
              borderColor: SECONDARY_COLOR,
            },
            '&.Mui-focused fieldset': {
              borderColor: PRIMARY_COLOR,
              boxShadow: '0 0 0 3px rgba(238, 187, 195, 0.2)',
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
          boxShadow: 'none',
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
