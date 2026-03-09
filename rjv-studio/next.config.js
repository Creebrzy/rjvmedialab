/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'rjvmedialab.com' },
      { hostname: 'supabase.co' },
    ],
    unoptimized: true,
  },
};

module.exports = nextConfig;
