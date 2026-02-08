import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // Enable dark mode via class (add 'dark' class to html/body)
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand colors using CSS variables for centralized theming
        // Change values in globals.css :root to update everywhere
        brand: {
          primary: 'rgb(var(--color-brand-primary) / <alpha-value>)',
          'primary-dark': 'rgb(var(--color-brand-primary-dark) / <alpha-value>)',
          'primary-light': 'rgb(var(--color-brand-primary-light) / <alpha-value>)',
          accent: 'rgb(var(--color-brand-accent) / <alpha-value>)',
          'accent-dark': 'rgb(var(--color-brand-accent-dark) / <alpha-value>)',
          'accent-light': 'rgb(var(--color-brand-accent-light) / <alpha-value>)',
          secondary: 'rgb(var(--color-brand-secondary) / <alpha-value>)',
        },
        semantic: {
          success: 'rgb(var(--color-success) / <alpha-value>)',
          'success-light': 'rgb(var(--color-success-light) / <alpha-value>)',
          warning: 'rgb(var(--color-warning) / <alpha-value>)',
          'warning-light': 'rgb(var(--color-warning-light) / <alpha-value>)',
          error: 'rgb(var(--color-error) / <alpha-value>)',
          'error-light': 'rgb(var(--color-error-light) / <alpha-value>)',
          info: 'rgb(var(--color-info) / <alpha-value>)',
          'info-light': 'rgb(var(--color-info-light) / <alpha-value>)',
        },
        // Theme-aware colors (will switch with dark mode)
        theme: {
          bg: {
            primary: 'rgb(var(--color-bg-primary) / <alpha-value>)',
            secondary: 'rgb(var(--color-bg-secondary) / <alpha-value>)',
            tertiary: 'rgb(var(--color-bg-tertiary) / <alpha-value>)',
          },
          surface: {
            DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)',
            elevated: 'rgb(var(--color-surface-elevated) / <alpha-value>)',
          },
          text: {
            primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
            secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
            tertiary: 'rgb(var(--color-text-tertiary) / <alpha-value>)',
            inverted: 'rgb(var(--color-text-inverted) / <alpha-value>)',
          },
          border: {
            primary: 'rgb(var(--color-border-primary) / <alpha-value>)',
            secondary: 'rgb(var(--color-border-secondary) / <alpha-value>)',
          },
        },
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
        },
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        shimmer: 'shimmer 1.5s infinite linear',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};

export default config;
