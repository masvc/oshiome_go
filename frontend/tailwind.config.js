/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'oshi-pink': {
          50: '#FFF0F7',
          100: '#FFE3F1',
          200: '#FFB8DC',
          300: '#FF8CC7',
          400: '#FF60B2',
          500: '#FF339D',
          600: '#FF007D',
          700: '#CC0064',
          800: '#99004B',
          900: '#660032',
        },
        'oshi-purple': {
          50: '#F3F0FF',
          100: '#E9E3FF',
          200: '#D3C7FF',
          300: '#BDABFF',
          400: '#A78FFF',
          500: '#9173FF',
          600: '#7B57FF',
          700: '#653BFF',
          800: '#4F1FFF',
          900: '#3903FF',
        },
        'oshi-indigo': '#4f46e5',
      },
      backgroundImage: {
        'gradient-oshi': 'linear-gradient(135deg, #fff6f9 0%, #ffe6f6 100%)',
        'grid-oshi-purple':
          'linear-gradient(to right, #6b46c1 1px, transparent 1px), linear-gradient(to bottom, #6b46c1 1px, transparent 1px)',
        'grid-white':
          'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
      },
      fontFamily: {
        display: ['Noto Sans JP', 'sans-serif'],
        body: ['M PLUS Rounded 1c', 'sans-serif'],
        sans: ['system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
      },
    },
  },
  plugins: [],
};
