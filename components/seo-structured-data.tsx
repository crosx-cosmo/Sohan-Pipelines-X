import * as React from 'react';
import { businessInfo } from '@/lib/business-info';
import { services } from '@/lib/services';
import { SITE_LOGO_URL } from '@/lib/site-logo';

export function SeoStructuredData() {
  const baseUrl = 'https://sohan-pipelines.netlify.app';

  // 1. LocalBusiness / Plumber Schema
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': ['Plumber', 'HomeAndConstructionBusiness', 'LocalBusiness'],
    '@id': `${baseUrl}/#organization`,
    name: businessInfo.name,
    legalName: businessInfo.name,
    alternateName: "Sohan Pipeline's",
    url: baseUrl,
    logo: SITE_LOGO_URL,
    image: SITE_LOGO_URL,
    description: businessInfo.description,
    telephone: businessInfo.phone,
    email: businessInfo.email,
    priceRange: '₹₹ (Starting from ₹299)',
    address: {
      '@type': 'PostalAddress',
      streetAddress: businessInfo.address,
      addressLocality: 'Dantan',
      addressRegion: 'West Bengal',
      postalCode: '721426',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '21.9547',
      longitude: '87.2718',
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
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: businessInfo.rating.toString(),
      bestRating: '5',
      worstRating: '1',
      ratingCount: businessInfo.reviewCount.toString(),
      reviewCount: businessInfo.reviewCount.toString(),
    },
    areaServed: businessInfo.serviceAreas.map((area) => ({
      '@type': 'City',
      name: area,
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: 'West Bengal',
      },
    })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Plumbing Engineering Services',
      itemListElement: services.map((s) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: s.name,
          description: s.description,
        },
        price: s.startingPrice.toString(),
        priceCurrency: 'INR',
      })),
    },
    knowsAbout: [
      'Concealed Leak Detection',
      'Industrial & Domestic Pipe Fitting',
      'High-Pressure Drainage Jetting',
      'Sanitary Fixtures & Bathroom Renovation',
      'Overhead Water Tank Setup',
      'Booster Pump Manifold Piping',
    ],
  };

  // 2. WebSite Schema
  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: businessInfo.name,
    description: businessInfo.description,
    publisher: {
      '@id': `${baseUrl}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/find-booking?id={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
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
    </>
  );
}
