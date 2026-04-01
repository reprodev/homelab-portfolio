/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        azure: {
          light: '#93c5fd',
          DEFAULT: '#60a5fa',
          dark: '#2563eb',
        },
        amberGold: {
          light: '#fde68a',
          DEFAULT: '#fbbf24',
          dark: '#d97706',
        },
        slateCustom: {
          900: '#0a0a0a',
          800: '#18181b',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 20s infinite alternate ease-in-out',
        'scroll': 'scroll var(--duration, 40s) linear infinite',
      },
      keyframes: {
        float: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '100%': { transform: 'translate(50px, 50px) scale(1.1)' },
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
