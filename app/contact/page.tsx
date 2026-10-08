import type { Metadata } from 'next';
import { PageLayout } from '@/components/page-layout';
import { PageHeader } from '@/components/page-header';
import { ContactSection } from '@/components/sections/contact-section';

export const metadata: Metadata = {
  title: 'Contact Engineering Dispatch & Support',
  description:
    "Direct contact lines for Sohan Pipeline's & Plumbing in Keshrambha, Dantan, Midnapore. 24/7 emergency dispatch hotline: +91 86701 43003.",
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: "Contact Sohan Pipeline's & Plumbing",
    description:
      'Direct dispatch phone line, address in Keshrambha, and online consultation form. Fast response across South Bengal.',
    url: 'https://sohan-pipelines.netlify.app/contact',
  },
};

export default function ContactPage() {
  return (
    <PageLayout>
      <PageHeader
        badge="Get in Touch"
        title="Need a Plumber? Contact Us."
        description="Whether it is an emergency or a planned service, we are here to help. Reach out through any of the channels below."
      />
      <ContactSection />
    </PageLayout>
  );
}
