import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Silicon Radio',
    short_name: 'Radio',
    description: 'Internet Radio Player',
    start_url: '/',
    display: 'standalone',
    background_color: '#111827',
    theme_color: '#111827',
    orientation: 'any',
    icons: [
      {
        src: 'windows11/SmallTile.scale-100.png',
        sizes: '71x71',
        type: 'image/png',
      },
      {
        src: 'windows11/SmallTile.scale-125.png',
        sizes: '89x89',
        type: 'image/png',
      },
      {
        src: 'windows11/SmallTile.scale-150.png',
        sizes: '107x107',
        type: 'image/png',
      },
      {
        src: 'windows11/SmallTile.scale-200.png',
        sizes: '142x142',
        type: 'image/png',
      },
      {
        src: 'windows11/SmallTile.scale-400.png',
        sizes: '284x284',
        type: 'image/png',
      },
      {
        src: 'windows11/Square150x150Logo.scale-100.png',
        sizes: '150x150',
        type: 'image/png',
      },
      {
        src: 'windows11/Square150x150Logo.scale-125.png',
        sizes: '188x188',
        type: 'image/png',
      },
      {
        src: 'windows11/Square150x150Logo.scale-150.png',
        sizes: '225x225',
        type: 'image/png',
      },
      {
        src: 'windows11/Square150x150Logo.scale-200.png',
        sizes: '300x300',
        type: 'image/png',
      },
      {
        src: 'windows11/Square150x150Logo.scale-400.png',
        sizes: '600x600',
        type: 'image/png',
      },
      {
        src: 'android/android-launchericon-512-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: 'android/android-launchericon-192-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'ios/180.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: 'ios/1024.png',
        sizes: '1024x1024',
        type: 'image/png',
      },
    ],
  };
}
