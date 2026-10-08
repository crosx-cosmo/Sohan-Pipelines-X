import type { Metadata } from 'next';
import { PageLayout } from '@/components/page-layout';
import { PageHeader } from '@/components/page-header';
import { ServicesSection } from '@/components/sections/services-section';

export const metadata: Metadata = {
  title: 'Plumbing Services & Engineering Solutions',
  description:
    'Complete plumbing services in Midnapore and South Bengal — pipe fitting, high-pressure drainage cleaning, sanitary bathroom fitting, water tank setup, and concealed leak detection.',
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: "Plumbing Services & Solutions · Sohan Pipeline's",
    description:
      'Explore residential and commercial plumbing solutions. Transparent labor rates, verified materials, and fast dispatch across Midnapore and Dantan.',
    url: 'https://sohan-pipelines.netlify.app/services',
  },
};

export default function ServicesPage() {
  return (
    <PageLayout>
      <PageHeader
        badge="Our Services"
        title="Complete Plumbing Services for Every Need"
        description="Whether it is a leaky tap or a full bathroom installation, our experienced team delivers quality workmanship on every job. Browse our services and book online."
      />
      <ServicesSection />
    </PageLayout>
  );
}
