import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  MenuItem,
  TextField,
  InputAdornment,
  Typography,
  Paper,
  Divider,
  Chip,
  Avatar,
  ListSubheader,
  Fade,
  Popper,
  ClickAwayListener,
  ListItemAvatar,
  ListItemText
} from '@mui/material';
import {
  Search as SearchIcon,
  KeyboardArrowDown as ArrowDownIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Country, COUNTRIES, searchCountries, getSmartCountrySuggestions } from '../../types/countries';

interface CountrySelectorProps {
  selectedCountry: Country | null;
  onCountryChange: (country: Country) => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'outlined' | 'contained' | 'text';
  showPopular?: boolean;
  showSmartSuggestions?: boolean;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  selectedCountry,
  onCountryChange,
  size = 'medium',
  variant = 'outlined',
  showPopular = true,
  showSmartSuggestions = true
}) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCountries, setFilteredCountries] = useState<Country[]>(COUNTRIES);
  const [smartSuggestions, setSmartSuggestions] = useState<Country[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const open = Boolean(anchorEl);

  // Group countries by region
  const groupedCountries = filteredCountries.reduce((acc, country) => {
    if (!acc[country.region]) {
      acc[country.region] = [];
    }
    acc[country.region].push(country);
    return acc;
  }, {} as Record<string, Country[]>);

  // Sort regions with Americas first if showSmartSuggestions is true
  const sortedRegions = Object.keys(groupedCountries).sort((a, b) => {
    if (showSmartSuggestions && a === 'Americas') return -1;
    if (showSmartSuggestions && b === 'Americas') return 1;
    if (a === 'Africa') return -1;
    if (b === 'Africa') return 1;
    return a.localeCompare(b);
  });

  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredCountries(searchCountries(searchQuery));
    } else {
      setFilteredCountries(COUNTRIES);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (open && searchInputRef.current) {
      // Focus search input when menu opens
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [open]);

  // Generate smart country suggestions based on user context
  useEffect(() => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const userLanguage = navigator.language;
    const suggestions = getSmartCountrySuggestions(userTimezone, userLanguage);
    setSmartSuggestions(suggestions);
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSearchQuery('');
  };

  const handleCountrySelect = (country: Country) => {
    onCountryChange(country);
    handleClose();
  };

  const renderCountryItem = (country: Country) => (
    <MenuItem
      key={country.code}
      onClick={() => handleCountrySelect(country)}
      sx={{
        py: 1.5,
        px: 2,
        '&:hover': {
          backgroundColor: 'action.hover',
        },
        minHeight: 'auto'
      }}
    >
      <ListItemAvatar sx={{ minWidth: 40 }}>
        <Avatar
          sx={{
            width: 28,
            height: 28,
            fontSize: '1rem',
            backgroundColor: 'transparent'
          }}
        >
          {country.flag}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="body2" fontWeight="medium">
            {country.name}
          </Typography>
        }
        secondary={
          <Typography variant="caption" color="text.secondary">
            {country.nativeName !== country.name ? country.nativeName : country.capital}
          </Typography>
        }
      />
      {country.telemedicineRegulated && (
        <Chip
          label="Telemedicine"
          size="small"
          color="success"
          variant="outlined"
          sx={{ ml: 1, fontSize: '0.7rem', height: 20 }}
        />
      )}
    </MenuItem>
  );

  return (
    <Box>
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        endIcon={<ArrowDownIcon />}
        startIcon={
          selectedCountry ? (
            <Box component="span" sx={{ fontSize: '1.2rem' }}>
              {selectedCountry.flag}
            </Box>
          ) : (
            <LocationIcon />
          )
        }
        sx={{
          minWidth: 200,
          justifyContent: 'space-between',
          textTransform: 'none',
          borderRadius: 2,
          px: 2,
          py: 1,
          '& .MuiButton-startIcon': {
            mr: 1
          }
        }}
      >
        <Typography variant="body2" noWrap sx={{ maxWidth: 140 }}>
          {selectedCountry ? selectedCountry.name : t('common.selectCountry', 'Select Country')}
        </Typography>
      </Button>

      <Popper
        open={open}
        anchorEl={anchorEl}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
        sx={{ zIndex: 1300 }}
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            timeout={200}
            style={{
              transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
            }}
          >
            <Paper
              sx={{
                mt: 1,
                minWidth: 400,
                maxWidth: 500,
                maxHeight: 600,
                overflow: 'hidden',
                borderRadius: 2,
                boxShadow: (theme) => theme.shadows[8],
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <Box>
                  {/* Search Header */}
                  <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder={t('common.searchCountries', 'Search countries...') || 'Search countries...'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      inputRef={searchInputRef}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ color: 'action.active' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Box>

                  {/* Popular Countries - commented out as function removed */}
                  {/* {showPopular && !searchQuery && (
                    <>
                      <Box sx={{ p: 2, pb: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                          🌟 {t('common.popularCountries', 'Popular Countries')}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {getPopularCountries().slice(0, 8).map((country: Country) => (
                            <Chip
                              key={country.code}
                              label={`${country.flag} ${country.name}`}
                              size="small"
                              onClick={() => handleCountrySelect(country)}
                              sx={{
                                cursor: 'pointer',
                                '&:hover': {
                                  backgroundColor: 'action.hover',
                                }
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                      <Divider />
                    </>
                  )} */}

                  {/* Smart Suggestions */}
                  {showSmartSuggestions && !searchQuery && smartSuggestions.length > 0 && (
                    <>
                      <Box sx={{ p: 2, pb: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                          🤖 <span>{t('common.smartSuggestions', 'Smart Suggestions')}</span>
                          <Chip 
                            label="AI" 
                            size="small" 
                            color="primary" 
                            variant="outlined" 
                            sx={{ fontSize: '0.7rem', height: 18 }} 
                          />
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
                          {t('common.basedOnLocation', 'Based on your location and language preferences')}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {smartSuggestions.slice(0, 12).map((country: Country) => (
                            <Chip
                              key={country.code}
                              label={`${country.flag} ${country.name}`}
                              size="small"
                              variant="outlined"
                              onClick={() => handleCountrySelect(country)}
                              sx={{
                                cursor: 'pointer',
                                borderColor: 'primary.light',
                                '&:hover': {
                                  backgroundColor: 'primary.light',
                                  color: 'primary.contrastText',
                                  transform: 'scale(1.05)',
                                },
                                transition: 'all 0.2s ease',
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                      <Divider />
                    </>
                  )}

                  {/* Countries List */}
                  <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                    {sortedRegions.map((region) => (
                      <Box key={region}>
                        <ListSubheader
                          sx={{
                            backgroundColor: 'background.paper',
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            py: 1,
                            fontWeight: 'bold',
                            fontSize: '0.875rem'
                          }}
                        >
                          {region === 'Africa' ? '🌍 ' : ''}{region}
                          {region === 'Africa' && (
                            <Typography variant="caption" color="primary" sx={{ ml: 1 }}>
                              ({groupedCountries[region].length} countries)
                            </Typography>
                          )}
                        </ListSubheader>
                        {groupedCountries[region].map(renderCountryItem)}
                      </Box>
                    ))}

                    {filteredCountries.length === 0 && (
                      <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          {t('common.noCountriesFound', 'No countries found')}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </Box>
  );
};

export default CountrySelector;