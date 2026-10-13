/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#d2cefd', // Official logo accent
          400: '#b4a7f5',
          500: '#9184d9', // Official logo primary
          600: '#836fe8', // Button primary vibrant purple
          700: '#725ee4', // Button hover
          800: '#5e4bc7',
          900: '#43387f',
          950: '#161826'  // Official logo dark
        },
        obsidian: {
          950: '#0b0d14',
          900: '#10121b',
          850: '#161826', // Logo card tone
          800: '#1c1f30',
          750: '#24283d',
          700: '#2d324d'
        }
      },
      borderRadius: {
        none: '0',
        sm: '3px',
        DEFAULT: '5px',
        md: '5px',
        lg: '5px',
        xl: '5px',
        '2xl': '5px',
        '3xl': '5px',
        full: '9999px'
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
