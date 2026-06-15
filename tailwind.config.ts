import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0d1117',
          surface: '#161b22',
          surface2: '#1c2128',
          border: '#30363d',
          text: '#f0f6fc',
          muted: '#8b949e',
          accent: '#3fb950',
          keyword: '#ff7b72',
          string: '#a5d6ff',
          type: '#ffa657',
        },
        light: {
          bg: '#ffffff',
          surface: '#f6f8fa',
          surface2: '#eaeef2',
          border: '#d0d7de',
          text: '#0d1117',
          muted: '#636c76',
          accent: '#0969da',
          keyword: '#cf222e',
          string: '#0550ae',
          type: '#953800',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'Consolas', 'monospace'],
      },
      animation: {
        'flip-in': 'flipIn 0.3s ease-out',
        'flip-out': 'flipOut 0.3s ease-in',
        'slide-in': 'slideIn 0.2s ease-out',
      },
      keyframes: {
        flipIn: {
          from: { transform: 'rotateY(90deg)', opacity: '0' },
          to: { transform: 'rotateY(0deg)', opacity: '1' },
        },
        flipOut: {
          from: { transform: 'rotateY(0deg)', opacity: '1' },
          to: { transform: 'rotateY(-90deg)', opacity: '0' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
