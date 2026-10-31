/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three'],
  reactStrictMode: false, // Prevents double ticker initialization in development for GSAP / Lenis
};

export default nextConfig;

