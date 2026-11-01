/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three', 'gsap'],
  reactStrictMode: false, // Prevents double ticker initialization in development for GSAP / Lenis
  devIndicators: false,
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
};

export default nextConfig;

