import type { Metadata } from 'next';
import { PageLayout } from '@/components/page-layout';
import { PageHeader } from '@/components/page-header';
import { TestimonialsSection } from '@/components/sections/testimonials-section';

export const metadata: Metadata = {
  title: 'Customer Reviews & 5.0 Star Ratings',
  description:
    "Verified homeowner and business testimonials for Sohan Pipeline's & Plumbing across Midnapore and South Bengal. 5.0 rating from 21+ genuine reviews.",
  alternates: {
    canonical: '/reviews',
  },
  openGraph: {
    title: "Verified Customer Reviews · Sohan Pipeline's",
    description:
      '5.0 out of 5 stars based on 21+ customer experiences across Midnapore, Dantan, and South Bengal.',
    url: 'https://sohan-pipelines.netlify.app/reviews',
  },
};

export default function ReviewsPage() {
  return (
    <PageLayout>
      <PageHeader
        badge="Customer Reviews"
        title="What Our Customers Say"
        description="Real reviews from real customers across Midnapore and nearby areas. We are proud of our 5.0 rating from 21+ satisfied customers."
      />
      <TestimonialsSection />
    </PageLayout>
  );
}
