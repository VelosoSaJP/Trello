/** @type {import('tailwindcss').Config} */
module.exports = {
  // Aqui dizemos ao Tailwind para olhar nosso HTML e todos os arquivos TSX/JSX em 'src'
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}