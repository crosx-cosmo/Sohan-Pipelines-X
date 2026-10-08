import type { Metadata } from 'next';
import { PageLayout } from '@/components/page-layout';
import { PageHeader } from '@/components/page-header';
import { FaqSection } from '@/components/sections/faq-section';

export const metadata: Metadata = {
  title: 'Plumbing FAQs & Customer Guide',
  description:
    'Frequently asked questions about plumbing pricing, emergency response times, service areas, booking policies, and warranty on plumbing work in Midnapore.',
  alternates: {
    canonical: '/faq',
  },
  openGraph: {
    title: "Frequently Asked Questions · Sohan Pipeline's",
    description:
      'Answers to common queries regarding pipe fitting, inspection fees, service coverage, and emergency visits.',
    url: 'https://sohan-pipelines.netlify.app/faq',
  },
};

export default function FaqPage() {
  return (
    <PageLayout>
      <PageHeader
        badge="FAQ"
        title="Frequently Asked Questions"
        description="Got questions? We have answers. Here are some common things our customers ask."
      />
      <FaqSection />
    </PageLayout>
  );
}
