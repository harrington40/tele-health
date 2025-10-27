import React from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  Box,
  Typography,
  SelectChangeEvent
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Language } from '@mui/icons-material';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 120 }}>
      <Language sx={{ mr: 1, color: 'inherit' }} />
      <FormControl size="small" variant="outlined">
        <Select
          value={i18n.language}
          onChange={handleLanguageChange}
          sx={{
            color: 'inherit',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
            '& .MuiSelect-icon': {
              color: 'inherit',
            },
          }}
        >
          <MenuItem value="en">
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                component="span"
                sx={{
                  fontSize: '1.2em',
                  mr: 1,
                }}
              >
                🇺🇸
              </Box>
              English
            </Box>
          </MenuItem>
          <MenuItem value="es">
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                component="span"
                sx={{
                  fontSize: '1.2em',
                  mr: 1,
                }}
              >
                🇪🇸
              </Box>
              Español
            </Box>
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default LanguageSwitcher;