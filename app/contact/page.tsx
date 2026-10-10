import type { Metadata } from 'next';
import { PageLayout } from '@/components/page-layout';
import { PageHeader } from '@/components/page-header';
import { ContactSection } from '@/components/sections/contact-section';
import { businessInfo } from '@/lib/business-info';
import { SITE_LOGO_URL } from '@/lib/site-logo';

export const metadata: Metadata = {
  title: 'Contact Engineering Dispatch & Support',
  description:
    "Direct contact lines for Sohan Pipeline's & Plumbing in Keshrambha, Dantan, Midnapore. 24/7 emergency dispatch hotline: +91 86701 43003.",
  keywords: [
    'contact plumber Midnapore',
    'plumber phone number Dantan',
    'plumbing emergency call West Bengal',
    'plumber near me Keshrambha',
    'book plumber phone',
  ],
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: "Contact Sohan Pipeline's & Plumbing",
    description:
      'Direct dispatch phone line, address in Keshrambha, and online consultation form. Fast response across South Bengal.',
    url: 'https://sohan-pipelines.netlify.app/contact',
    type: 'website',
    images: [
      {
        url: SITE_LOGO_URL,
        width: 1200,
        height: 630,
        alt: "Contact Sohan Pipeline's & Plumbing",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Engineering Dispatch & Support',
    description:
      'Direct contact lines for Sohan Pipeline in Dantan, Midnapore. Emergency hotline: +91 86701 43003.',
    images: [SITE_LOGO_URL],
  },
};

export default function ContactPage() {
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    mainEntity: {
      '@type': 'Plumber',
      name: businessInfo.name,
      telephone: businessInfo.phone,
      email: businessInfo.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: businessInfo.address,
        addressLocality: 'Dantan',
        addressRegion: 'West Bengal',
        postalCode: '721426',
        addressCountry: 'IN',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: businessInfo.phone,
        contactType: 'emergency dispatch',
        availableLanguage: ['English', 'Bengali', 'Hindi'],
      },
    },
  };

  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <PageHeader
        badge="Get in Touch"
        title="Need a Plumber? Contact Us."
        description="Whether it is an emergency or a planned service, we are here to help. Reach out through any of the channels below."
        breadcrumbPath="/contact"
      />
      <ContactSection />
    </PageLayout>
  );
}
