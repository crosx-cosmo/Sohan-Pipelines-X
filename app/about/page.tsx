import type { Metadata } from 'next';
import { PageLayout } from '@/components/page-layout';
import { PageHeader } from '@/components/page-header';
import { AboutSection } from '@/components/sections/about-section';
import { businessInfo } from '@/lib/business-info';
import { SITE_LOGO_URL } from '@/lib/site-logo';

export const metadata: Metadata = {
  title: "About Our Plumbing Engineering Standard · Established 2015",
  description:
    "Learn about Sohan Pipeline's & Plumbing — established in 2015 in Dantan, Midnapore. Over a decade of master pipe fitting, certified plumbing materials, and trusted service.",
  keywords: [
    'about Sohan Pipelines',
    'plumber Dantan history',
    'plumbing contractor Midnapore',
    'certified plumbers West Bengal',
    'experienced pipe fitters',
    'plumbing warranty South Bengal',
  ],
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: "About Sohan Pipeline's & Plumbing · South Bengal",
    description:
      'Master plumbing craftsmanship, upfront honest estimates, and verified technicians across Midnapore since 2015.',
    url: 'https://sohan-pipelines.netlify.app/about',
    type: 'website',
    images: [
      {
        url: SITE_LOGO_URL,
        width: 1200,
        height: 630,
        alt: "About Sohan Pipeline's & Plumbing",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "About Our Plumbing Engineering Standard · Sohan Pipeline's",
    description:
      'Over a decade of master plumbing craftsmanship and honest service in Midnapore.',
    images: [SITE_LOGO_URL],
  },
};

export default function AboutPage() {
  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    mainEntity: {
      '@type': 'Plumber',
      name: businessInfo.name,
      foundingDate: businessInfo.established.toString(),
      address: {
        '@type': 'PostalAddress',
        streetAddress: businessInfo.address,
        addressLocality: 'Dantan',
        addressRegion: 'West Bengal',
        postalCode: '721426',
        addressCountry: 'IN',
      },
      telephone: businessInfo.phone,
      description: businessInfo.description,
    },
  };

  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <PageHeader
        badge="About Us"
        title="Years of Trusted Plumbing in Midnapore"
        description="From small household repairs to large commercial installations, we bring the same level of dedication and quality to every project."
        breadcrumbPath="/about"
      />
      <AboutSection />
    </PageLayout>
  );
}
