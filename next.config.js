/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { hostname: 'lh3.googleusercontent.com' },
      { hostname: 'img.clerk.com' },
    ],
  },
};
module.exports = nextConfig;
