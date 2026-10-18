import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sohan Pipeline's & Plumbing",
    short_name: "Sohan Pipeline's",
    description:
      'Total Plumbing Solutions in Midnapore, Dantan, and surrounding areas. Reliable pipe fitting, leak detection, bathroom fixtures, and emergency plumbing.',
    start_url: '/',
    display: 'standalone',
    background_color: '#090d16',
    theme_color: '#0284c7',
    icons: [
      {
        src: '/icon-32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  };
}
