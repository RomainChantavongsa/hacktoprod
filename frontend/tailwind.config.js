/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3D9BA6',
          50: '#E8F5F7',
          100: '#D1EBEE',
          200: '#A3D7DD',
          300: '#75C3CB',
          400: '#52B5C2',
          500: '#3D9BA6',
          600: '#317C85',
          700: '#255D64',
          800: '#193E42',
          900: '#0D1F21',
        },
        secondary: {
          DEFAULT: '#003D52',
          50: '#CCE5ED',
          100: '#99CBDB',
          200: '#66B1C9',
          300: '#3397B7',
          400: '#006B8F',
          500: '#003D52',
          600: '#003142',
          700: '#002531',
          800: '#001921',
          900: '#000C10',
        },
        accent: {
          DEFAULT: '#52B5C2',
          light: '#75C3CB',
          dark: '#3D9BA6',
        },
        success: '#28A745',
        warning: '#FFC107',
        error: '#DC3545',
        info: '#17A2B8',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      boxShadow: {
        'sm': '0 2px 4px rgba(0, 78, 137, 0.1)',
        'md': '0 4px 8px rgba(0, 78, 137, 0.15)',
        'lg': '0 8px 16px rgba(0, 78, 137, 0.2)',
        'xl': '0 12px 24px rgba(0, 78, 137, 0.25)',
      },
      transitionDuration: {
        'fast': '200ms',
        'normal': '300ms',
        'slow': '500ms',
      },
    },
  },
  plugins: [],
}
