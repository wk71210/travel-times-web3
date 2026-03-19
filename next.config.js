/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    domains: [
      'crossmint.com',
      'www.crossmint.com',
      'placehold.co',
      'ipfs.io',
      'arweave.net',
    ],
  },
};

module.exports = nextConfig;
