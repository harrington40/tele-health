// =====================================================
// SMART AUTHENTICATION SERVICE
// Handles login, registration, and intelligent routing
// =====================================================

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

// User type definitions
export type UserType = 'admin' | 'patient' | 'doctor';
export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'suspended';

export interface User {
  id: string;
  email: string;
  user_type: UserType;
  verification_status: VerificationStatus;
  first_name: string;
  last_name: string;
  phone?: string;
  profile_picture_url?: string;
  is_active: boolean;
  email_verified: boolean;
  
  // Doctor-specific fields
  specialty?: string;
  license_number?: string;
  consultation_fee?: number;
  average_rating?: number;
  is_accepting_patients?: boolean;
  
  // Patient-specific fields
  blood_type?: string;
  insurance?: {
    provider: string;
    policy_number: string;
    group_number: string;
  };
  
  // Admin-specific fields
  admin_level?: 'super_admin' | 'moderator' | 'support';
  permissions?: string[];
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    email: string;
    user_type: UserType;
    verification_status?: VerificationStatus;
  };
}

// =====================================================
// SMART ROUTING ALGORITHM
// Determines the best dashboard route based on user type and status
// =====================================================
export const determineUserRoute = (user: User): string => {
  // Algorithm: Route based on user type, verification status, and account completeness
  
  // 1. Admin users → Admin Dashboard
  if (user.user_type === 'admin') {
    return '/admin-dashboard';
  }
  
  // 2. Doctor users
  if (user.user_type === 'doctor') {
    // If not verified, route to verification page
    if (user.verification_status === 'pending') {
      return '/doctor/verification';
    }
    
    // If rejected or suspended, route to status page
    if (user.verification_status === 'rejected') {
      return '/doctor/verification-rejected';
    }
    
    if (user.verification_status === 'suspended') {
      return '/doctor/account-suspended';
    }
    
    // If verified and email confirmed, route to doctor dashboard
    if (user.verification_status === 'verified' && user.email_verified) {
      return '/doctor-dashboard';
    }
    
    // If email not verified, route to email verification page
    if (!user.email_verified) {
      return '/verify-email';
    }
    
    // Default for doctors
    return '/doctor-dashboard';
  }
  
  // 3. Patient users
  if (user.user_type === 'patient') {
    // If email not verified, route to email verification
    if (!user.email_verified) {
      return '/verify-email';
    }
    
    // Check if profile is complete
    const isProfileComplete = user.phone && user.blood_type && user.insurance;
    
    // If profile incomplete, route to complete profile page
    if (!isProfileComplete) {
      return '/patient/complete-profile';
    }
    
    // If everything is good, route to patient dashboard
    return '/patient-dashboard';
  }
  
  // Default fallback
  return '/dashboard';
};

// =====================================================
// AUTHENTICATION SERVICE
// =====================================================
class SmartAuthService {
  private tokenKey = 'auth_token';
  private userKey = 'user_data';

  // Login with smart routing
  async login(email: string, password: string): Promise<{ user: User; route: string }> {
    try {
      const response = await axios.post<LoginResponse>(
        `${API_BASE_URL}/auth/login`,
        { email, password }
      );

      if (response.data.success) {
        const { token, user } = response.data.data;
        
        // Store authentication data
        this.setToken(token);
        this.setUser(user);
        
        // Determine smart route
        const route = determineUserRoute(user);
        
        // Log login activity
        this.logActivity('login', `User logged in and routed to ${route}`);
        
        return { user, route };
      }
      
      throw new Error(response.data.message || 'Login failed');
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  // Register patient with smart routing
  async registerPatient(data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone: string;
    date_of_birth: string;
    gender: string;
    address?: any;
    emergency_contact?: any;
    blood_type?: string;
    insurance?: any;
  }): Promise<{ userId: string; route: string }> {
    try {
      const response = await axios.post<RegistrationResponse>(
        `${API_BASE_URL}/auth/register/patient`,
        data
      );

      if (response.data.success) {
        // After registration, route to email verification
        return {
          userId: response.data.data.id,
          route: '/verify-email-pending'
        };
      }
      
      throw new Error(response.data.message || 'Registration failed');
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  // Register doctor with smart routing
  async registerDoctor(data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone: string;
    date_of_birth: string;
    gender: string;
    specialty: string;
    license_number: string;
    npi_number: string;
    medical_school: string;
    graduation_year: number;
    years_of_experience: number;
    bio: string;
    consultation_fee: number;
    languages_spoken?: string[];
    board_certifications?: string[];
  }): Promise<{ userId: string; route: string }> {
    try {
      const response = await axios.post<RegistrationResponse>(
        `${API_BASE_URL}/auth/register/doctor`,
        data
      );

      if (response.data.success) {
        // After doctor registration, route to verification pending page
        return {
          userId: response.data.data.id,
          route: '/doctor/verification-pending'
        };
      }
      
      throw new Error(response.data.message || 'Registration failed');
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  // Get current user with smart route suggestion
  async getCurrentUser(): Promise<{ user: User; route: string } | null> {
    const token = this.getToken();
    
    if (!token) {
      return null;
    }

    try {
      const response = await axios.get<{ success: boolean; data: User }>(
        `${API_BASE_URL}/auth/me`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        const user = response.data.data;
        this.setUser(user);
        
        const route = determineUserRoute(user);
        return { user, route };
      }
      
      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      this.logout();
      return null;
    }
  }

  // Logout
  logout(): void {
    this.logActivity('logout', 'User logged out');
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Set token
  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Get stored user
  getUser(): User | null {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  // Set user
  private setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  // Log activity (for analytics)
  private logActivity(type: string, description: string): void {
    console.log(`[Auth Activity] ${type}: ${description}`);
    // Could send to analytics service here
  }

  // Check if user has specific role
  hasRole(role: UserType): boolean {
    const user = this.getUser();
    return user?.user_type === role;
  }

  // Check if user is verified
  isVerified(): boolean {
    const user = this.getUser();
    return user?.verification_status === 'verified';
  }

  // Check if email is verified
  isEmailVerified(): boolean {
    const user = this.getUser();
    return user?.email_verified === true;
  }
}

// Export singleton instance
export const authService = new SmartAuthService();
export default authService;
