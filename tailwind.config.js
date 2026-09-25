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
      /*
        Micro-type scale (V5.6). Before this existed the site had 274 hardcoded
        `text-[Npx]` classes across 14 arbitrary steps (5px → 17px) and only 28
        responsive ones, so the type rendered at identical sizes on a phone and a
        27" monitor: 43% of text below 10px at 390px, 42% at 1440px. One class
        (`text-[5.5px] sm:text-[6px]`) even rendered *smaller* on mobile.

        Each token clamps between a mobile floor and the desktop value Khurram
        tuned. **The vw coefficient is negative on purpose** — unlike a normal
        fluid heading scale these get *smaller* as the viewport grows, because a
        6px label is texture on a large monitor and unreadable on a handset. The
        interpolation runs between 480px and 1024px, so tablets land in between
        rather than snapping.

        Font-size only, no lineHeight: Tailwind's arbitrary `text-[Npx]` sets
        font-size alone and inherits the unitless 1.5 from preflight, which
        already scales with the font. Pinning a lineHeight here would change line
        boxes everywhere and shift layout for no benefit.

        Rule: no new `text-[Npx]`. Add a token or use one. See docs/design-system.md.
      */
      fontSize: {
        micro: 'clamp(8px, 9.88px - 0.184vw, 9px)',      // was 5–7.5px  → 9 mobile / 8 desktop
        label: 'clamp(8px, 11.77px - 0.368vw, 10px)',    // was 8px      → 10 mobile / 8 desktop
        tag: 'clamp(9px, 10.88px - 0.184vw, 10px)',      // was 9px      → 10 mobile / 9 desktop
        meta: 'clamp(10px, 11.88px - 0.184vw, 11px)',    // was 10px     → 11 mobile / 10 desktop
        'meta-lg': 'clamp(11px, 12.88px - 0.184vw, 12px)', // was 11px   → 12 mobile / 11 desktop
        copy: 'clamp(12px, 13.88px - 0.184vw, 13px)',    // was 12–13px  → 13 mobile / 12 desktop
      },
    },
  },
  plugins: [],
}
