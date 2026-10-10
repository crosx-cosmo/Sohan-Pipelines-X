import type { Metadata } from 'next';
import { PageLayout } from '@/components/page-layout';
import { PageHeader } from '@/components/page-header';
import { FindBookingSection } from '@/components/sections/find-booking-section';
import { SITE_LOGO_URL } from '@/lib/site-logo';

export const metadata: Metadata = {
  title: 'Track Service Status · Find My Booking',
  description:
    'Look up your plumbing service booking by Booking ID and verified phone number to inspect real-time dispatch status, technician assignment, and service timeline.',
  keywords: [
    'track plumbing booking',
    'plumber dispatch status',
    'plumbing booking status Midnapore',
    'find my booking Sohan Pipelines',
  ],
  alternates: {
    canonical: '/find-booking',
  },
  openGraph: {
    title: "Track Your Plumbing Booking · Sohan Pipeline's",
    description:
      'Check live status and technician schedule for your pending or active plumbing service.',
    url: 'https://sohan-pipelines.netlify.app/find-booking',
    type: 'website',
    images: [
      {
        url: SITE_LOGO_URL,
        width: 1200,
        height: 630,
        alt: "Track Plumbing Service Status",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Track Service Status · Find My Booking',
    description:
      'Look up your plumbing service booking by Booking ID and phone number.',
    images: [SITE_LOGO_URL],
  },
};

export default function FindBookingPage() {
  return (
    <PageLayout>
      <PageHeader
        badge="Find My Booking"
        title="Track Your Booking Status"
        description="Enter your Booking ID and the phone number you booked with to see live status updates."
        breadcrumbPath="/find-booking"
      />
      <FindBookingSection />
    </PageLayout>
  );
}
