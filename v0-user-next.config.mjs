/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,
  experimental: {
    // This will allow Next.js to fall back to Babel if SWC fails
    forceSwcTransforms: false
  }
};

export default nextConfig;

