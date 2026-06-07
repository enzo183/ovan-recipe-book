import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Catalogue burgers',
    short_name: 'Burgers',
    description: 'Burgers du menu classique et recettes du moment',
    start_url: '/',
    display: 'standalone', // C'est CA qui force le mode application
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
