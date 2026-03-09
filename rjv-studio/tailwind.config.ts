import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        rjv: {
          black: '#080808',
          void: '#0D0D0D',
          panel: '#111111',
          card: '#161616',
          border: '#1E1E1E',
          muted: '#2A2A2A',
          gold: '#C9A84C',
          'gold-light': '#E8C97A',
          'gold-dim': '#8A6E2E',
          red: '#C0392B',
          'red-bright': '#E74C3C',
          text: '#F0EDE8',
          'text-muted': '#888888',
          'text-dim': '#444444',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)',
        'void-gradient': 'linear-gradient(180deg, #080808 0%, #0D0D0D 100%)',
        'panel-gradient': 'linear-gradient(135deg, #111111 0%, #161616 100%)',
        'glass': 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
      },
      boxShadow: {
        'gold': '0 0 30px rgba(201,168,76,0.15), 0 4px 16px rgba(201,168,76,0.08)',
        'gold-intense': '0 0 60px rgba(201,168,76,0.25), 0 8px 32px rgba(201,168,76,0.15)',
        'card': '0 1px 0 rgba(255,255,255,0.04) inset, 0 -1px 0 rgba(0,0,0,0.4) inset',
        'panel': '0 8px 32px rgba(0,0,0,0.5)',
      },
      animation: {
        'pulse-gold': 'pulseGold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
      },
      keyframes: {
        pulseGold: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      borderRadius: {
        'bento': '16px',
        'pill': '100px',
      },
    },
  },
  plugins: [],
};

export default config;
