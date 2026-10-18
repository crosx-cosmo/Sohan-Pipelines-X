import './globals.css';
import { Suspense } from 'react';
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { MobileQuickBar } from '@/components/mobile-quick-bar';
import { SeoStructuredData } from '@/components/seo-structured-data';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { NavigationProgressBar } from '@/components/navigation-progress-bar';
import { CartProvider } from '@/lib/cart-context';
import { CartDrawer } from '@/components/cart-drawer';
import { SITE_LOGO_URL } from '@/lib/site-logo';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#090d16' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://sohan-pipelines.netlify.app'),
  title: {
    default: "Sohan Pipeline's & Plumbing — Total Plumbing Solutions",
    template: "%s · Sohan Pipeline's & Plumbing",
  },
  description:
    'Total Plumbing Solutions in Midnapore, Dantan, and surrounding areas. Reliable pipe fitting, leak detection, bathroom fixtures, and emergency plumbing.',
  keywords: [
    'plumber Midnapore',
    'plumber Dantan',
    'plumbing services Kharagpur',
    'pipe fitting West Bengal',
    'drainage cleaning Midnapore',
    'bathroom sanitary fitting',
    'water tank booster pump installation',
    'concealed leak detection',
    'emergency plumber South Bengal',
    'Sohan Pipelines',
    'plumber Keshrambha',
    'plumber Contai',
    'plumber Tamluk',
    'plumber Jhargram',
    'plumber Ghatal',
  ],
  authors: [{ name: "Sohan Pipeline's Engineering Team" }],
  creator: "Sohan Pipeline's & Plumbing",
  publisher: "Sohan Pipeline's & Plumbing",
  category: 'Home & Commercial Plumbing Services',
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Sohan Pipeline's & Plumbing — Total Plumbing Solutions",
    description:
      'Total Plumbing Solutions in Midnapore, Dantan, and surrounding areas. Reliable pipe fitting, leak detection, bathroom fixtures, and emergency plumbing.',
    url: 'https://sohan-pipelines.netlify.app',
    siteName: "Sohan Pipeline's & Plumbing",
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: SITE_LOGO_URL,
        width: 1200,
        height: 630,
        alt: "Sohan Pipeline's & Plumbing Logo & Brand Mark",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Sohan Pipeline's & Plumbing — Total Plumbing Solutions",
    description:
      'Certified pipe fitting, bathroom fixtures, and leak detection in Midnapore and South Bengal.',
    images: [SITE_LOGO_URL],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: "Sohan Pipeline's",
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={jakarta.variable}>
      <body className="font-sans antialiased min-h-screen pb-14 md:pb-0 flex flex-col bg-background text-foreground">
        <Suspense fallback={null}>
          <NavigationProgressBar />
        </Suspense>
        <SeoStructuredData />
        <ThemeProvider>
          <CartProvider>
            <SiteHeader />
            <div className="flex-1 flex flex-col w-full">
              {children}
            </div>
            <SiteFooter />
            <MobileQuickBar />
            <CartDrawer />
          </CartProvider>
        </ThemeProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
