/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Base surfaces
        bg: {
          base: '#080C14',
          surface: '#0F1420',
          elevated: '#161D2E',
          overlay: '#1C2438',
        },
        // Borders
        border: {
          subtle: '#1E2738',
          DEFAULT: '#243044',
          strong: '#2E3D56',
        },
        // Text
        text: {
          primary: '#EEF2F9',
          secondary: '#8A96AA',
          muted: '#4E5A6E',
          inverse: '#080C14',
        },
        // Accent — amber/gold (stage lighting)
        accent: {
          50:  '#FFF9EB',
          100: '#FEF0C5',
          200: '#FEDF89',
          300: '#FEC84B',
          400: '#FDB022',
          500: '#E8900A',  // primary
          600: '#CC6F0A',
          700: '#A84F0B',
          800: '#883E0C',
          900: '#6F330E',
          DEFAULT: '#E8900A',
        },
        // Status colors
        status: {
          awaiting_payment:      '#F5A623',
          awaiting_video:        '#3B82F6',
          pending:               '#8B5CF6',
          awaiting_confirmation: '#F59E0B',
          completed:             '#10B981',
          refunded:              '#EF4444',
          draft:                 '#6B7280',
          open:                  '#10B981',
          closed:                '#F59E0B',
          finished:              '#6B7280',
          paid:                  '#10B981',
        },
      },
      fontFamily: {
        display: ['Unbounded', 'sans-serif'],
        body:    ['Onest', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        md: '10px',
        lg: '14px',
        xl: '18px',
        '2xl': '24px',
      },
      boxShadow: {
        'glow-accent': '0 0 20px -4px rgba(232, 144, 10, 0.35)',
        'glow-sm': '0 0 12px -3px rgba(232, 144, 10, 0.2)',
        'card': '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(36,48,68,0.6)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px rgba(36,48,68,0.8)',
        'modal': '0 24px 64px rgba(0,0,0,0.7)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
        'surface-gradient': 'linear-gradient(135deg, #0F1420 0%, #0B0F1A 100%)',
      },
      animation: {
        'fade-in':     'fadeIn 0.2s ease-out',
        'slide-up':    'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down':  'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-slow':  'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer':     'shimmer 1.8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          from: { backgroundPosition: '-200% 0' },
          to: { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
