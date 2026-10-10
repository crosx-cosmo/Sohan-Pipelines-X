import type { Metadata } from 'next';
import { PageLayout } from '@/components/page-layout';
import { PageHeader } from '@/components/page-header';
import { ServiceAreasSection } from '@/components/sections/service-areas-section';
import { businessInfo } from '@/lib/business-info';
import { SITE_LOGO_URL } from '@/lib/site-logo';

export const metadata: Metadata = {
  title: 'Service Areas across Paschim & Purba Medinipur',
  description:
    'Dedicated plumbing engineering coverage in Midnapore, Dantan, Keshrambha, Kharagpur, Jhargram, Ghatal, Chandrakona, Contai, Tamluk, and Egra across South Bengal.',
  keywords: [
    'plumber Dantan',
    'plumber Midnapore town',
    'plumber Kharagpur',
    'plumber Contai Kanthi',
    'plumber Tamluk',
    'plumber Egra',
    'plumber Jhargram',
    'plumber Ghatal',
    'plumber Chandrakona',
    'plumbing service Paschim Medinipur',
    'plumbing service Purba Medinipur',
    'Keshrambha pipe fitting',
  ],
  alternates: {
    canonical: '/service-areas',
  },
  openGraph: {
    title: "Regional Plumbing Coverage · Sohan Pipeline's",
    description:
      'Explore active dispatch zones across Paschim Medinipur and Purba Medinipur. Local emergency plumbing visits on call.',
    url: 'https://sohan-pipelines.netlify.app/service-areas',
    type: 'website',
    images: [
      {
        url: SITE_LOGO_URL,
        width: 1200,
        height: 630,
        alt: "Sohan Pipeline's Coverage Map in South Bengal",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Service Areas across Paschim & Purba Medinipur',
    description:
      'Emergency and scheduled plumbing coverage across Midnapore, Dantan, Kharagpur, Contai, and surrounding districts.',
    images: [SITE_LOGO_URL],
  },
};

export default function ServiceAreasPage() {
  const serviceAreasSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Regional Plumbing Service Dispatch',
    serviceType: 'Plumbing & Emergency Pipe Fitting',
    provider: {
      '@type': 'Plumber',
      name: businessInfo.name,
      telephone: businessInfo.phone,
    },
    areaServed: businessInfo.serviceAreas.map((area) => ({
      '@type': 'City',
      name: area,
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: 'West Bengal',
      },
    })),
  };

  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceAreasSchema) }}
      />
      <PageHeader
        badge="Service Areas"
        title="Areas We Serve"
        description="Based in Keshrambha, Dantan — we cover Midnapore and surrounding regions across Paschim Medinipur and Purba Medinipur districts."
        breadcrumbPath="/service-areas"
      />
      <ServiceAreasSection />
    </PageLayout>
  );
}
