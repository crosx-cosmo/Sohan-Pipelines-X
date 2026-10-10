import type { Metadata } from 'next';
import { PageLayout } from '@/components/page-layout';
import { PageHeader } from '@/components/page-header';
import { BookingSection } from '@/components/sections/booking-section';
import { businessInfo } from '@/lib/business-info';
import { SITE_LOGO_URL } from '@/lib/site-logo';

export const metadata: Metadata = {
  title: 'Book a Service Online · Fast Technician Dispatch',
  description:
    'Schedule your plumbing service online across Midnapore, Dantan, and South Bengal. Choose service type, urgency level, and preferred slot. Instant booking confirmation.',
  keywords: [
    'book plumber online',
    'plumber booking Midnapore',
    'schedule pipe repair',
    'emergency plumber booking',
    'Dantan plumber appointment',
  ],
  alternates: {
    canonical: '/book',
  },
  openGraph: {
    title: "Book a Plumbing Service Online · Sohan Pipeline's",
    description:
      'Schedule a certified plumber online. Instant confirmation, clear estimates, and verified technicians across Midnapore.',
    url: 'https://sohan-pipelines.netlify.app/book',
    type: 'website',
    images: [
      {
        url: SITE_LOGO_URL,
        width: 1200,
        height: 630,
        alt: "Book a Plumbing Service Online",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book a Plumbing Service Online · Fast Dispatch',
    description:
      'Instant online booking for leak repairs, bathroom fitting, and emergency plumbing in Midnapore.',
    images: [SITE_LOGO_URL],
  },
};

export default function BookPage() {
  const bookingSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Online Plumbing Service Booking',
    description: 'Book residential or commercial plumbing service across Midnapore region.',
    potentialAction: {
      '@type': 'ReserveAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://sohan-pipelines.netlify.app/book',
        inLanguage: 'en-IN',
        actionPlatform: [
          'http://schema.org/DesktopWebPlatform',
          'http://schema.org/MobileWebPlatform',
        ],
      },
      result: {
        '@type': 'Reservation',
        name: 'Plumbing Service Appointment',
      },
    },
    provider: {
      '@type': 'Plumber',
      name: businessInfo.name,
      telephone: businessInfo.phone,
    },
  };

  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookingSchema) }}
      />
      <PageHeader
        badge="Book a Service"
        title="Schedule Your Plumbing Service"
        description="Choose a service, tell us the details, and pick a time. We will confirm your booking by phone."
        breadcrumbPath="/book"
      />
      <BookingSection />
    </PageLayout>
  );
}
