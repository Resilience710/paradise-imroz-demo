import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bone: '#f1eadc',
        cream: '#faf5ea',
        ink: '#1a1d1a',
        aegean: '#2a4751',
        'aegean-deep': '#1d343c',
        terracotta: '#b65b3c',
        muted: '#7d756b',
        line: '#d8cfbd',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'serif'],
        body: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateX(-50%) translateY(0)' },
          '50%': { transform: 'translateX(-50%) translateY(8px)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 1s forwards',
      },
    },
  },
  plugins: [],
};

export default config;
