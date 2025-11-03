import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CountryProvider } from './contexts/CountryContext';
// import './i18n/i18n'; // Initialize i18n
import AppRoutes from './AppRoutes';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CountryProvider>
        <Router>
          <AppRoutes />
        </Router>
      </CountryProvider>
    </ThemeProvider>
  );
}

export default App;