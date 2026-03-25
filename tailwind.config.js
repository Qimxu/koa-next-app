/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'Geist', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Orbitron', 'monospace'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
      },
      colors: {
        // Cyberpunk Color System
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        muted: 'var(--muted)',
        border: 'var(--border)',

        // Brand Colors
        koa: {
          DEFAULT: 'var(--koa-black)',
          gray: 'var(--koa-gray)',
        },
        next: {
          DEFAULT: 'var(--next-blue)',
          cyan: 'var(--next-cyan)',
        },

        // Neon accents
        neon: {
          blue: 'var(--neon-blue)',
          cyan: 'var(--neon-cyan)',
        },

        // Primary scale (purple/indigo based)
        primary: {
          50: 'oklch(0.97 0.01 270)',
          100: 'oklch(0.94 0.02 270)',
          200: 'oklch(0.88 0.04 270)',
          300: 'oklch(0.78 0.08 270)',
          400: 'oklch(0.65 0.14 270)',
          500: 'oklch(0.52 0.20 270)',
          600: 'oklch(0.44 0.18 270)',
          700: 'oklch(0.36 0.15 270)',
          800: 'oklch(0.28 0.12 270)',
          900: 'oklch(0.22 0.08 270)',
          950: 'oklch(0.15 0.06 270)',
        },

        // Accent scale (cyan/blue based)
        accent: {
          DEFAULT: 'var(--accent)',
          50: 'oklch(0.96 0.05 220)',
          100: 'oklch(0.92 0.10 220)',
          200: 'oklch(0.85 0.15 220)',
          300: 'oklch(0.78 0.18 220)',
          400: 'oklch(0.72 0.18 220)',
          500: 'oklch(0.65 0.18 220)',
          600: 'oklch(0.58 0.16 220)',
          700: 'oklch(0.50 0.14 220)',
          800: 'oklch(0.42 0.12 220)',
          900: 'oklch(0.35 0.10 220)',
          950: 'oklch(0.25 0.08 220)',
        },

        // Cyber card colors
        card: {
          bg: 'rgba(255, 255, 255, 0.02)',
          border: 'rgba(255, 255, 255, 0.06)',
          hover: 'oklch(0.65 0.18 220 / 0.05)',
        },

        // Input colors
        input: {
          bg: 'rgba(0, 0, 0, 0.3)',
          border: 'rgba(255, 255, 255, 0.08)',
          focus: 'oklch(0.65 0.18 220 / 0.55)',
        },

        // Semantic colors
        error: {
          DEFAULT: 'var(--error)',
          light: 'var(--error-light)',
        },
        success: 'var(--success)',
        warning: 'var(--warning)',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, var(--koa-black) 0%, var(--next-blue) 100%)',
        'gradient-text': 'linear-gradient(135deg, #525252 0%, #737373 25%, var(--next-blue) 75%, var(--next-cyan) 100%)',
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'neon-sm': '0 0 10px oklch(0.65 0.18 220 / 0.3)',
        'neon': '0 0 20px oklch(0.65 0.18 220 / 0.3), 0 4px 16px rgba(0, 0, 0, 0.35)',
        'neon-lg': '0 0 32px oklch(0.65 0.18 220 / 0.5), 0 8px 24px rgba(0, 0, 0, 0.45)',
        'card': '0 0 30px oklch(0.65 0.18 220 / 0.1), 0 20px 40px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
        'spin-slow': 'spin-slow 20s linear infinite',
        'spin-reverse': 'spin-reverse 15s linear infinite',
      },
      keyframes: {
        'fade-in-up': {
          from: {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'pulse-glow': {
          '0%, 100%': {
            opacity: '1',
            boxShadow: '0 0 6px var(--next-blue)',
          },
          '50%': {
            opacity: '0.6',
            boxShadow: '0 0 18px var(--next-blue), 0 0 36px oklch(0.65 0.18 220 / 0.3)',
          },
        },
        'float': {
          '0%, 100%': {
            transform: 'translateY(0) translateX(0)',
            opacity: '0.3',
          },
          '50%': {
            transform: 'translateY(-20px) translateX(10px)',
            opacity: '0.6',
          },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'spin-reverse': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [],
};
