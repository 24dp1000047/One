/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#090909',
        surface: {
          DEFAULT: '#151515',
          card: '#121212',
          hover: '#1c1c1c',
          active: '#242424',
          subtle: '#0e0e0e',
        },
        border: {
          DEFAULT: '#292929',
          subtle: '#1f1f1f',
          bright: '#3b3b3b',
        },
        brand: {
          yellow: '#FFD600',
          'yellow-light': '#FFE24D',
          'yellow-glow': 'rgba(255, 214, 0, 0.25)',
          orange: '#FF7A1A',
          'orange-light': '#FF9647',
          'orange-glow': 'rgba(255, 122, 26, 0.25)',
        },
        muted: {
          DEFAULT: '#999999',
          dark: '#666666',
          light: '#b3b3b3',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-yellow': '0 0 25px -3px rgba(255, 214, 0, 0.35)',
        'glow-yellow-sm': '0 0 12px 0px rgba(255, 214, 0, 0.25)',
        'glow-orange': '0 0 25px -3px rgba(255, 122, 26, 0.35)',
        'glow-orange-sm': '0 0 12px 0px rgba(255, 122, 26, 0.25)',
        'inner-glow': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.08)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'orbit-spin': 'spin 18s linear infinite',
        'glow-pulse': 'glowPulse 2.5s ease-in-out infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
}
