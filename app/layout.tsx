import './globals.css';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { MobileQuickBar } from '@/components/mobile-quick-bar';
import { SeoStructuredData } from '@/components/seo-structured-data';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sohan-pipelines.netlify.app'),
  title: {
    default: "Sohan Pipeline's & Plumbing — Total Plumbing Solutions",
    template: "%s · Sohan Pipeline's & Plumbing",
  },
  description:
    'Total Plumbing Solutions in Midnapore, Dantan, Kharagpur, and South Bengal. Master pipe fitting, concealed leak detection, sanitary bathroom fixtures, and emergency dispatch.',
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
  ],
  authors: [{ name: "Sohan Pipeline's Engineering Team" }],
  creator: "Sohan Pipeline's & Plumbing",
  publisher: "Sohan Pipeline's & Plumbing",
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
      'Professional plumbing engineering in Midnapore and South Bengal. Upfront pricing, master craftsmanship, and verified materials. Call +91 86701 43003.',
    url: 'https://sohan-pipelines.netlify.app',
    siteName: "Sohan Pipeline's & Plumbing",
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Sohan Pipeline's & Plumbing — Total Plumbing Solutions",
    description:
      'Certified pipe fitting, bathroom fixtures, and leak detection in Midnapore and South Bengal.',
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={jakarta.variable}>
      <head>
        <SeoStructuredData />
      </head>
      <body className="font-sans antialiased min-h-screen pb-14 md:pb-0 flex flex-col bg-background text-foreground">
        <ThemeProvider>
          {children}
          <MobileQuickBar />
        </ThemeProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
