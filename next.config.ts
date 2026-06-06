import type { NextConfig } from "next";

const nextConfig: NextConfig = {images: {
    unoptimized: true, // <-- C'est ici que tu désactives l'optimisation
  },};

export default nextConfig;
