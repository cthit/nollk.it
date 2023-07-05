/** @type {import('next').NextConfig} */

// We transpile some modules for CSS issue reasons
const withTM = require("next-transpile-modules")([
  "@fullcalendar/common",
  "@fullcalendar/react",
  "@fullcalendar/timegrid",
  "@fullcalendar/daygrid",
  "next-fonts",
]);

const nextConfig = {
  reactStrictMode: true,
  webpack(config, options) {
    return config;
  }
}

module.exports = withTM({
  ...nextConfig
})
