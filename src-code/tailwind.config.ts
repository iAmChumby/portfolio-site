import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic color mappings for dark theme
        background: '#0a0a0a',
        foreground: '#ffffff',
        card: '#111111',
        'card-foreground': '#ffffff',
        popover: '#111111',
        'popover-foreground': '#ffffff',
        primary: '#10b981',
        'primary-foreground': '#000000',
        secondary: '#1a1a1a',
        'secondary-foreground': '#ffffff',
        muted: '#1a1a1a',
        'muted-foreground': '#9ca3af',
        accent: '#10b981',
        'accent-foreground': '#000000',
        destructive: '#ef4444',
        'destructive-foreground': '#ffffff',
        border: '#059669',
        input: '#1f2937',
        ring: '#10b981',
        // Custom colors
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#10b981',
        green: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
      },
      fontFamily: {
        primary: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        heading: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 600ms ease-out',
        'fade-out': 'fadeOut 200ms ease-out',
        'fade-in-up': 'fadeInUp 600ms ease-out',
        'fade-in-down': 'fadeInDown 200ms ease-out',
        'fade-in-left': 'fadeInLeft 200ms ease-out',
        'fade-in-right': 'fadeInRight 200ms ease-out',
        'scale-in': 'scaleIn 200ms ease-out',
        'scale-out': 'scaleOut 200ms ease-out',
        'slide-in-up': 'slideInUp 200ms ease-out',
        'slide-in-down': 'slideInDown 200ms ease-out',
        'slide-in-left': 'slideInLeft 200ms ease-out',
        'slide-in-right': 'slideInRight 200ms ease-out',
        'gradient': 'gradient 15s ease infinite',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0', transform: 'translateZ(0)' },
          'to': { opacity: '1', transform: 'translateZ(0)' },
        },
        fadeOut: {
          'from': { opacity: '1', transform: 'translateZ(0)' },
          'to': { opacity: '0', transform: 'translateZ(0)' },
        },
        fadeInUp: {
          'from': { opacity: '0', transform: 'translate3d(0, 2rem, 0)' },
          'to': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        fadeInDown: {
          'from': { opacity: '0', transform: 'translate3d(0, -2rem, 0)' },
          'to': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        fadeInLeft: {
          'from': { opacity: '0', transform: 'translate3d(-2rem, 0, 0)' },
          'to': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        fadeInRight: {
          'from': { opacity: '0', transform: 'translate3d(2rem, 0, 0)' },
          'to': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        scaleIn: {
          'from': { opacity: '0', transform: 'scale3d(0.8, 0.8, 1)' },
          'to': { opacity: '1', transform: 'scale3d(1, 1, 1)' },
        },
        scaleOut: {
          'from': { opacity: '1', transform: 'scale3d(1, 1, 1)' },
          'to': { opacity: '0', transform: 'scale3d(0.8, 0.8, 1)' },
        },
        slideInUp: {
          'from': { transform: 'translateY(100%)' },
          'to': { transform: 'translateY(0)' },
        },
        slideInDown: {
          'from': { transform: 'translateY(-100%)' },
          'to': { transform: 'translateY(0)' },
        },
        slideInLeft: {
          'from': { transform: 'translateX(-100%)' },
          'to': { transform: 'translateX(0)' },
        },
        slideInRight: {
          'from': { transform: 'translateX(100%)' },
          'to': { transform: 'translateX(0)' },
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [],
};

export default config;