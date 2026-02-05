import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  userType: 'client' | 'provider';
  country?: {
    code: string;
    name: string;
  };
  profilePicture?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
    country?: {
      code: string;
      name: string;
      flag: string;
      callingCode: string;
    };
    province?: string;
  };
  medicalHistory?: string[];
  allergies?: string[];
  currentMedications?: string[];
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    groupNumber?: string;
  };
  preferences?: {
    language: string;
    notifications: boolean;
    marketingEmails: boolean;
  };
  createdAt: string;
  lastLoginAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingVerification: { email: string; userId: string; type: 'login' | 'registration' } | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ requiresVerification: boolean; email?: string; userId?: string }>;
  verifyCode: (email: string, code: string, type: 'login' | 'registration') => Promise<User>;
  resendCode: (email: string, type: 'login' | 'registration') => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingVerification, setPendingVerification] = useState<{ email: string; userId: string; type: 'login' | 'registration' } | null>(null);

  // Load user from backend on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';
        const response = await fetch(`${apiBaseUrl}/api/auth/me`, {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          const user = data.user;

          // Transform to frontend User format
          const frontendUser: User = {
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            phone: user.phone,
            userType: user.user_type === 'patient' ? 'client' : user.user_type === 'doctor' ? 'provider' : user.user_type,
            country: user.country,
            profilePicture: '/api/placeholder/150/150',
            dateOfBirth: '',
            gender: '',
            address: '',
            emergencyContact: undefined,
            medicalHistory: [],
            allergies: [],
            currentMedications: [],
            insuranceInfo: undefined,
            preferences: {
              language: 'en',
              notifications: true,
              marketingEmails: false
            },
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString()
          };

          setUser(frontendUser);
        } else if (response.status === 401) {
          // User not authenticated - this is normal, not an error
          setUser(null);
        }
      } catch (error) {
        // Only log actual network errors, not auth failures
        if (error instanceof TypeError) {
          console.error('Network error loading user data:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string, rememberMe = false): Promise<{ requiresVerification: boolean; email?: string; userId?: string }> => {
    setIsLoading(true);
    try {
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';
      const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      const data = await response.json();
      
      // Check if verification is required
      if (data.requiresVerification) {
        setPendingVerification({
          email: data.email,
          userId: data.userId,
          type: 'login'
        });
        return {
          requiresVerification: true,
          email: data.email,
          userId: data.userId
        };
      }

      // If no verification needed (shouldn't happen with new flow, but handle it)
      if (data.user) {
        const user = data.user;
        const frontendUser: User = {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          phone: user.phone,
          userType: user.user_type === 'patient' ? 'client' : user.user_type === 'doctor' ? 'provider' : user.user_type,
          country: user.country,
          profilePicture: '/api/placeholder/150/150',
          dateOfBirth: '',
          gender: '',
          address: '',
          emergencyContact: undefined,
          medicalHistory: [],
          allergies: [],
          currentMedications: [],
          insuranceInfo: undefined,
          preferences: {
            language: 'en',
            notifications: true,
            marketingEmails: false
          },
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        };
        setUser(frontendUser);
      }

      return { requiresVerification: false };
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async (email: string, code: string, type: 'login' | 'registration'): Promise<User> => {
    setIsLoading(true);
    try {
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';
      const response = await fetch(`${apiBaseUrl}/api/auth/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, code, type }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Verification failed');
      }

      const data = await response.json();
      const user = data.user;

      // Transform to frontend User format
      const frontendUser: User = {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
        userType: user.user_type === 'patient' ? 'client' : user.user_type === 'doctor' ? 'provider' : user.user_type,
        country: user.country,
        profilePicture: '/api/placeholder/150/150',
        dateOfBirth: '',
        gender: '',
        address: '',
        emergencyContact: undefined,
        medicalHistory: [],
        allergies: [],
        currentMedications: [],
        insuranceInfo: undefined,
        preferences: {
          language: 'en',
          notifications: true,
          marketingEmails: false
        },
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };

      setUser(frontendUser);
      setPendingVerification(null);
      return frontendUser;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async (email: string, type: 'login' | 'registration'): Promise<void> => {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';
    const response = await fetch(`${apiBaseUrl}/api/auth/resend-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, type }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to resend code');
    }
  };

  const logout = async () => {
    try {
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';
      await fetch(`${apiBaseUrl}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    pendingVerification,
    login,
    verifyCode,
    resendCode,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};