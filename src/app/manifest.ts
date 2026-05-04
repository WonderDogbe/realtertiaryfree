import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TertiaryFree',
    short_name: 'TertiaryFree',
    description: 'Simplify university life.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    orientation: 'portrait',
    icons: [
      {
        src: '/pwalogo-removebg-preview.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
