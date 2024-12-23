import { useState } from 'react';
import { Box, TextField, Button, Paper, Typography, CircularProgress } from '@mui/material';
import { OpenAIService } from '../../services/openaiService';
import { GearService } from '../../services/gearService';
import { BaseGear, GearType } from '../../types/gear';
import { auth } from '../../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

const openAiService = new OpenAIService(import.meta.env.VITE_OPENAI_API_KEY || '');
const gearService = new GearService();

export const GearChat = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedGear, setParsedGear] = useState<Partial<BaseGear> | null>(null);
  const [user, authLoading] = useAuthState(auth);
  const navigate = useNavigate();

  // Redirect if not authenticated
  if (!authLoading && !user) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    setLoading(true);
    setError(null);
    setParsedGear(null);

    try {
      // First, let the AI suggest the gear type
      const suggestedType = await openAiService.suggestGearType(input);
      
      // Then parse the specifications
      const parsedData = await openAiService.parseGearSpecifications(input, suggestedType);
      
      console.log('OpenAI parsed data:', parsedData);
      
      // Add the user ID
      const gearData: Omit<BaseGear, 'id' | 'createdAt' | 'updatedAt'> = {
        userId: user.uid,
        name: parsedData.name || '',
        brand: parsedData.brand || '',
        model: parsedData.model || '',
        type: parsedData.type || GearType.Other,
        category: parsedData.category || '',
        subcategory: parsedData.subcategory || '',
        description: parsedData.description || '',
        imageUrl: '',
        specs: parsedData.specs || {}
      };

      console.log('Processed gear data:', gearData);

      // Save to Firestore
      await gearService.addGear(user.uid, gearData);
      
      setParsedGear(gearData);
      setInput('');
    } catch (err) {
      console.error('Detailed error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process gear data');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Add New Gear
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Paste product specifications or description, and I'll help you organize the information.
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            placeholder="Paste gear specifications or description here..."
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            disabled={loading}
          />
          
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !input.trim() || !user}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Processing...' : 'Process Gear Data'}
            </Button>
          </Box>
        </form>
      </Paper>

      {parsedGear && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Processed Gear Data
          </Typography>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {JSON.stringify(parsedGear, null, 2)}
          </pre>
        </Paper>
      )}
    </Box>
  );
}; 