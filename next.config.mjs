/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'raazmkfsrbtvnwcmhgws.supabase.co' },
    ],
  },
  // Dev: webpack chunk cache'ini devre dışı bırak. Bu yapılmazsa
  // çok dosya değişiminde tarayıcı cache'lenmiş eski chunk'a vurur
  // ve "Cannot find module './XXX.js'" runtime hatası alırsın.
  // Production'da bu hiç etkilenmez (Next.js dev != next start).
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
  // Tarayıcı statik asset'leri agresif cache'lemesin (dev'de)
  async headers() {
    if (process.env.NODE_ENV !== 'development') return [];
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0, must-revalidate' },
        ],
      },
    ];
  },
};

export default nextConfig;
