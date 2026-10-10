import type { Metadata } from 'next';
import { PageLayout } from '@/components/page-layout';
import { PageHeader } from '@/components/page-header';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { businessInfo, testimonials } from '@/lib/business-info';
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
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: businessInfo.rating.toString(),
      bestRating: '5',
      worstRating: '1',
      ratingCount: businessInfo.reviewCount.toString(),
      reviewCount: businessInfo.reviewCount.toString(),
    },
    review: testimonials.map((t) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: t.name,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: t.rating.toString(),
        bestRating: '5',
      },
      reviewBody: t.text,
    })),
  };

  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsSchema) }}
      />
      <PageHeader
        badge="Customer Reviews"
        title="What Our Customers Say"
        description="Real reviews from real customers across Midnapore and nearby areas. We are proud of our 5.0 rating from 21+ satisfied customers."
        breadcrumbPath="/reviews"
      />
      <TestimonialsSection />
    </PageLayout>
  );
}
