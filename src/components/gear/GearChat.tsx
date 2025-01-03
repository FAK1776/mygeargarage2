import { useState } from 'react';
import { Box, TextField, Button, Paper, Typography, CircularProgress, IconButton } from '@mui/material';
import { MessageCircle, X } from 'lucide-react';
import { OpenAIService } from '../../services/openaiService';
import { GearService } from '../../services/gearService';
import { BaseGear, GearType } from '../../types/gear';
import { auth } from '../../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { theme } from '../../styles/theme';

const openAiService = new OpenAIService(import.meta.env.VITE_OPENAI_API_KEY || '');
const gearService = new GearService();

export const GearChat = () => {
  const [isOpen, setIsOpen] = useState(false);
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
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <>
      {/* Chat toggle button */}
      <IconButton
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          backgroundColor: theme.colors.primary.steel,
          color: theme.colors.text.inverse,
          width: '48px',
          height: '48px',
          '&:hover': {
            backgroundColor: theme.colors.primary.gunmetal,
          },
        }}
      >
        <MessageCircle />
      </IconButton>

      {/* Chat window */}
      {isOpen && (
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            bottom: '64px',
            right: 0,
            width: '350px',
            maxHeight: '500px',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'white',
          }}
        >
          {/* Chat header */}
          <Box sx={{ 
            p: 2, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: `1px solid ${theme.colors.ui.border}`,
          }}>
            <Typography variant="h6">Gear Assistant</Typography>
            <IconButton size="small" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </IconButton>
          </Box>

          {/* Chat content */}
          <Box sx={{ p: 2, flexGrow: 1, overflowY: 'auto' }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Paste product specifications or description, and I'll help you organize the information.
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                placeholder="Paste gear specifications or description here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                size="small"
              />
              
              {error && (
                <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                  {error}
                </Typography>
              )}

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || !input.trim()}
                  size="small"
                  sx={{
                    backgroundColor: theme.colors.primary.steel,
                    '&:hover': {
                      backgroundColor: theme.colors.primary.gunmetal,
                    },
                  }}
                >
                  {loading ? <CircularProgress size={20} /> : 'Process'}
                </Button>
              </Box>
            </form>

            {parsedGear && (
              <Paper variant="outlined" sx={{ mt: 2, p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Processed Gear Data
                </Typography>
                <pre style={{ 
                  whiteSpace: 'pre-wrap', 
                  wordBreak: 'break-word',
                  fontSize: '12px',
                  margin: 0 
                }}>
                  {JSON.stringify(parsedGear, null, 2)}
                </pre>
              </Paper>
            )}
          </Box>
        </Paper>
      )}
    </>
  );
}; 