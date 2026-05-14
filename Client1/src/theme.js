import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#ff0000',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#282828',
      contrastText: '#ffffff'
    },
    error: {
      main: '#c62828'
    },
    success: {
      main: '#2e7d32'
    },
    background: {
      default: '#f9f9f9',
      paper: '#ffffff'
    },
    text: {
      primary: '#030303',
      secondary: '#606060'
    }
  },
  typography: {
    fontFamily: ['Roboto', 'Arial', 'sans-serif'].join(', ')
  }
});

export const applyTheme = () => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.style.setProperty('--primary-color', theme.palette.primary.main);
  root.style.setProperty('--secondary-color', theme.palette.secondary.main);
  root.style.setProperty('--background-color', theme.palette.background.default);
  root.style.setProperty('--surface-color', theme.palette.background.paper);
  root.style.setProperty('--text-primary', theme.palette.text.primary);
  root.style.setProperty('--text-secondary', theme.palette.text.secondary);
  root.style.setProperty('--inverse-text', theme.palette.primary.contrastText);
  root.style.setProperty('--border-color', '#e5e5e5');
  root.style.setProperty('--hover-bg', '#f2f2f2');
  root.style.setProperty('--shadow', '0 1px 3px rgba(0, 0, 0, 0.1)');
  root.style.setProperty('--panel-shadow', '0 18px 48px rgba(15, 23, 42, 0.06)');
  root.style.setProperty('--overlay', 'rgba(0, 0, 0, 0.12)');
  root.style.setProperty('--overlay-dark', 'rgba(0, 0, 0, 0.2)');
  root.style.setProperty('--danger-color', theme.palette.error.main);
  root.style.setProperty('--danger-bg', '#ffebee');
  root.style.setProperty('--danger-dark', '#d32f2f');
  root.style.setProperty('--success-color', theme.palette.success.main);
  root.style.setProperty('--success-bg', '#e8f5e8');
  root.style.setProperty('--warning-color', '#ff9800');
  root.style.setProperty('--warning-dark', '#f57c00');
  root.style.setProperty('--accent-color', '#2563eb');
  root.style.setProperty('--accent-bg', 'rgba(37, 99, 235, 0.12)');
  root.style.setProperty('--accent-border', 'rgba(37, 99, 235, 0.16)');
  root.style.setProperty('--accent-gradient', 'rgba(96, 165, 250, 0.06)');
  root.style.setProperty('--input-bg', '#f8fafc');
  root.style.setProperty('--surface-dark', '#000000');
  root.style.setProperty('--surface-light', '#ffffff');
  root.style.setProperty('--overlay-light', 'rgba(255, 255, 255, 0.85)');
};

export default theme;
