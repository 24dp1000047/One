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
        background: '#040608',
        surface: {
          DEFAULT: '#0A0D14',
          card: '#080A10',
          hover: '#121622',
          active: '#181E2E',
          subtle: '#06080D',
        },
        border: {
          DEFAULT: '#181C26',
          subtle: '#11151E',
          bright: '#262D3D',
        },
        brand: {
          yellow: '#FFD600',
          gold: '#E5A866',
          'gold-light': '#F3C999',
          orange: '#FF7A1A',
          ice: '#A5C4F2',
          'ice-light': '#DCE7FA',
          violet: '#9875D8',
        },
        muted: {
          DEFAULT: '#8A94A6',
          dark: '#586274',
          light: '#B2BCCD',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-pill': '0 0 30px -4px rgba(165, 196, 242, 0.45)',
        'glow-gold': '0 0 25px -4px rgba(229, 168, 102, 0.4)',
        'glow-yellow-sm': '0 0 12px 0px rgba(255, 214, 0, 0.25)',
        'inner-glow': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.08)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'equalizer': 'equalizer 0.8s ease-in-out infinite alternate',
      },
      keyframes: {
        equalizer: {
          '0%': { height: '30%' },
          '100%': { height: '100%' },
        }
      }
    },
  },
  plugins: [],
}
