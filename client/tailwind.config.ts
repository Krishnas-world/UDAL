import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}', 
    './app/**/*.{js,ts,jsx,tsx,mdx}', 
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A8A', 
        secondary: '#065F46',
        accent: '#D97706', 
        background: '#F9FAFB', 
        card: '#FFFFFF', 
        textPrimary: '#1F2937', 
        textSecondary: '#4B5563', 
        borderLight: '#E5E7EB',
      },
      fontFamily: {
        inter: ['Montserrat', 'sans-serif'],
      },
      boxShadow: {
        'custom-light': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'custom-medium': '0 8px 20px rgba(0, 0, 0, 0.12)',
        '3xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      keyframes: {
        fadeInDown: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-50px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(50px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideIn: {
          '0%': {
            opacity: '0',
            transform: 'translateX(-30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        float1: {
          '0%, 100%': {
            transform: 'translateY(0px) rotate(0deg)',
          },
          '50%': {
            transform: 'translateY(-20px) rotate(180deg)',
          },
        },
        float2: {
          '0%, 100%': {
            transform: 'translateY(0px) rotate(0deg)',
          },
          '50%': {
            transform: 'translateY(-15px) rotate(-180deg)',
          },
        },
        float3: {
          '0%, 100%': {
            transform: 'translateY(0px) rotate(0deg)',
          },
          '50%': {
            transform: 'translateY(-25px) rotate(90deg)',
          },
        },
        pulseSlow: {
          '0%, 100%': {
            opacity: '0.3',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '0.1',
            transform: 'scale(1.05)',
          },
        },
      },
      animation: {
        'fade-in-down': 'fadeInDown 1s ease-out forwards',
        'fade-in-up': 'fadeInUp 1s ease-out 0.3s forwards',
        'fade-in-up-delay': 'fadeInUp 1s ease-out 0.6s forwards',
        'fade-in-up-delay-2': 'fadeInUp 1s ease-out 0.9s forwards',
        'slide-in': 'slideIn 0.8s ease-out 0.2s forwards',
        'float-1': 'float1 6s ease-in-out infinite',
        'float-2': 'float2 8s ease-in-out infinite 2s',
        'float-3': 'float3 10s ease-in-out infinite 4s',
        'pulse-slow': 'pulseSlow 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;