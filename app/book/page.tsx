import type { Metadata } from 'next';
import { PageLayout } from '@/components/page-layout';
import { PageHeader } from '@/components/page-header';
import { BookingSection } from '@/components/sections/booking-section';

export const metadata: Metadata = {
  title: 'Book a Service Online · Fast Technician Dispatch',
  description:
    'Schedule your plumbing service online across Midnapore, Dantan, and South Bengal. Choose service type, urgency level, and preferred slot. Instant booking confirmation.',
  alternates: {
    canonical: '/book',
  },
  openGraph: {
    title: "Book a Plumbing Service Online · Sohan Pipeline's",
    description:
      'Schedule a certified plumber online. Instant confirmation, clear estimates, and verified technicians across Midnapore.',
    url: 'https://sohan-pipelines.netlify.app/book',
  },
};

export default function BookPage() {
  return (
    <PageLayout>
      <PageHeader
        badge="Book a Service"
        title="Schedule Your Plumbing Service"
        description="Choose a service, tell us the details, and pick a time. We will confirm your booking by phone."
      />
      <BookingSection />
    </PageLayout>
  );
}
