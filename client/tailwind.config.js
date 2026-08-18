/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
        brand: ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        shigo: {
          shell: 'hsl(var(--shigo-shell))',
          raised: 'hsl(var(--shigo-raised))',
          signal: {
            DEFAULT: 'hsl(var(--shigo-signal))',
            foreground: 'hsl(var(--shigo-signal-foreground))',
          },
          warning: {
            DEFAULT: 'hsl(var(--shigo-warning))',
            foreground: 'hsl(var(--shigo-warning-foreground))',
          },
          presence: {
            online: 'hsl(var(--shigo-presence-online))',
            away: 'hsl(var(--shigo-presence-away))',
            offline: 'hsl(var(--shigo-presence-offline))',
          },
          ambient: 'hsl(var(--shigo-ambient))',
          'own-message': 'hsl(var(--shigo-own-message))',
          'other-message': 'hsl(var(--shigo-other-message))',
        },
        glass: 'rgba(255, 255, 255, 0.15)',
        darkglass: 'rgba(0, 0, 0, 0.35)',
      },
      borderColor: {
        DEFAULT: 'hsl(var(--border))',
      },
      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionDuration: {
        fast: 'var(--motion-fast)',
        base: 'var(--motion-base)',
        slow: 'var(--motion-slow)',
        panel: 'var(--motion-panel)',
        expressive: 'var(--motion-expressive)',
      },
      transitionTimingFunction: {
        shigo: 'var(--ease-standard)',
        'shigo-emphasized': 'var(--ease-emphasized)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'button-infinity': 'spinner-move 2s linear infinite, spinner-dash 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'spinner-move': {
          from: { strokeDashoffset: '100' },
          to: { strokeDashoffset: '0' },
        },
        'spinner-dash': {
          '0%, 100%': { strokeDasharray: '15 85' },
          '50%': { strokeDasharray: '50 50' },
        },
      },
      boxShadow: {
        panel: 'var(--shadow-panel)',
        floating: 'var(--shadow-floating)',
        dialog: 'var(--shadow-dialog)',
        focus: 'var(--shadow-focus)',
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
    },
  },
  corePlugins: {
    transform: true,
    translate: true,
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
  ],
};
