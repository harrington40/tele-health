import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Country, getCountryByCode } from '../types/countries';

interface CountryContextType {
  selectedCountry: Country | null;
  setSelectedCountry: (country: Country | null) => void;
  clearCountry: () => void;
  isCountrySelected: boolean;
  getCountryCurrency: () => string;
  getCountryCallingCode: () => string;
  getCountryTimezones: () => string[];
  getPopularSpecialties: () => string[];
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

interface CountryProviderProps {
  children: ReactNode;
  defaultCountryCode?: string; // Optional default country
}

export const CountryProvider: React.FC<CountryProviderProps> = ({
  children,
  defaultCountryCode = 'US' // Default to United States
}) => {
  const [selectedCountry, setSelectedCountryState] = useState<Country | null>(null);

  // Load saved country from localStorage on mount
  useEffect(() => {
    const savedCountryCode = localStorage.getItem('selectedCountry');
    if (savedCountryCode) {
      const country = getCountryByCode(savedCountryCode);
      if (country) {
        setSelectedCountryState(country);
        return;
      }
    }

    // If no saved country or invalid, set default
    const defaultCountry = getCountryByCode(defaultCountryCode);
    if (defaultCountry) {
      setSelectedCountryState(defaultCountry);
    }
  }, [defaultCountryCode]);

  // Save to localStorage whenever country changes
  useEffect(() => {
    if (selectedCountry) {
      localStorage.setItem('selectedCountry', selectedCountry.code);
    } else {
      localStorage.removeItem('selectedCountry');
    }
  }, [selectedCountry]);

  const setSelectedCountry = (country: Country | null) => {
    setSelectedCountryState(country);
  };

  const clearCountry = () => {
    setSelectedCountryState(null);
  };

  const isCountrySelected = selectedCountry !== null;

  const getCountryCurrency = (): string => {
    return selectedCountry?.currencySymbol || '$';
  };

  const getCountryCallingCode = (): string => {
    return selectedCountry?.callingCode || '+1';
  };

  const getCountryTimezones = (): string[] => {
    return selectedCountry?.timezones || ['UTC+00:00'];
  };

  const getPopularSpecialties = (): string[] => {
    return selectedCountry?.popularSpecialties || [
      'General Practice',
      'Cardiology',
      'Internal Medicine',
      'Pediatrics'
    ];
  };

  const value: CountryContextType = {
    selectedCountry,
    setSelectedCountry,
    clearCountry,
    isCountrySelected,
    getCountryCurrency,
    getCountryCallingCode,
    getCountryTimezones,
    getPopularSpecialties
  };

  return (
    <CountryContext.Provider value={value}>
      {children}
    </CountryContext.Provider>
  );
};

export const useCountry = (): CountryContextType => {
  const context = useContext(CountryContext);
  if (context === undefined) {
    throw new Error('useCountry must be used within a CountryProvider');
  }
  return context;
};

export default CountryProvider;