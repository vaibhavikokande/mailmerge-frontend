export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      keyframes: {
        highlightRow: {
          '0%':   { backgroundColor: 'rgba(37, 99, 235, 0.15)' },
          '100%': { backgroundColor: 'transparent' },
        },
        pulseGreen: {
          '0%, 100%': { opacity: '1' },
          '50%':       { opacity: '0.25' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'highlight-row': 'highlightRow 2.5s ease-out forwards',
        'pulse-green':   'pulseGreen 1.5s ease-in-out infinite',
        'fade-in':       'fadeIn 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
