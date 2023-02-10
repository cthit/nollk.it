module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      transitionProperty: {
        maxheight: 'max-height'
      },
      fontFamily: {
        //Sets Lato as the default font
        'sans': ['Lato'],
      },
      backgroundImage: {
        'portrait': "url('/bilder/2022/portrait.jpg')",
        'landscape': "url('/bilder/2022/landscape.jpg')",
      }
    },
    fontFamily: {
      'po': ['Passion One'],
      'lato': ['Lato']
    },
  },
  plugins: [],
}
