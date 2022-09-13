/** @type {import('next').NextConfig} */

// We transpile some modules for CSS issue reasons
const withTM = require("next-transpile-modules")([
  "@fullcalendar/common",
  "@fullcalendar/react",
  "@fullcalendar/timegrid",
  "@fullcalendar/daygrid",
]);

const withFonts = require('next-fonts');

module.exports = withFonts({
   webpack(config, options) {
     return config;
   }
}); 

const nextConfig = {
  reactStrictMode: true,
  webpack(config, options) {
    return config;
  },
  async redirects() {
    return [
      {
        source: '/nolldeklaration',
        destination: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        permanent: false,
      },
      {
        source: '/1337',
        destination: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        permanent: true,
      },
    ]
  },
}

module.exports = withTM({
  ...nextConfig
})
