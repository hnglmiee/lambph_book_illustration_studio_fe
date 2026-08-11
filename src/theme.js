import { createTheme } from '@mui/material/styles';

export const colors = {
  orange: '#FF6B00',
  orangeHover: '#E85F00',
  orangeLight: '#FFA861',
  orangePale: '#FFC391',
  orangeDeep: '#3A160A',

  ink: '#231F20',
  inkBody: '#434343',
  ink2: '#595959',
  ink3: '#919699',
  line: '#BAB7B1',
  paper: '#F2EEE7',
  paper2: '#F8F8F8',
  white: '#FFFFFF',
  black: '#1D1C1D',

  border1: '#BAB7B1',
  border2: '#E8E2E0',
  accentSoft: '#FFEEDF',
};

export const theme = createTheme({
  palette: {
    primary: {
      main: colors.orange,
      dark: colors.orangeHover,
      contrastText: '#fff',
    },
    text: {
      primary: colors.ink,
      secondary: colors.ink2,
      disabled: colors.ink3,
    },
    background: {
      default: colors.paper2,
      paper: colors.white,
    },
  },

  typography: {
    fontFamily: '"Noto Sans", system-ui, sans-serif',

    h2: {
      fontSize: 32,
      lineHeight: 1.1,
      fontWeight: 700,
    },

    h3: {
      fontSize: 24,
      lineHeight: 1.1,
      fontWeight: 600,
    },

    h4: {
      fontSize: 18,
      lineHeight: 1.1,
      fontWeight: 700,
    },

    body1: {
      fontSize: 16,
      lineHeight: 1.5,
    },
  },

  shape: {
    borderRadius: 8,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontFamily: '"Noto Sans", system-ui, sans-serif',
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
    },
  },
});