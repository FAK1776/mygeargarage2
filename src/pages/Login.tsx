import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { theme } from '../styles/theme';
import { GuitarQuotes } from '../components/ui/GuitarQuotes';

export const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
      navigate('/');
    } catch (err) {
      console.error('Authentication error:', err);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      console.error('Google sign-in error:', err);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative"
      style={{
        backgroundImage: 'url("/images/AxeVault_loginbackground.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0" style={{ backgroundColor: `${theme.colors.primary.steel}CC` }} />
      
      <div className="relative z-10 max-w-md w-full">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-lg p-4">
              <img
                src="/images/AxeVault_logo2.png"
                alt="Axe Vault"
                className="h-[200px] w-[200px] object-contain"
              />
            </div>
          </div>

          <h2 
            className="text-center text-3xl font-extrabold mb-8"
            style={{ color: theme.colors.text.primary }}
          >
            {isSignUp ? 'Create your vault' : 'Sign in to your vault'}
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <Input
                  type="email"
                  required
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  style={{
                    borderColor: theme.colors.ui.border,
                    '::placeholder': { color: theme.colors.text.secondary },
                    ':focus': {
                      borderColor: theme.colors.primary.skyBlue,
                      boxShadow: `0 0 0 2px ${theme.colors.primary.skyBlue}33`,
                    },
                  }}
                />
              </div>
              <div>
                <Input
                  type="password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  style={{
                    borderColor: theme.colors.ui.border,
                    '::placeholder': { color: theme.colors.text.secondary },
                    ':focus': {
                      borderColor: theme.colors.primary.skyBlue,
                      boxShadow: `0 0 0 2px ${theme.colors.primary.skyBlue}33`,
                    },
                  }}
                />
              </div>
            </div>

            {error && (
              <div style={{ color: theme.colors.state.error }} className="text-sm text-center">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <Button 
                type="submit" 
                className="w-full font-semibold"
                style={{
                  backgroundColor: theme.colors.button.primary.background,
                  color: theme.colors.button.primary.text,
                  ':hover': {
                    backgroundColor: theme.colors.button.primary.hover,
                  },
                }}
              >
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </Button>

              <Button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full border-none"
                style={{
                  backgroundColor: theme.colors.button.secondary.background,
                  color: theme.colors.button.secondary.text,
                  ':hover': {
                    backgroundColor: theme.colors.button.secondary.hover,
                  },
                }}
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-5 h-5 mr-2"
                />
                Continue with Google
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm font-medium"
                  style={{
                    color: theme.colors.text.accent,
                    ':hover': {
                      color: theme.colors.primary.steel,
                    },
                  }}
                >
                  {isSignUp
                    ? 'Already have an account? Sign in'
                    : "Don't have an account? Sign up"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      <GuitarQuotes />
    </div>
  );
}; 