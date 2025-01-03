import { theme } from '../../styles/theme';

export const componentStyles = {
  // Button styles
  button: {
    base: `
      font-medium
      transition-colors
      disabled:opacity-50
      rounded-md
    `,
    primary: {
      default: `
        bg-[${theme.colors.button.primary.background}]
        text-[${theme.colors.button.primary.text}]
        hover:bg-[${theme.colors.button.primary.hover}]
      `,
      outline: `
        border-2
        border-[${theme.colors.button.primary.background}]
        text-[${theme.colors.button.primary.background}]
        hover:bg-[${theme.colors.button.primary.background}]
        hover:text-[${theme.colors.button.primary.text}]
      `,
    },
    secondary: {
      default: `
        bg-[${theme.colors.button.secondary.background}]
        text-[${theme.colors.button.secondary.text}]
        hover:bg-[${theme.colors.button.secondary.hover}]
      `,
      outline: `
        border-2
        border-[${theme.colors.button.secondary.background}]
        text-[${theme.colors.button.secondary.background}]
        hover:bg-[${theme.colors.button.secondary.background}]
        hover:text-[${theme.colors.button.secondary.text}]
      `,
    },
  },

  // Input styles
  input: {
    base: `
      w-full
      rounded-md
      border
      transition-colors
      focus:outline-none
      focus:ring-2
    `,
    default: {
      border: `border-[${theme.colors.ui.border}]`,
      placeholder: `placeholder-[${theme.colors.text.secondary}]`,
      focus: `
        focus:border-[${theme.colors.primary.skyBlue}]
        focus:ring-[${theme.colors.primary.skyBlue}]
      `,
    },
  },

  // Navigation styles
  nav: {
    background: `bg-[${theme.colors.primary.steel}]`,
    text: {
      default: `text-[${theme.colors.text.inverse}]`,
      hover: `hover:text-[${theme.colors.primary.gold}]`,
    },
  },

  // Card styles
  card: {
    base: `
      bg-white
      rounded-lg
      shadow-md
      border
      border-[${theme.colors.ui.border}]
    `,
    hover: `
      hover:shadow-lg
      hover:border-[${theme.colors.primary.gold}]
    `,
  },

  // Form styles
  form: {
    label: `text-[${theme.colors.text.primary}] font-medium`,
    helperText: `text-[${theme.colors.text.secondary}] text-sm`,
    error: `text-[${theme.colors.state.error}] text-sm`,
  },

  // Loading spinner
  spinner: `
    animate-spin
    rounded-full
    border-2
    border-[${theme.colors.primary.gold}]
    border-t-transparent
  `,
}; 