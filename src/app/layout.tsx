import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import GoogleAnalytics from '@/lib/ga';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

const outfit = Outfit({
  subsets: ['latin'],
});

export const metadata = {
  title: 'Silicon Radio: Stream Free Global Radio Stations Online',
  description: 'Tune into free online radio stations across every genre and country. Silicon Radio delivers live music, news, sports & talk with zero ads and zero cost.',
  icons: {
    icon: '/ios/32.png',
    apple: '/ios/180.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
        <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}
