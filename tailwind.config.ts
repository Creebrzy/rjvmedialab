import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: '#C9A84C',
        'gold-light': '#E8C97A',
        void: '#080808',
        'void-2': '#111111',
        'void-3': '#1A1A1A',
        'void-4': '#242424',
        'text-dim': '#888888',
        'text-muted': '#555555',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
