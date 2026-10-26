import * as React from 'react';
import { businessInfo, faqs } from '@/lib/business-info';
import { fetchLiveServices, fetchLiveServiceAreas } from '@/lib/supabase-data';
import { SITE_LOGO_URL } from '@/lib/site-logo';

const CORE_COVERAGE_AREAS = [
  'Dantan',
  'Keshrambha',
  'Bahardaltitia',
  'Midnapore',
  'Kharagpur',
  'Belda',
  'Narayangarh',
  'Contai',
  'Tamluk',
  'Egra',
  'Jhargram',
  'Ghatal',
  'Paschim Medinipur',
  'Purba Medinipur',
];

export async function SeoStructuredData() {
  const baseUrl = process.env.APP_URL || 'https://sohan-pipelines.netlify.app';
  const [{ data: liveServices }, { data: liveAreas }] = await Promise.all([
    fetchLiveServices(),
    fetchLiveServiceAreas(),
  ]);

  const activeServices = Array.isArray(liveServices) ? liveServices : [];
  const activeAreas =
    Array.isArray(liveAreas) && liveAreas.length > 0
      ? liveAreas.map((a) => a.locality).filter(Boolean)
      : CORE_COVERAGE_AREAS;

  const minPrice =
    activeServices.length > 0
      ? Math.min(...activeServices.map((s) => Number(s.price) || 0).filter((p) => p > 0))
      : null;

  // 1. LocalBusiness / Plumber / Store Schema with Complete Coverage & OfferCatalog
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': ['Plumber', 'HomeAndConstructionBusiness', 'Store', 'LocalBusiness'],
    '@id': `${baseUrl}/#organization`,
    name: businessInfo.name,
    legalName: businessInfo.name,
    alternateName: [
      "Sohan Pipeline's",
      'Sohan Pipelines & Plumbing',
      'Sohan Plumbing Works Dantan',
      'Sohan Pipe Fitting Midnapore',
    ],
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: SITE_LOGO_URL,
      width: 512,
      height: 512,
    },
    image: [SITE_LOGO_URL],
    description: businessInfo.description,
    telephone: businessInfo.phone,
    email: businessInfo.email,
    foundingDate: businessInfo.established.toString(),
    priceRange:
      minPrice && Number.isFinite(minPrice)
        ? `₹₹ (Starting from ₹${minPrice})`
        : '₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, UPI, Google Pay, PhonePe, Paytm, Bank Transfer',
    address: {
      '@type': 'PostalAddress',
      streetAddress: businessInfo.address,
      addressLocality: 'Keshrambha, Dantan',
      addressRegion: 'West Bengal',
      postalCode: businessInfo.pincode,
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 21.9547,
      longitude: 87.2718,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ],
        opens: '10:00',
        closes: '15:00',
      },
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: businessInfo.phone,
        contactType: 'customer service',
        areaServed: 'IN-WB',
        availableLanguage: ['English', 'Bengali', 'Hindi'],
      },
      {
        '@type': 'ContactPoint',
        telephone: businessInfo.phone,
        contactType: 'emergency dispatch',
        areaServed: 'IN-WB',
        availableLanguage: ['English', 'Bengali', 'Hindi'],
      },
    ],
    areaServed: activeAreas.map((area) => ({
      '@type': 'City',
      name: area,
      containedInPlace: {
        '@type': 'State',
        name: 'West Bengal',
      },
    })),
    ...(activeServices.length > 0
      ? {
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Plumbing Engineering Services & Spare Parts Counter',
            itemListElement: activeServices.map((s) => ({
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: s.name,
                description:
                  s.description ||
                  `${s.name} — professional plumbing service by ${businessInfo.name}.`,
                provider: {
                  '@id': `${baseUrl}/#organization`,
                },
              },
              price: (s.price ?? 0).toString(),
              priceCurrency: 'INR',
            })),
          },
        }
      : {}),
    knowsAbout: [
      'Concealed Leak Detection',
      'Industrial & Domestic Pipe Fitting',
      'High-Pressure Drainage Jetting',
      'Sanitary Fixtures & Bathroom Renovation',
      'Overhead Water Tank Setup',
      'Booster Pump Manifold Piping',
      'Commercial Plumbing Maintenance',
      'Submersible Motor Piping',
      'UPVC CPVC & GI Genuine Spare Parts',
    ],
  };

  // 2. WebSite Schema with Site Navigation & SearchAction
  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: businessInfo.name,
    alternateName: "Sohan Pipeline's — Total Plumbing Solutions",
    description: businessInfo.description,
    inLanguage: 'en-IN',
    publisher: {
      '@id': `${baseUrl}/#organization`,
    },
    potentialAction: [
      {
        '@type': 'SearchAction',
        target: `${baseUrl}/find-booking?id={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
      {
        '@type': 'SearchAction',
        target: `${baseUrl}/spare-parts?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    ],
  };

  // 3. Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}/#corp`,
    name: businessInfo.name,
    url: baseUrl,
    logo: SITE_LOGO_URL,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: businessInfo.phone,
      contactType: 'emergency dispatch',
      areaServed: 'IN',
      availableLanguage: ['English', 'Bengali', 'Hindi'],
    },
  };

  // 4. FAQPage Structured Data for Rich Search Accordions
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${baseUrl}/#faq`,
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
