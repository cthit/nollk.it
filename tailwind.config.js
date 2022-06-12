module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        //Sets Lato as the default font
        'sans': ['Lato'],
      },
      backgroundImage: {
        'portrait': "url('/bilder/bakgrund/2022p.jpg')",
        'landscape': "url('/bilder/bakgrund/2022.jpg')",
      }
    },
    fontFamily: {
      'po': ['Passion One'],
      'lato': ['Lato']
    },
  },
  plugins: [],
}
