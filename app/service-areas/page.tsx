import type { Metadata } from 'next';
import { PageLayout } from '@/components/page-layout';
import { PageHeader } from '@/components/page-header';
import { ServiceAreasSection } from '@/components/sections/service-areas-section';

export const metadata: Metadata = {
  title: 'Service Areas across Paschim & Purba Medinipur',
  description:
    'Dedicated plumbing engineering coverage in Midnapore, Dantan, Keshrambha, Kharagpur, Jhargram, Ghatal, Chandrakona, Contai, Tamluk, and Egra across South Bengal.',
  alternates: {
    canonical: '/service-areas',
  },
  openGraph: {
    title: "Regional Plumbing Coverage · Sohan Pipeline's",
    description:
      'Explore active dispatch zones across Paschim Medinipur and Purba Medinipur. Local emergency plumbing visits on call.',
    url: 'https://sohan-pipelines.netlify.app/service-areas',
  },
};

export default function ServiceAreasPage() {
  return (
    <PageLayout>
      <PageHeader
        badge="Service Areas"
        title="Areas We Serve"
        description="Based in Keshrambha, Dantan — we cover Midnapore and surrounding regions across Paschim Medinipur and Purba Medinipur districts."
      />
      <ServiceAreasSection />
    </PageLayout>
  );
}
