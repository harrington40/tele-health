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
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
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

  // Load user from backend on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/auth/me', {
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
            userType: user.user_type === 'patient' ? 'client' : user.user_type,
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
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string, rememberMe = false) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8081/api/auth/login', {
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
      const user = data.user;

      // Transform to frontend User format
      const frontendUser: User = {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
        userType: user.user_type === 'patient' ? 'client' : user.user_type,
        profilePicture: '/api/placeholder/150/150',
        dateOfBirth: '', // Not provided in response
        gender: '', // Not provided
        address: '', // Not provided
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
    } catch (error) {
      throw new Error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('http://localhost:8081/api/auth/logout', {
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
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};