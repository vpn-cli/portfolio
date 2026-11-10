/** @type {import('next').NextConfig} */
const nextConfig = {
  skipTrailingSlashRedirect: true,
  distDir: process.env.NEXT_DIST_DIR || ".next",
  transpilePackages: ['three', 'gsap'],
  reactStrictMode: false, // Prevents double ticker initialization in development for GSAP / Lenis
  devIndicators: false,
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920],
    qualities: [75, 85],
  },
  async headers() {
    return [
      {
        source: '/resume.pdf',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex',
          },
        ],
      },
    ];
  },
  async rewrites() {
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';
    const isEu = posthogHost.includes('eu.i.posthog.com') || posthogHost.includes('eu.posthog.com');
    const assetHost = isEu ? 'https://eu-assets.i.posthog.com' : 'https://us-assets.i.posthog.com';
    const apiHost = isEu ? 'https://eu.i.posthog.com' : 'https://us.i.posthog.com';

    return [
      {
        source: '/ingest/static/:path*',
        destination: `${assetHost}/static/:path*`,
      },
      {
        source: '/ingest/array/:path*',
        destination: `${assetHost}/array/:path*`,
      },
      {
        source: '/ingest/:path*',
        destination: `${apiHost}/:path*`,
      },
      {
        source: '/ingest/decide',
        destination: `${apiHost}/decide`,
      },
    ];
  },
};

export default nextConfig;
