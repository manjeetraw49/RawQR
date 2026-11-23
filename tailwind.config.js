/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB', // Primary blue
          700: '#1D4ED8', // Primary hover
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        surface: {
          light: '#F9FAFB',
          border: '#E5E7EB',
          text: '#111827',
          muted: '#6B7280',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        hero: ['"Pixelify Sans"', 'sans-serif'],
        pixelify: ['"Pixelify Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
