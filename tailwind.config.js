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
        'portrait': "url('/bilder/2022/porträtt.jpg')",
        'landscape': "url('/bilder/2022/landskap.jpg')",
      }
    },
    fontFamily: {
      'theme': ['Lato'],
      //'theme': ['Passion One'],
      'lato': ['Lato']
    },
  },
  plugins: [],
}
