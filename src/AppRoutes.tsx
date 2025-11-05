import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import DoctorsPage from './pages/DoctorsPage';
import DoctorProfilePage from './pages/DoctorProfilePage';
import ServicesPage from './pages/ServicesPage';
import BookingPage from './pages/BookingPage';
import HomeModern from './pages/HomeModern';
import ConsultationPage from './pages/ConsultationPage';
import DashboardPage from './pages/DashboardPage';
import ProviderDashboard from './pages/ProviderDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CredentialVerification from './pages/CredentialVerification';
import AuthPage from './pages/AuthPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FAQPage from './pages/FAQPage';
import ContactUsPage from './pages/ContactUsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import HIPAACompliancePage from './pages/HIPAACompliancePage';
import AccessibilityPage from './pages/AccessibilityPage';
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
                
                {/* Protected patient dashboard */}
                <Route 
                  path="/patient-dashboard" 
                  element={
                    <ProtectedRoute requiresDoctor={false}>
                      <PatientDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Admin dashboard - protected admin-only route */}
                <Route 
                  path="/admin-dashboard" 
                  element={
                    <ProtectedRoute requiresDoctor={false}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Protected doctor-only routes */}
                <Route 
                  path="/doctor-dashboard" 
                  element={
                    <ProtectedRoute requiresDoctor={true} requiresVerification={true}>
                      <DoctorDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/doctor/verification" 
                  element={
                    <ProtectedRoute requiresDoctor={true}>
                      <CredentialVerification />
                    </ProtectedRoute>
                  } 
                />
                
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/contact" element={<ContactUsPage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsOfServicePage />} />
                <Route path="/hipaa" element={<HIPAACompliancePage />} />
                <Route path="/accessibility" element={<AccessibilityPage />} />
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