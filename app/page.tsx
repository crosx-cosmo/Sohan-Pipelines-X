import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { HeroSection } from '@/components/sections/hero-section';
import { HomeServicesPreview } from '@/components/sections/home-services-preview';
import { HomeAboutPreview } from '@/components/sections/home-about-preview';
import { HomeReviewsPreview } from '@/components/sections/home-reviews-preview';
import { HomeAreasPreview } from '@/components/sections/home-areas-preview';
import { CtaSection } from '@/components/sections/cta-section';
import { SITE_LOGO_URL } from '@/lib/site-logo';

export const metadata: Metadata = {
  title: "Sohan Pipeline's & Plumbing — Total Plumbing Solutions",
  description:
    'Total Plumbing Solutions in Midnapore, Dantan, and surrounding areas. Reliable pipe fitting, leak detection, bathroom fixtures, and emergency plumbing.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Sohan Pipeline's & Plumbing — Total Plumbing Solutions",
    description:
      'Total Plumbing Solutions in Midnapore, Dantan, and surrounding areas. Reliable pipe fitting, leak detection, bathroom fixtures, and emergency plumbing.',
    url: 'https://sohan-pipelines.netlify.app',
    type: 'website',
    images: [
      {
        url: SITE_LOGO_URL,
        width: 1200,
        height: 630,
        alt: "Sohan Pipeline's & Plumbing — Total Plumbing Solutions",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Sohan Pipeline's & Plumbing — Total Plumbing Solutions",
    description:
      'Total Plumbing Solutions in Midnapore, Dantan, and surrounding areas. Reliable pipe fitting, leak detection, bathroom fixtures, and emergency plumbing.',
    images: [SITE_LOGO_URL],
  },
};

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <HomeServicesPreview />
        <HomeAboutPreview />
        <HomeReviewsPreview />
        <HomeAreasPreview />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
