import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Divider,
} from '@mui/material';
import { Menu as MenuIcon, Person, ExpandMore } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [legalAnchorEl, setLegalAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLegalMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLegalAnchorEl(event.currentTarget);
  };

  const handleLegalMenuClose = () => {
    setLegalAnchorEl(null);
  };

  const navigationItems = [
    { label: 'Home', path: '/' },
    { label: 'Doctors', path: '/doctors' },
    { label: 'Services', path: '/services' },
    { label: 'Help Center', path: '/help' },
    { label: 'Contact Us', path: '/contact' },
    { label: 'Book Appointment', path: '/booking' },
  ];

  const legalItems = [
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
    { label: 'HIPAA Compliance', path: '/hipaa' },
    { label: 'Accessibility', path: '/accessibility' },
  ];

  return (
    <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black' }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ 
            flexGrow: 1, 
            fontWeight: 'bold', 
            color: 'primary.main',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/')}
        >
          Telehealth Portal
        </Typography>

        {isMobile ? (
          <Box>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {navigationItems.map((item) => (
                <MenuItem
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    handleMenuClose();
                  }}
                >
                  {item.label}
                </MenuItem>
              ))}
              <Divider />
              <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
                Legal & Compliance
              </Typography>
              {legalItems.map((item) => (
                <MenuItem
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    handleMenuClose();
                  }}
                >
                  {item.label}
                </MenuItem>
              ))}
              <Divider />
              <MenuItem
                onClick={() => {
                  navigate('/auth');
                  handleMenuClose();
                }}
              >
                Sign In
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                onClick={() => navigate(item.path)}
                sx={{ color: 'text.primary' }}
              >
                {item.label}
              </Button>
            ))}
            <Button
              color="inherit"
              onClick={handleLegalMenuOpen}
              endIcon={<ExpandMore />}
              sx={{ color: 'text.primary' }}
            >
              Legal
            </Button>
            <Menu
              anchorEl={legalAnchorEl}
              open={Boolean(legalAnchorEl)}
              onClose={handleLegalMenuClose}
            >
              {legalItems.map((item) => (
                <MenuItem
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    handleLegalMenuClose();
                  }}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
            <Button
              variant="outlined"
              startIcon={<Person />}
              onClick={() => navigate('/auth')}
              sx={{ 
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                }
              }}
            >
              Sign In
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;