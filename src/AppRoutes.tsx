import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import HomePage from './pages/HomePage';
import DoctorsPage from './pages/DoctorsPage';
import DoctorProfilePage from './pages/DoctorProfilePage';
import ServicesPage from './pages/ServicesPage';
import BookingPage from './pages/BookingPage';
import ConsultationPage from './pages/ConsultationPage';
import DashboardPage from './pages/DashboardPage';
import ProviderDashboard from './pages/ProviderDashboard';
import AuthPage from './pages/AuthPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './App.css';

const AppRoutes: React.FC = () => {
  return (
    <Box className="app">
      <Routes>
        {/* Auth routes without navbar/footer */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Main app routes with navbar/footer */}
        <Route path="/*" element={
          <>
            <Navbar />
            <Box component="main" className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/doctors" element={<DoctorsPage />} />
                <Route path="/doctor/:id" element={<DoctorProfilePage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/booking" element={<BookingPage />} />
                <Route path="/consultation/:id" element={<ConsultationPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/provider-dashboard" element={<ProviderDashboard />} />
                <Route path="/auth" element={<AuthPage />} />
              </Routes>
            </Box>
            <Footer />
          </>
        } />
      </Routes>
    </Box>
  );
};

export default AppRoutes;