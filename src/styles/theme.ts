export const theme = {
  colors: {
    // Primary Colors
    primary: {
      gold: '#FFC72C',
      darkGold: '#D4A017',
      steel: '#3C4A57',
      gunmetal: '#2A2E35',
      skyBlue: '#6B9AC4',
    },
    // Text Colors
    text: {
      primary: '#2A2E35',    // Gunmetal for primary text
      secondary: '#3C4A57',  // Steel for secondary text
      inverse: '#FFFFFF',    // White for dark backgrounds
      accent: '#3C4A57',     // Steel for accented text (was gold, changed for contrast)
      link: '#3C4A57',       // Steel for links (was gold, changed for contrast)
    },
    // UI Colors
    ui: {
      background: '#FFFFFF',
      backgroundAlt: '#F8F9FA',
      border: '#E2E8F0',
      hover: '#F1F5F9',
    },
    // State Colors
    state: {
      error: '#D72638',
      success: '#28A745',
      warning: '#FFC72C',
      info: '#6B9AC4',
    },
    // Button Variants
    button: {
      primary: {
        background: '#FFC72C',
        hover: '#D4A017',
        text: '#000000',
      },
      secondary: {
        background: '#3C4A57',
        hover: '#2A2E35',
        text: '#FFFFFF',
      },
      tertiary: {
        background: 'transparent',
        hover: '#F1F5F9',
        text: '#3C4A57',
      },
    },
  },
  // You can add more theme properties here like:
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
} as const;

// Type for theme colors
export type ThemeColors = typeof theme.colors;

// Utility function to get color values
export const getColor = (path: string) => {
  return path.split('.').reduce((obj, key) => obj[key], theme.colors);
};

// Export commonly used color combinations
export const colorPatterns = {
  // Text on light backgrounds
  textOnLight: {
    primary: theme.colors.text.primary,
    secondary: theme.colors.text.secondary,
    accent: theme.colors.text.accent,
  },
  // Text on dark backgrounds
  textOnDark: {
    primary: theme.colors.text.inverse,
    secondary: '#E2E8F0',
    accent: theme.colors.primary.gold,
  },
  // Interactive elements
  interactive: {
    default: theme.colors.primary.steel,
    hover: theme.colors.primary.gunmetal,
    active: theme.colors.primary.skyBlue,
  },
}; 