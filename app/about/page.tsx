import type { Metadata } from 'next';
import { PageLayout } from '@/components/page-layout';
import { PageHeader } from '@/components/page-header';
import { AboutSection } from '@/components/sections/about-section';

export const metadata: Metadata = {
  title: "About Our Plumbing Engineering Standard · Established 2015",
  description:
    "Learn about Sohan Pipeline's & Plumbing — established in 2015 in Dantan, Midnapore. Over a decade of master pipe fitting, certified plumbing materials, and trusted service.",
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: "About Sohan Pipeline's & Plumbing · South Bengal",
    description:
      'Master plumbing craftsmanship, upfront honest estimates, and verified technicians across Midnapore since 2015.',
    url: 'https://sohan-pipelines.netlify.app/about',
  },
};

export default function AboutPage() {
  return (
    <PageLayout>
      <PageHeader
        badge="About Us"
        title="Years of Trusted Plumbing in Midnapore"
        description="From small household repairs to large commercial installations, we bring the same level of dedication and quality to every project."
      />
      <AboutSection />
    </PageLayout>
  );
}
