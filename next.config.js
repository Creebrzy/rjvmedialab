/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { hostname: 'lh3.googleusercontent.com' },
      { hostname: 'drive.google.com' },
      { hostname: 'img.clerk.com' },
    ],
  },
};
module.exports = nextConfig;
