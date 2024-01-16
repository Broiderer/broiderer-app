/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    config.externals = [...config.externals, 'canvas']
    return config
  },
}
