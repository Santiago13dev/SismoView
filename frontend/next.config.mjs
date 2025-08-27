// next.config.mjs
// Mantén el config mínimo, estricto y documentado.
// Tip: "images.unoptimized" evita warnings si usas <img> o texturas locales sin Image Optimization.

const nextConfig = {
  reactStrictMode: true, // Ayuda a detectar efectos/renders indebidos en dev
  experimental: {
    typedRoutes: true, // Ya lo usabas: asegura rutas tipadas en app router
  },
  images: {
    unoptimized: true, // No afecta a texturas en /public, pero evita optimización innecesaria
  },
};

export default nextConfig;
