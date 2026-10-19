/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  cacheComponents: true,
  partialPrefetching: true,
}
module.exports = nextConfig
