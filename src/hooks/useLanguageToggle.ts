import { useTranslation } from 'react-i18next';

export const useLanguageToggle = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLanguage);
  };

  const getCurrentLanguage = () => i18n.language;

  return {
    toggleLanguage,
    getCurrentLanguage,
    currentLanguage: i18n.language
  };
};

export default useLanguageToggle;