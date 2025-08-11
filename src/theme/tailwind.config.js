/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./index.html", 
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#000000",    // negro
        secondary: "#A11312",  // rojo oscuro
        tertiary: "#FFE5CC",   // beige claro
      },
    },
  },
  plugins: [],
};
