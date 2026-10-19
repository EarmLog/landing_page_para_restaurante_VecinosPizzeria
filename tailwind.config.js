/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'vecinos-naranja': '#EA580C',
        'vecinos-rojo': '#991B1B',
        'vecinos-crema': '#FFFBEB',
        'vecinos-texto': '#1F2937',
        'vecinos-texto-claro': '#6B7280',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'vecinos': '0 10px 25px -5px rgba(234, 88, 12, 0.25), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
