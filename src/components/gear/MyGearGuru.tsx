import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, Button, Paper, Typography, IconButton, CircularProgress } from '@mui/material';
import { MessageCircle, X, Send } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { GearGuruService } from '../../services/gearGuruService';
import { theme } from '../../styles/theme';

interface Message {
  text: string;
  isUser: boolean;
}

const gearGuruService = new GearGuruService();

export const MyGearGuru: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi! I'm your Gear Guru. Ask me anything about your gear collection!", isUser: false }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom when messages change or when loading changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setLoading(true);

    try {
      const response = await gearGuruService.chat(user.uid, userMessage);
      setMessages(prev => [...prev, { text: response, isUser: false }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false 
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

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
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
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
            height: '500px',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'white',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          {/* Chat header */}
          <Box sx={{ 
            p: 2, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: `1px solid ${theme.colors.ui.border}`,
            backgroundColor: theme.colors.primary.steel,
            color: theme.colors.text.inverse,
          }}>
            <Typography variant="h6">My Gear Guru</Typography>
            <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: 'inherit' }}>
              <X size={20} />
            </IconButton>
          </Box>

          {/* Messages container */}
          <Box sx={{ 
            flexGrow: 1, 
            overflowY: 'auto', 
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}>
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  alignSelf: message.isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  backgroundColor: message.isUser ? theme.colors.primary.steel : theme.colors.ui.backgroundAlt,
                  color: message.isUser ? theme.colors.text.inverse : theme.colors.text.primary,
                  p: 2,
                  borderRadius: '12px',
                  borderTopRightRadius: message.isUser ? '4px' : '12px',
                  borderTopLeftRadius: message.isUser ? '12px' : '4px',
                }}
              >
                <Typography variant="body2">{message.text}</Typography>
              </Box>
            ))}
            {loading && (
              <Box sx={{ alignSelf: 'flex-start', p: 2 }}>
                <CircularProgress size={20} />
              </Box>
            )}
            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input form */}
          <Box sx={{ p: 2, borderTop: `1px solid ${theme.colors.ui.border}` }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Ask about your gear..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: theme.colors.ui.backgroundAlt,
                  }
                }}
              />
              <IconButton 
                type="submit"
                disabled={loading || !input.trim()}
                sx={{
                  backgroundColor: theme.colors.primary.steel,
                  color: theme.colors.text.inverse,
                  '&:hover': {
                    backgroundColor: theme.colors.primary.gunmetal,
                  },
                  '&:disabled': {
                    backgroundColor: theme.colors.ui.border,
                  }
                }}
              >
                <Send size={20} />
              </IconButton>
            </form>
          </Box>
        </Paper>
      )}
    </>
  );
}; 