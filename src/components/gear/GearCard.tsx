import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  Chip,
  CardActions,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { BaseGear } from '../../types/gear';

interface GearCardProps {
  gear: BaseGear;
  onEdit?: (gear: BaseGear) => void;
  onDelete?: (gear: BaseGear) => void;
}

export const GearCard: React.FC<GearCardProps> = ({ gear, onEdit, onDelete }) => {
  const handleEdit = () => {
    if (onEdit) {
      onEdit(gear);
    }
  };

  const handleDelete = () => {
    if (onDelete && window.confirm('Are you sure you want to delete this gear?')) {
      onDelete(gear);
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={gear.imageUrl || '/placeholder-gear.jpg'}
        alt={gear.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2" noWrap>
          {gear.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {gear.brand} {gear.model}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          <Chip
            label={gear.type}
            size="small"
            color="primary"
            variant="outlined"
          />
          {gear.category && (
            <Chip
              label={gear.category}
              size="small"
              color="secondary"
              variant="outlined"
            />
          )}
        </Box>

        <Typography variant="body2" color="text.secondary">
          {gear.description?.slice(0, 100)}
          {gear.description && gear.description.length > 100 ? '...' : ''}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end' }}>
        {onEdit && (
          <Tooltip title="Edit">
            <IconButton size="small" onClick={handleEdit}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        )}
        {onDelete && (
          <Tooltip title="Delete">
            <IconButton size="small" onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </CardActions>
    </Card>
  );
}; 