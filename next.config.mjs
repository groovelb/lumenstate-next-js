/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@mui/material', '@mui/icons-material', '@mui/lab'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.pexels.com' },
    ],
  },
};

export default nextConfig;
