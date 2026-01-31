import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CountryProvider } from './contexts/CountryContext';
import { AuthProvider } from './contexts/AuthContext';
// import './i18n/i18n'; // Initialize i18n
import AppRoutes from './AppRoutes';
import InactivityWarningDialog from './components/InactivityWarningDialog';
import { useInactivityTimeout } from './hooks/useInactivityTimeout';
import { useAuth } from './contexts/AuthContext';

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

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [showWarning, setShowWarning] = React.useState(false);
  const [timeRemaining, setTimeRemaining] = React.useState(120); // 2 minutes

  const { extendSession, logoutNow, timeUntilTimeout } = useInactivityTimeout({
    timeout: 15 * 60 * 1000, // 15 minutes
    promptBefore: 2 * 60 * 1000, // 2 minutes before timeout
    onPrompt: () => {
      if (isAuthenticated) {
        setTimeRemaining(120); // 2 minutes
        setShowWarning(true);
      }
    },
    onTimeout: () => {
      setShowWarning(false);
      console.log('Session timed out due to inactivity');
    }
  });

  const handleExtendSession = () => {
    setShowWarning(false);
    extendSession();
  };

  const handleLogoutNow = () => {
    setShowWarning(false);
    logoutNow();
  };

  // Update countdown every second when warning is shown
  React.useEffect(() => {
    if (!showWarning) return;

    const interval = setInterval(() => {
      const remaining = Math.ceil(timeUntilTimeout() / 1000);
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        setShowWarning(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [showWarning, timeUntilTimeout]);

  return (
    <>
      <Router>
        <AppRoutes />
      </Router>

      <InactivityWarningDialog
        open={showWarning}
        onExtend={handleExtendSession}
        onLogout={handleLogoutNow}
        timeRemaining={timeRemaining}
        totalTime={120}
      />
    </>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CountryProvider>
          <AppContent />
        </CountryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;