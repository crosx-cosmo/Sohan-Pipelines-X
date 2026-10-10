import type { Metadata } from 'next';
import { PageLayout } from '@/components/page-layout';
import { PageHeader } from '@/components/page-header';
import { FaqSection } from '@/components/sections/faq-section';
import { faqs } from '@/lib/business-info';
import { SITE_LOGO_URL } from '@/lib/site-logo';

export const metadata: Metadata = {
  title: 'Plumbing FAQs & Customer Guide',
  description:
    'Frequently asked questions about plumbing pricing, emergency response times, service areas, booking policies, and warranty on plumbing work in Midnapore.',
  keywords: [
    'plumber questions Midnapore',
    'plumbing pricing FAQ',
    'emergency plumber cost West Bengal',
    'plumber warranty questions',
    'plumbing service coverage FAQ',
  ],
  alternates: {
    canonical: '/faq',
  },
  openGraph: {
    title: "Frequently Asked Questions · Sohan Pipeline's",
    description:
      'Answers to common queries regarding pipe fitting, inspection fees, service coverage, and emergency visits.',
    url: 'https://sohan-pipelines.netlify.app/faq',
    type: 'website',
    images: [
      {
        url: SITE_LOGO_URL,
        width: 1200,
        height: 630,
        alt: "Frequently Asked Questions - Sohan Pipeline's",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Plumbing FAQs & Customer Guide · Sohan Pipeline',
    description:
      'Quick answers to plumbing costs, emergency response times, and service warranties.',
    images: [SITE_LOGO_URL],
  },
};

export default function FaqPage() {
  const faqPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />
      <PageHeader
        badge="FAQ"
        title="Frequently Asked Questions"
        description="Got questions? We have answers. Here are some common things our customers ask."
        breadcrumbPath="/faq"
      />
      <FaqSection />
    </PageLayout>
  );
}
