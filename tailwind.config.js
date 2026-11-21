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
        background: '#171A21',
        surface: {
          DEFAULT: '#1B2838',
          card: '#1B2838',
          hover: '#2A475E',
          active: '#315678',
          subtle: '#171D25',
        },
        border: {
          DEFAULT: '#2A475E',
          subtle: '#1E3245',
          bright: '#417A9B',
        },
        brand: {
          steam: '#66C0F4',
          blue: '#66C0F4',
          cyan: '#66C0F4',
          navy: '#1B2838',
          steel: '#2A475E',
          yellow: '#FFD600',
          gold: '#C7D5E0',
          'gold-light': '#E1E9F0',
          orange: '#FF7A1A',
          ice: '#66C0F4',
          'ice-light': '#A0D8F8',
          violet: '#9875D8',
          green: '#5C7E10',
          'green-bright': '#A4D007',
        },
        muted: {
          DEFAULT: '#8F98A0',
          dark: '#5B6876',
          light: '#C7D5E0',
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
