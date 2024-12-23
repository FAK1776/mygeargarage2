import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  TextField, 
  Typography, 
  Container,
  Chip,
  CircularProgress,
  InputAdornment,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase';
import { GearService } from '../services/gearService';
import { GearCard } from '../components/gear/GearCard';
import { BaseGear, GearType } from '../types/gear';

const gearService = new GearService();

const CATEGORY_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Guitars', value: GearType.Guitar },
  { label: 'Basses', value: GearType.Bass },
  { label: 'Amplifiers', value: GearType.Amplifier },
  { label: 'Pedals', value: GearType.Pedal },
  { label: 'Microphones', value: GearType.Microphone },
  { label: 'Interfaces', value: GearType.Interface },
  { label: 'Other', value: GearType.Other },
];

export const Home = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  
  const [gear, setGear] = useState<BaseGear[]>([]);
  const [filteredGear, setFilteredGear] = useState<BaseGear[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGear = async () => {
      if (!user) return;
      
      try {
        const userGear = await gearService.getUserGear(user.uid);
        setGear(userGear);
        setFilteredGear(userGear);
      } catch (error) {
        console.error('Error loading gear:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadGear();
    }
  }, [user]);

  useEffect(() => {
    if (!gear.length) return;

    let filtered = [...gear];

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.type === selectedCategory);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.brand.toLowerCase().includes(query) ||
        item.model.toLowerCase().includes(query) ||
        (item.category?.toLowerCase() || '').includes(query) ||
        (item.subcategory?.toLowerCase() || '').includes(query)
      );
    }

    setFilteredGear(filtered);
  }, [gear, searchQuery, selectedCategory]);

  const handleAddGear = () => {
    navigate('/add-gear');
  };

  const handleEditGear = (gear: BaseGear) => {
    navigate(`/gear/${gear.id}/edit`);
  };

  const handleDeleteGear = async (gear: BaseGear) => {
    if (!user) return;
    
    try {
      await gearService.deleteGear(user.uid, gear.id);
      setGear(prev => prev.filter(item => item.id !== gear.id));
    } catch (error) {
      console.error('Error deleting gear:', error);
    }
  };

  if (loading || isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Gear Garage
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddGear}
        >
          Add New Gear
        </Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search your gear..."
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {CATEGORY_FILTERS.map((filter) => (
            <Chip
              key={filter.value}
              label={filter.label}
              onClick={() => setSelectedCategory(filter.value)}
              color={selectedCategory === filter.value ? 'primary' : 'default'}
              variant={selectedCategory === filter.value ? 'filled' : 'outlined'}
            />
          ))}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {filteredGear.map((item) => (
          <Grid item key={item.id} xs={12} sm={6} md={4}>
            <GearCard
              gear={item}
              onEdit={handleEditGear}
              onDelete={handleDeleteGear}
            />
          </Grid>
        ))}
      </Grid>

      {filteredGear.length === 0 && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '200px',
          flexDirection: 'column',
          gap: 2
        }}>
          <Typography variant="h6" color="text.secondary">
            No gear found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {gear.length === 0 
              ? "Start by adding some gear to your garage!"
              : "Try adjusting your search or filters"}
          </Typography>
          {gear.length === 0 && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddGear}
            >
              Add Your First Gear
            </Button>
          )}
        </Box>
      )}
    </Container>
  );
}; 