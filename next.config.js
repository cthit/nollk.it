/** @type {import('next').NextConfig} */

// We transpile some modules for CSS issue reasons
const withTM = require("next-transpile-modules")([
  "@fullcalendar/common",
  "@fullcalendar/react",
  "@fullcalendar/timegrid",
  "@fullcalendar/daygrid",
]);

const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/nolldeklaration',
        destination: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        permanent: false,
      },
    ]
  },
}

module.exports = withTM({
  ...nextConfig
})
