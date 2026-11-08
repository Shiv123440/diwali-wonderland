/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        diwali: {
          midnight: '#05060f',
          deepNavy: '#0a0d24',
          sapphire: '#0f1738',
          royalRed: '#b81424',
          vermilion: '#e63946',
          marigold: '#f59e0b',
          saffron: '#ff7700',
          gold: {
            light: '#ffeaa7',
            DEFAULT: '#f3b43f',
            dark: '#c48208',
            antique: '#b8923a',
          },
          flame: '#ff5400',
          peacock: '#0077b6',
          emerald: '#10b981',
        }
      },
      fontFamily: {
        cinzel: ['"Cinzel Decorative"', 'Cinzel', 'serif'],
        cinzelText: ['"Cinzel"', 'serif'],
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'serif'],
        sans: ['"Outfit"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'diya-glow': '0 0 25px 5px rgba(245, 158, 11, 0.45)',
        'gold-glow': '0 0 30px rgba(243, 180, 63, 0.35)',
        'royal-box': '0 15px 40px -10px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(243, 180, 63, 0.25)',
      },
    },
  },
  plugins: [],
}
