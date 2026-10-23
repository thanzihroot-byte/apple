import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Every product/category image ships inside /public/images (taken from the
    // original Stitch export), so the default local loader is all we need.
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [64, 96, 128, 200, 256, 384],
  },
};

export default nextConfig;
