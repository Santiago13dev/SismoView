/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  // Si usas <Image> con archivos locales y quieres evitar optimización de Next:
  // images: { unoptimized: true },
};

export default nextConfig;
