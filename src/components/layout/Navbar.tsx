import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box,
  styled
} from '@mui/material';
import { 
  Search as SearchIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#ff5733', // Logo orange color
  color: '#ffffff',
}));

const LogoContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginRight: '2rem',
  cursor: 'pointer',
});

const Logo = styled('img')({
  height: '40px',
  marginRight: '8px',
});

const Navbar = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  
  return (
    <StyledAppBar position="fixed">
      <Toolbar>
        <LogoContainer onClick={() => navigate('/')}>
          <Logo src="/logo.png" alt="My Gear Garage" />
          <Typography variant="h6" noWrap>
            My Gear Garage
          </Typography>
        </LogoContainer>

        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
          <Button 
            color="inherit" 
            onClick={() => navigate('/')}
          >
            My Garage
          </Button>
          <Button 
            color="inherit" 
            onClick={() => navigate('/add-gear')}
          >
            Add Gear
          </Button>
          <Button 
            color="inherit"
            startIcon={<CategoryIcon />}
            onClick={() => navigate('/categories')}
          >
            Categories
          </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color="inherit" onClick={() => navigate('/search')}>
            <SearchIcon />
          </IconButton>
          <IconButton color="inherit" onClick={() => navigate('/profile')}>
            <PersonIcon />
          </IconButton>
          <IconButton color="inherit" onClick={signOut}>
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar; 