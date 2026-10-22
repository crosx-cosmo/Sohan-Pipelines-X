import type { Metadata } from 'next';
import { PageLayout } from '@/components/page-layout';
import { PageHeader } from '@/components/page-header';
import { SparePartsSection } from '@/components/sections/spare-parts-section';
import { fetchLiveSpareParts } from '@/lib/supabase-data';
import { getSparePartImageUrl } from '@/lib/spare-parts-mapping';
import { SITE_LOGO_URL } from '@/lib/site-logo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Plumbing Spare Parts & Genuine Hardware — Sohan Pipeline's",
  description:
    'Authorized plumbing parts counter in Midnapore & Dantan. Genuine Astral, Supreme, Finolex, and Jaquar CPVC/UPVC pipes, brass valves, taps, sanitaryware, and tank fittings with direct WhatsApp enquiry.',
  keywords: [
    'plumbing spare parts Midnapore',
    'plumbing parts shop Dantan',
    'CPVC pipes supplier Kharagpur',
    'plumbing hardware store Paschim Medinipur',
    'Astral pipes distributor West Bengal',
    'Supreme fittings Dantan',
    'brass ball valve supplier',
    'sanitaryware parts counter',
  ],
  alternates: {
    canonical: '/spare-parts',
  },
  openGraph: {
    title: "Plumbing Spare Parts & Genuine Hardware · Sohan Pipeline's",
    description:
      'Authorized plumbing parts counter and warehouse supply across Paschim & Purba Medinipur. Genuine CPVC pipes, brass valves, taps, and sanitaryware with direct WhatsApp inquiries.',
    url: 'https://sohan-pipelines.netlify.app/spare-parts',
    type: 'website',
    images: [
      {
        url: SITE_LOGO_URL,
        width: 1200,
        height: 630,
        alt: "Sohan Pipeline's Spare Parts & Hardware Counter",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Plumbing Spare Parts & Genuine Hardware · Sohan Pipeline's",
    description:
      'Authorized plumbing parts counter in Midnapore & Dantan. Genuine Astral, Supreme, Finolex, and Jaquar fittings with verified prices.',
    images: [SITE_LOGO_URL],
  },
};

export default async function SparePartsPage() {
  const { data: liveParts } = await fetchLiveSpareParts({ forceRefresh: true });

  const partsListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: "Sohan Pipeline's Plumbing Spare Parts & Hardware Catalogue",
    description:
      'Genuine plumbing spare parts, pipes, valves, and sanitaryware components in Midnapore region.',
    itemListElement: (liveParts || []).map((p, index) => {
      const imageUrl = getSparePartImageUrl(p);
      return {
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: p.name,
          image: imageUrl || undefined,
          sku: p.sku || undefined,
          category: p.category || 'Plumbing Hardware',
          offers: {
            '@type': 'Offer',
            priceCurrency: 'INR',
            price: p.selling_price || 0,
            availability:
              p.stock && p.stock > 0
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
          },
        },
      };
    }),
  };

  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(partsListSchema) }}
      />
      <PageHeader
        badge="Authorized Counter"
        title="Plumbing Spare Parts & Hardware Counter"
        description="Authorized retail and contractor supply for genuine CPVC/UPVC pipes, brass valves, diverters, and sanitary fittings."
        breadcrumbPath="/spare-parts"
      />
      <SparePartsSection initialParts={liveParts} />
    </PageLayout>
  );
}
