import React from 'react';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  Avatar,
  Menu,
  MenuItem,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';

const Layout = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = React.useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    handleMenuClose();
  };

  const handleProfileClick = () => {
    navigate(`/${user.role}/profile`);
    handleMenuClose();
  };

  const handleDashboardClick = () => {
    navigate(`/${user.role}/dashboard`);
    handleMenuClose();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            LiveHire
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {isAuthenticated ? (
              <>
                <Button color="inherit" onClick={handleDashboardClick}>
                  Dashboard
                </Button>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                    {user?.name?.charAt(0) || user?.companyName?.charAt(0) || user?.email?.charAt(0)}
                  </Avatar>
                </IconButton>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={() => navigate('/company/login')}>
                  Company Login
                </Button>
                <Button color="inherit" onClick={() => navigate('/interviewer/login')}>
                  Interviewer Login
                </Button>
              </>
            )}
          </Box>

          {/* Mobile Navigation */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleProfileClick}>My Profile</MenuItem>
        <MenuItem onClick={handleDashboardClick}>Dashboard</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>

      {/* Mobile Menu */}
      <Menu
        anchorEl={mobileMenuAnchorEl}
        id="mobile-menu"
        open={Boolean(mobileMenuAnchorEl)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {isAuthenticated ? (
          <>
            <MenuItem onClick={handleProfileClick}>My Profile</MenuItem>
            <MenuItem onClick={handleDashboardClick}>Dashboard</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={() => navigate('/company/login')}>Company Login</MenuItem>
            <MenuItem onClick={() => navigate('/interviewer/login')}>Interviewer Login</MenuItem>
          </>
        )}
      </Menu>

      {/* Main Content */}
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) => theme.palette.grey[100],
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} LiveHire. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout; 