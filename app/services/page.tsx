import type { Metadata } from 'next';
import { PageLayout } from '@/components/page-layout';
import { PageHeader } from '@/components/page-header';
import { ServicesSection } from '@/components/sections/services-section';
import { services } from '@/lib/services';
import { SITE_LOGO_URL } from '@/lib/site-logo';

export const metadata: Metadata = {
  title: 'Plumbing Services & Engineering Solutions',
  description:
    'Complete plumbing services in Midnapore and South Bengal — pipe fitting, high-pressure drainage cleaning, sanitary bathroom fitting, water tank setup, and concealed leak detection.',
  keywords: [
    'plumbing services Midnapore',
    'pipe fitting Dantan',
    'drainage cleaning West Bengal',
    'bathroom sanitary fitting',
    'water tank installation',
    'leak detection Midnapore',
    'kitchen plumbing Kharagpur',
    'commercial plumbing South Bengal',
  ],
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: "Plumbing Services & Solutions · Sohan Pipeline's",
    description:
      'Explore residential and commercial plumbing solutions. Transparent labor rates, verified materials, and fast dispatch across Midnapore and Dantan.',
    url: 'https://sohan-pipelines.netlify.app/services',
    type: 'website',
    images: [
      {
        url: SITE_LOGO_URL,
        width: 1200,
        height: 630,
        alt: "Sohan Pipeline's & Plumbing Services",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Plumbing Services & Engineering Solutions · Sohan Pipeline's",
    description:
      'Explore residential and commercial plumbing solutions in Midnapore and South Bengal.',
    images: [SITE_LOGO_URL],
  },
};

export default function ServicesPage() {
  const serviceListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Plumbing Services Catalogue',
    description: 'Professional residential and commercial plumbing services in Midnapore region.',
    itemListElement: services.map((s, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: s.name,
        description: s.description,
        provider: {
          '@type': 'Plumber',
          name: "Sohan Pipeline's & Plumbing",
          telephone: '+918670143003',
        },
        offers: {
          '@type': 'Offer',
          price: s.startingPrice.toString(),
          priceCurrency: 'INR',
        },
      },
    })),
  };

  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceListSchema) }}
      />
      <PageHeader
        badge="Our Services"
        title="Complete Plumbing Services for Every Need"
        description="Whether it is a leaky tap or a full bathroom installation, our experienced team delivers quality workmanship on every job. Browse our services and book online."
        breadcrumbPath="/services"
      />
      <ServicesSection />
    </PageLayout>
  );
}
