import type { Metadata } from 'next';
import { PageLayout } from '@/components/page-layout';
import { PageHeader } from '@/components/page-header';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { businessInfo } from '@/lib/business-info';
import { SITE_LOGO_URL } from '@/lib/site-logo';

export const metadata: Metadata = {
  title: 'Customer Reviews & 5.0 Star Ratings',
  description:
    "Verified homeowner and business testimonials for Sohan Pipeline's & Plumbing across Midnapore and South Bengal. 5.0 rating from 21+ genuine reviews.",
  keywords: [
    'plumber reviews Midnapore',
    'plumber ratings Dantan',
    'trusted plumber West Bengal',
    'best pipe fitter reviews',
    '5 star plumber South Bengal',
  ],
  alternates: {
    canonical: '/reviews',
  },
  openGraph: {
    title: "Verified Customer Reviews · Sohan Pipeline's",
    description:
      '5.0 out of 5 stars based on 21+ customer experiences across Midnapore, Dantan, and South Bengal.',
    url: 'https://sohan-pipelines.netlify.app/reviews',
    type: 'website',
    images: [
      {
        url: SITE_LOGO_URL,
        width: 1200,
        height: 630,
        alt: "Customer Reviews for Sohan Pipeline's & Plumbing",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Customer Reviews & 5.0 Star Ratings · Sohan Pipeline',
    description:
      'Read 21+ genuine testimonials for plumbing services across Midnapore and South Bengal.',
    images: [SITE_LOGO_URL],
  },
};

export default function ReviewsPage() {
  const reviewsSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: businessInfo.name,
    image: SITE_LOGO_URL,
    telephone: businessInfo.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: businessInfo.address,
      addressLocality: 'Midnapore',
      addressRegion: 'West Bengal',
      addressCountry: 'IN',
    },
  };

  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsSchema) }}
      />
      <PageHeader
        badge="Customer Reviews"
        title="Customer Reviews & Ratings"
        description="Authentic service ratings and feedback from homeowners and commercial facilities across Midnapore and South Bengal, verified through our service system."
        breadcrumbPath="/reviews"
      />
      <TestimonialsSection />
    </PageLayout>
  );
}
