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
    },
    fontFamily: {
      'theme': ['YearTheme', 'Georama', 'Lato'],
      'lato': ['Lato']
    },
  },
  plugins: [],
}
