/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'lh3.googleusercontent.com'],
  },
  async redirects() {
    return [
      {
        source: '/tulu',
        destination: '/',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig

