/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three', 'gsap'],
  reactStrictMode: false, // Prevents double ticker initialization in development for GSAP / Lenis
};

export default nextConfig;

