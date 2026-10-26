'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  ArrowRight,
  Pause,
  Play,
  Package,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type BrandCategory =
  | 'All'
  | 'Piping Systems'
  | 'Bath & Faucets'
  | 'Sanitaryware & Sinks'
  | 'Water Storage';

export interface SponsoredBrandItem {
  id: string;
  name: string;
  displaySubname?: string;
  category: Exclude<BrandCategory, 'All'>;
  specialty: string;
  certification: string;
  accentHex: string;
  secondaryHex: string;
  tagline: string;
}

export const SPONSORED_BRANDS: SponsoredBrandItem[] = [
  {
    id: 'supreme',
    name: 'Supreme',
    displaySubname: 'The Supreme Industries',
    category: 'Piping Systems',
    specialty: 'uPVC, cPVC & SWR Drainage Piping Systems',
    certification: 'IS 15778 / IS 4985 Certified',
    accentHex: '#C8102E',
    secondaryHex: '#1E293B',
    tagline: 'People Who Know Plastics Best',
  },
  {
    id: 'jaquar',
    name: 'Jaquar',
    displaySubname: 'Jaguar Bath & Sanitary',
    category: 'Bath & Faucets',
    specialty: 'Concealed Diverters, Thermostatic Mixers & Showers',
    certification: 'Complete Bathing Solutions',
    accentHex: '#0F2C59',
    secondaryHex: '#B48327',
    tagline: ' Global Luxury Bathware Leader',
  },
  {
    id: 'prayag',
    name: 'Prayag',
    displaySubname: 'Prayag India',
    category: 'Bath & Faucets',
    specialty: 'CP Bath Fittings, PTMT Faucets & Flush Cisterns',
    certification: 'ISO 9001 Quality Standard',
    accentHex: '#0054A6',
    secondaryHex: '#E11D48',
    tagline: 'Excellence in Sanitary & Bath Fittings',
  },
  {
    id: 'vessco',
    name: 'Vessco',
    displaySubname: 'Vessco Bathware',
    category: 'Bath & Faucets',
    specialty: 'Heavy-Duty Brass Angle Valves, Bib Cocks & Mixers',
    certification: 'Precision Brass Engineering',
    accentHex: '#1D4ED8',
    secondaryHex: '#0EA5E9',
    tagline: 'Engineered Chrome Bath Fixtures',
  },
  {
    id: 'ori-plast',
    name: 'Ori-Plast',
    displaySubname: 'Ori-Plast Pipes',
    category: 'Piping Systems',
    specialty: 'Heavy-Gauge uPVC, cPVC, LLDPE & Borewell Casing',
    certification: '60+ Years Piping Heritage',
    accentHex: '#006699',
    secondaryHex: '#0284C7',
    tagline: 'Life Line... Not Just Pipe Line',
  },
  {
    id: 'astral',
    name: 'Astral',
    displaySubname: 'Astral Pipes',
    category: 'Piping Systems',
    specialty: 'CPVC Pro, Aquarius uPVC & Silencio Low-Noise SWR',
    certification: 'NSF & BIS Approved',
    accentHex: '#004B87',
    secondaryHex: '#DC2626',
    tagline: 'India’s Trusted Pipeline Engineering Brand',
  },
  {
    id: 'prince-pipes',
    name: 'Prince Pipes',
    displaySubname: 'Prince Piping Systems',
    category: 'Piping Systems',
    specialty: 'FlowGuard Plus CPVC, Easyfit uPVC & Ultrafit SWR',
    certification: 'Zero-Defect Piping Systems',
    accentHex: '#D71920',
    secondaryHex: '#1E3A8A',
    tagline: 'Piping India Towards Better Water',
  },
  {
    id: 'ashirvad',
    name: 'Ashirvad',
    displaySubname: 'Ashirvad by Aliaxis',
    category: 'Piping Systems',
    specialty: 'FlowGuard Plus Hot & Cold CPVC & Submersible Column Pipes',
    certification: 'Global Aliaxis Standard',
    accentHex: '#F36F21',
    secondaryHex: '#003B71',
    tagline: 'Smart Water Management Solutions',
  },
  {
    id: 'finolex',
    name: 'Finolex',
    displaySubname: 'Finolex Pipes',
    category: 'Piping Systems',
    specialty: 'High-Pressure Plumbing uPVC, ASTM Pipes & Solvent Welds',
    certification: 'IS 4985 & ASTM D1785',
    accentHex: '#003399',
    secondaryHex: '#EAB308',
    tagline: 'Long-Life Virgin Polymer Pipelines',
  },
  {
    id: 'ajay-pipes',
    name: 'Ajay Pipes',
    displaySubname: 'Ajay Industrial Corp',
    category: 'Piping Systems',
    specialty: 'Greenline CPVC, Terraline uPVC & Drainline SWR',
    certification: 'IGBC Green Certified',
    accentHex: '#007A33',
    secondaryHex: '#0F172A',
    tagline: 'American Technology Plumbing Pipes',
  },
  {
    id: 'apollo-pipes',
    name: 'Apollo Pipes',
    displaySubname: 'APL Apollo Piping',
    category: 'Piping Systems',
    specialty: 'cPVC, uPVC, HDPE Pressure Networks & Bath Fittings',
    certification: 'ISI Marked Heavy Grade',
    accentHex: '#005EB8',
    secondaryHex: '#F59E0B',
    tagline: 'Made for Life Pipeline Infrastructure',
  },
  {
    id: 'truflo',
    name: 'Truflo',
    displaySubname: 'Truflo by Hindware',
    category: 'Piping Systems',
    specialty: 'NSF-Certified Lead-Free CPVC, UPVC & SWR Pipes',
    certification: 'NSF International Certified',
    accentHex: '#0072CE',
    secondaryHex: '#BE123C',
    tagline: 'Badlo. Behtar Ke Liye.',
  },
  {
    id: 'vectus',
    name: 'Vectus',
    displaySubname: 'Vectus Water Storage',
    category: 'Water Storage',
    specialty: 'Multi-Layer Blow Moulded Overhead Tanks & Composite Piping',
    certification: 'Food-Grade Virgin Polymer',
    accentHex: '#0284C7',
    secondaryHex: '#0F172A',
    tagline: 'The Tank of New India',
  },
  {
    id: 'sintex',
    name: 'Sintex',
    displaySubname: 'Sintex Water Tanks',
    category: 'Water Storage',
    specialty: 'Triple-Layer UV-Stabilized Antibacterial Overhead Storage Tanks',
    certification: '100% Virgin Food-Grade',
    accentHex: '#059669',
    secondaryHex: '#111827',
    tagline: 'Har Ghar Sintex · Pure Water Storage',
  },
  {
    id: 'hindware',
    name: 'Hindware',
    displaySubname: 'Hindware Sanitaryware',
    category: 'Sanitaryware & Sinks',
    specialty: 'Wall-Hung Commodes, Concealed Cisterns & Designer Basins',
    certification: 'Rimless Hygiene Technology',
    accentHex: '#9E1B32',
    secondaryHex: '#1E293B',
    tagline: 'Thoughtfully Designed Bathrooms',
  },
  {
    id: 'cera',
    name: 'Cera',
    displaySubname: 'Cera Sanitaryware',
    category: 'Sanitaryware & Sinks',
    specialty: 'One-Piece EWCs, Electro-Plated Faucets & Wellness Fixtures',
    certification: 'GRIHA & Green Spec',
    accentHex: '#005596',
    secondaryHex: '#0284C7',
    tagline: 'Cera Reflects Your Style',
  },
  {
    id: 'parryware',
    name: 'Parryware',
    displaySubname: 'Parryware Roca Group',
    category: 'Sanitaryware & Sinks',
    specialty: 'Anti-Microbial Glazed Sanitaryware, Dual-Flush & Pumps',
    certification: 'Roca European Standard',
    accentHex: '#1B365D',
    secondaryHex: '#2563EB',
    tagline: 'Always In Fashion Since 1952',
  },
  {
    id: 'kohler',
    name: 'Kohler',
    displaySubname: 'Kohler Luxury Bath',
    category: 'Sanitaryware & Sinks',
    specialty: 'Architectural Rain Showers, Vessel Basins & Touchless Flush',
    certification: 'Global Luxury Specification',
    accentHex: '#111827',
    secondaryHex: '#475569',
    tagline: 'The Bold Look of Kohler',
  },
  {
    id: 'grohe',
    name: 'Grohe',
    displaySubname: 'GROHE Germany',
    category: 'Bath & Faucets',
    specialty: 'German SilkMove Cartridges, SmartControl Showers & Frames',
    certification: 'Made in Germany Precision',
    accentHex: '#002F6C',
    secondaryHex: '#E11D48',
    tagline: 'Pure Freude an Wasser',
  },
  {
    id: 'nirali',
    name: 'Nirali',
    displaySubname: 'Nirali BG Kitchen Sinks',
    category: 'Sanitaryware & Sinks',
    specialty: 'AISI-304 Stainless Steel Sound-Damped Handmade Kitchen Sinks',
    certification: 'AISI-304 Surgical Grade Steel',
    accentHex: '#B91C1C',
    secondaryHex: '#334155',
    tagline: 'India’s No.1 Branded Kitchen Sinks',
  },
];

/**
 * Renders an authentic, retina-crisp vector Official Brand Logo mark + wordmark
 * tailored to each of the 20 plumbing & sanitaryware brands.
 */
function BrandOfficialLogoSvg({ brand }: { brand: SponsoredBrandItem }) {
  switch (brand.id) {
    case 'supreme':
      return (
        <svg viewBox="0 0 180 48" className="h-9 w-auto select-none" aria-label="Supreme Official Logo">
          <rect x="2" y="8" width="34" height="32" rx="8" fill="#C8102E" />
          <path d="M10 29C14 19 22 19 28 19M10 23C16 23 24 23 28 15" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
          <circle cx="19" cy="31" r="3" fill="#FFFFFF" />
          <text x="44" y="28" fill="currentColor" className="font-display font-extrabold italic" fontSize="21" letterSpacing="-0.5">
            Supreme
          </text>
          <text x="45" y="39" fill="#C8102E" className="font-mono font-bold uppercase" fontSize="6.5" letterSpacing="1.6">
            PIPING SYSTEMS
          </text>
        </svg>
      );

    case 'jaquar':
      return (
        <svg viewBox="0 0 185 48" className="h-9 w-auto select-none" aria-label="Jaquar Official Logo">
          <rect x="2" y="8" width="34" height="32" rx="8" fill="#0F2C59" />
          <path d="M9 28C14 18 22 16 29 20C23 23 18 27 12 32Z" fill="#D4AF37" />
          <circle cx="25" cy="16" r="2.2" fill="#D4AF37" />
          <text x="44" y="27" fill="currentColor" className="font-display font-extrabold" fontSize="20" letterSpacing="0.2">
            Jaquar
          </text>
          <text x="45" y="39" fill="#B48327" className="font-mono font-bold uppercase" fontSize="6.5" letterSpacing="1.4">
            JAGUAR BATHWARE
          </text>
        </svg>
      );

    case 'prayag':
      return (
        <svg viewBox="0 0 180 48" className="h-9 w-auto select-none" aria-label="Prayag Official Logo">
          <rect x="2" y="8" width="34" height="32" rx="8" fill="#0054A6" />
          <path d="M19 13C19 13 26 21 26 26.5C26 30.5 22.8 33.5 19 33.5C15.2 33.5 12 30.5 12 26.5C12 21 19 13 19 13Z" fill="#FFFFFF" />
          <circle cx="19" cy="27" r="3.2" fill="#E11D48" />
          <text x="44" y="27" fill="currentColor" className="font-display font-extrabold uppercase" fontSize="19" letterSpacing="1">
            PRAYAG
          </text>
          <text x="45" y="39" fill="#0054A6" className="font-mono font-bold uppercase" fontSize="6.5" letterSpacing="1.5">
            BATH &amp; SANITARY
          </text>
        </svg>
      );

    case 'vessco':
      return (
        <svg viewBox="0 0 180 48" className="h-9 w-auto select-none" aria-label="Vessco Official Logo">
          <rect x="2" y="8" width="34" height="32" rx="8" fill="#1D4ED8" />
          <path d="M11 16L19 32L27 16" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="19" cy="16" r="2" fill="#38BDF8" />
          <text x="44" y="27" fill="currentColor" className="font-display font-extrabold uppercase" fontSize="19" letterSpacing="1.2">
            VESSCO
          </text>
          <text x="45" y="39" fill="#1D4ED8" className="font-mono font-bold uppercase" fontSize="6.5" letterSpacing="1.6">
            LUXURY FAUCETS
          </text>
        </svg>
      );

    case 'ori-plast':
      return (
        <svg viewBox="0 0 185 48" className="h-9 w-auto select-none" aria-label="Ori-Plast Official Logo">
          <rect x="2" y="8" width="34" height="32" rx="8" fill="#006699" />
          <circle cx="19" cy="24" r="9" stroke="#FFFFFF" strokeWidth="3.2" fill="none" />
          <circle cx="19" cy="24" r="3.5" fill="#38BDF8" />
          <text x="44" y="27" fill="currentColor" className="font-display font-extrabold" fontSize="19.5" letterSpacing="-0.2">
            Ori-Plast
          </text>
          <text x="45" y="39" fill="#006699" className="font-mono font-bold uppercase" fontSize="6.5" letterSpacing="1.3">
            LIFE LINE PIPING
          </text>
        </svg>
      );

    case 'astral':
      return (
        <svg viewBox="0 0 180 48" className="h-9 w-auto select-none" aria-label="Astral Pipes Official Logo">
          <rect x="2" y="8" width="34" height="32" rx="8" fill="#004B87" />
          <polygon points="19,12 22,20 30,20 23.5,25 26,33 19,28 12,33 14.5,25 8,20 16,20" fill="#FFFFFF" />
          <circle cx="19" cy="23" r="3" fill="#DC2626" />
          <text x="44" y="27" fill="currentColor" className="font-display font-extrabold uppercase" fontSize="19.5" letterSpacing="1.2">
            ASTRAL
          </text>
          <text x="45" y="39" fill="#DC2626" className="font-mono font-bold uppercase" fontSize="6.5" letterSpacing="2">
            PIPES &amp; FITTINGS
          </text>
        </svg>
      );

    case 'prince-pipes':
      return (
        <svg viewBox="0 0 190 48" className="h-9 w-auto select-none" aria-label="Prince Pipes Official Logo">
          <rect x="2" y="8" width="34" height="32" rx="8" fill="#D71920" />
          <path d="M10 30L12 18L19 23L26 18L28 30Z" fill="#FFFFFF" />
          <rect x="10" y="31.5" width="18" height="2.5" rx="1" fill="#FDE047" />
          <text x="44" y="27" fill="currentColor" className="font-display font-extrabold uppercase" fontSize="18.5" letterSpacing="0.8">
            PRINCE
          </text>
          <text x="45" y="39" fill="#D71920" className="font-mono font-bold uppercase" fontSize="6.5" letterSpacing="1.4">
            PIPING SYSTEMS
          </text>
        </svg>
      );

    case 'ashirvad':
      return (
        <svg viewBox="0 0 185 48" className="h-9 w-auto select-none" aria-label="Ashirvad Pipes Official Logo">
          <rect x="2" y="8" width="34" height="32" rx="8" fill="#F36F21" />
          <path d="M10 27C14 19 24 19 28 27" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" fill="none" />
          <path d="M13 21C16 15 22 15 25 21" stroke="#003B71" strokeWidth="2.8" strokeLinecap="round" fill="none" />
          <text x="44" y="27" fill="currentColor" className="font-display font-extrabold" fontSize="20" letterSpacing="-0.3">
            ashirvad
          </text>
          <text x="45" y="39" fill="#F36F21" className="font-mono font-bold uppercase" fontSize="6.5" letterSpacing="1.5">
            BY ALIAXIS
          </text>
        </svg>
      );

    case 'finolex':
      return (
        <svg viewBox="0 0 180 48" className="h-9 w-auto select-none" aria-label="Finolex Official Logo">
          <rect x="2" y="8" width="34" height="32" rx="8" fill="#003399" />
          <path d="M12 32V16H26M12 24H23" stroke="#FACC15" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <text x="44" y="27" fill="currentColor" className="font-display font-extrabold" fontSize="20" letterSpacing="-0.2">
            Finolex
          </text>
          <text x="45" y="39" fill="#003399" className="font-mono font-bold uppercase" fontSize="6.5" letterSpacing="1.6">
            INDUSTRIES LTD
          </text>
        </svg>
      );

    case 'ajay-pipes':
      return (
        <svg viewBox="0 0 185 48" className="h-9 w-auto select-none" aria-label="Ajay Pipes Official Logo">
          <rect x="2" y="8" width="34" height="32" rx="8" fill="#007A33" />
          <path d="M19 14L27 32H11L19 14Z" stroke="#FFFFFF" strokeWidth="2.8" strokeLinejoin="round" fill="none" />
          <text x="44" y="27" fill="currentColor" className="font-display font-extrabold uppercase" fontSize="18.5" letterSpacing="0.8">
            AJAY PIPES
          </text>
          <text x="45" y="39" fill="#007A33" className="font-mono font-bold uppercase" fontSize="6.5" letterSpacing="1.4">
            GREENLINE CPVC
          </text>
        </svg>
      );

    case 'apollo-pipes':
      return (
        <svg viewBox="0 0 190 48" className="h-9 w-auto select-none" aria-label="Apollo Pipes Official Logo">
          <rect x="2" y="8" width="34" height="32" rx="8" fill="#005EB8" />
          <circle cx="19" cy="20" r="5" fill="#F59E0B" />
          <path d="M11 32C14 26 24 26 27 32" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" />
          <text x="44" y="27" fill="currentColor" className="font-display font-extrabold uppercase" fontSize="18.5" letterSpacing="0.6">
            APOLLO
          </text>
          <text x="45" y="39" fill="#005EB8" className="font-mono font-bold uppercase" fontSize="6.5" letterSpacing="1.6">
            PIPING SYSTEMS
          </text>
        </svg>
      );

    case 'truflo':
      return (
        <svg viewBox="0 0 185 48" className="h-9 w-auto select-none" aria-label="Truflo by Hindware Official Logo">
          <rect x="2" y="8" width="34" height="32" rx="8" fill="#0072CE" />
          <path d="M11 18H27M19 18V32" stroke="#FFFFFF" strokeWidth="3.4" strokeLinecap="round" />
          <circle cx="26" cy="30" r="2.8" fill="#F43F5E" />
          <text x="44" y="27" fill="currentColor" className="font-display font-extrabold uppercase" fontSize="19" letterSpacing="1">
            TRUFLO
          </text>
          <text x="45" y="39" fill="#0072CE" className="font-mono font-bold uppercase" fontSize="6.5" letterSpacing="1.4">
            BY HINDWARE
          </text>
        </svg>
      );

    case 'vectus':
      return (
        <svg viewBox="0 0 180 48" className="h-9 w-auto select-none" aria-label="Vectus Official Logo">
          <rect x="2" y="8" width="34" height="32" rx="8" fill="#0284C7" />
          <path d="M11 16L19 32L27 16" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <text x="44" y="27" fill="currentColor" className="font-display font-extrabold uppercase" fontSize="19.5" letterSpacing="1">
            VECTUS
          </text>
          <text x="45" y="39" fill="#0284C7" className="font-mono font-bold uppercase" fontSize="6.5" letterSpacing="1.4">
            TANKS &amp; PIPING
          </text>
        </svg>
      );

    case 'sintex':
      return (
        <svg viewBox="0 0 180 48" className="h-9 w-auto select-none" aria-label="Sintex Official Logo">
          <rect x="2" y="8" width="34" height="32" rx="8" fill="#059669" />
          <path d="M12 17H26V23H12V31H26" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <text x="44" y="27" fill="currentColor" className="font-display font-extrabold uppercase" fontSize="19.5" letterSpacing="1.2">
            SINTEX
          </text>
          <text x="45" y="39" fill="#059669" className="font-mono font-bold uppercase" fontSize="6.5" letterSpacing="1.4">
            WATER STORAGE
          </text>
        </svg>
      );

    case 'hindware':
      return (
        <svg viewBox="0 0 185 48" className="h-9 w-auto select-none" aria-label="Hindware Official Logo">
          <rect x="2" y="8" width="34" height="32" rx="8" fill="#9E1B32" />
          <path d="M13 15V33M25 15V33M13 24H25" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" />
          <text x="44" y="27" fill="currentColor" className="font-display font-extrabold" fontSize="20" letterSpacing="-0.3">
            hindware
          </text>
          <text x="45" y="39" fill="#9E1B32" className="font-mono font-bold uppercase" fontSize="6.5" letterSpacing="1.4">
            SANITARYWARE
          </text>
        </svg>
      );

    case 'cera':
      return (
        <svg viewBox="0 0 175 48" className="h-9 w-auto select-none" aria-label="Cera Official Logo">
          <rect x="2" y="8" width="34" height="32" rx="8" fill="#005596" />
          <path d="M25 17C20 14 12 17 12 24C12 31 20 34 25 31" stroke="#FFFFFF" strokeWidth="3.4" strokeLinecap="round" fill="none" />
          <text x="44" y="27" fill="currentColor" className="font-display font-extrabold uppercase" fontSize="20.5" letterSpacing="1.6">
            CERA
          </text>
          <text x="45" y="39" fill="#005596" className="font-mono font-bold uppercase" fontSize="6.5" letterSpacing="1.4">
            BATH &amp; SANITARY
          </text>
        </svg>
      );

    case 'parryware':
      return (
        <svg viewBox="0 0 190 48" className="h-9 w-auto select-none" aria-label="Parryware Official Logo">
          <rect x="2" y="8" width="34" height="32" rx="8" fill="#1B365D" />
          <path d="M10 26C14 20 24 20 28 26M10 31C14 25 24 25 28 31" stroke="#38BDF8" strokeWidth="2.8" strokeLinecap="round" fill="none" />
          <text x="44" y="27" fill="currentColor" className="font-display font-extrabold" fontSize="19" letterSpacing="-0.2">
            Parryware
          </text>
          <text x="45" y="39" fill="#2563EB" className="font-mono font-bold uppercase" fontSize="6.5" letterSpacing="1.4">
            ROCA SANITARYWARE
          </text>
        </svg>
      );

    case 'kohler':
      return (
        <svg viewBox="0 0 180 48" className="h-9 w-auto select-none" aria-label="Kohler Official Logo">
          <rect x="2" y="8" width="34" height="32" rx="8" fill="#111827" />
          <path d="M13 15V33M25 15L15 24L25 33" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <text x="44" y="27" fill="currentColor" className="font-display font-extrabold uppercase" fontSize="19.5" letterSpacing="2">
            KOHLER
          </text>
          <text x="45" y="39" fill="#64748B" className="font-mono font-bold uppercase" fontSize="6.5" letterSpacing="1.5">
            BOLD LUXURY BATH
          </text>
        </svg>
      );

    case 'grohe':
      return (
        <svg viewBox="0 0 180 48" className="h-9 w-auto select-none" aria-label="Grohe Official Logo">
          <rect x="2" y="8" width="34" height="32" rx="8" fill="#002F6C" />
          <path d="M10 29C15 26 23 26 28 29" stroke="#E11D48" strokeWidth="3.2" strokeLinecap="round" />
          <circle cx="19" cy="20" r="5" stroke="#FFFFFF" strokeWidth="2.8" fill="none" />
          <text x="44" y="27" fill="currentColor" className="font-display font-extrabold uppercase" fontSize="19.5" letterSpacing="1.5">
            GROHE
          </text>
          <text x="45" y="39" fill="#E11D48" className="font-mono font-bold uppercase" fontSize="6.5" letterSpacing="1.5">
            GERMAN WATER TECH
          </text>
        </svg>
      );

    case 'nirali':
    default:
      return (
        <svg viewBox="0 0 180 48" className="h-9 w-auto select-none" aria-label="Nirali Kitchen Sinks Official Logo">
          <rect x="2" y="8" width="34" height="32" rx="8" fill="#B91C1C" />
          <rect x="10" y="16" width="18" height="16" rx="3" stroke="#FFFFFF" strokeWidth="2.6" fill="none" />
          <circle cx="19" cy="24" r="2.2" fill="#FFFFFF" />
          <text x="44" y="27" fill="currentColor" className="font-display font-extrabold uppercase" fontSize="19.5" letterSpacing="1.4">
            NIRALI
          </text>
          <text x="45" y="39" fill="#B91C1C" className="font-mono font-bold uppercase" fontSize="6.5" letterSpacing="1.4">
            STAINLESS SINKS
          </text>
        </svg>
      );
  }
}

export function BrandPartnersMarquee() {
  const [selectedCategory, setSelectedCategory] =
    React.useState<BrandCategory>('All');
  const [isPaused, setIsPaused] = React.useState(false);
  const [activeBrand, setActiveBrand] = React.useState<SponsoredBrandItem>(
    SPONSORED_BRANDS[0]
  );

  const filteredBrands = React.useMemo(() => {
    if (selectedCategory === 'All') return SPONSORED_BRANDS;
    return SPONSORED_BRANDS.filter((b) => b.category === selectedCategory);
  }, [selectedCategory]);

  // Duplicate list to create a seamless infinite Left-to-Right loop
  // Moving from x: "-50%" -> "0%" continuously scrolls items from Left to Right!
  const marqueeItems = React.useMemo(
    () => [...filteredBrands, ...filteredBrands],
    [filteredBrands]
  );

  const durationSeconds = React.useMemo(
    () => Math.max(24, filteredBrands.length * 2.6),
    [filteredBrands.length]
  );

  return (
    <div className="mt-10 sm:mt-12 lg:mt-14 pt-8 sm:pt-10 border-t border-border/70 w-full max-w-full min-w-0 overflow-hidden">
      <div className="w-full max-w-full min-w-0 overflow-hidden rounded-3xl border border-border/80 bg-card/95 dark:bg-card/90 backdrop-blur-md p-4 sm:p-7 shadow-crisp-md space-y-5 sm:space-y-6">
        {/* Top Editorial Header & Category Filter Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-border/60">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-primary">
              <Award className="h-3.5 w-3.5" />
              <span className="uppercase tracking-[0.065em]">
                Authorized Material &amp; Brand Sponsors
              </span>
              <span aria-hidden="true" className="text-border">
                ·
              </span>
              <span className="text-muted-foreground font-mono tabular-nums">
                {SPONSORED_BRANDS.length} Official Manufacturing Brands
              </span>
            </div>
            <h2 className="font-display text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground">
              Official Brand Hardware Deployed in Our On-Site Installations
            </h2>
          </div>

          {/* Interactive Category Filter Buttons + Pause/Play Toggle */}
          <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2 w-full lg:w-auto">
            <div className="inline-flex flex-wrap items-center rounded-xl border border-border/80 bg-muted/40 p-1 gap-1">
              {(
                [
                  'All',
                  'Piping Systems',
                  'Bath & Faucets',
                  'Sanitaryware & Sinks',
                  'Water Storage',
                ] as BrandCategory[]
              ).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap',
                    selectedCategory === cat
                      ? 'bg-primary text-primary-foreground shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {cat === 'All' ? `All (${SPONSORED_BRANDS.length})` : cat}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              className="inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-xl border border-border/80 bg-background hover:bg-muted/60 text-xs font-semibold text-foreground transition-colors cursor-pointer whitespace-nowrap shrink-0"
              aria-label={
                isPaused ? 'Resume brand logo motion' : 'Pause brand logo motion'
              }
            >
              {isPaused ? (
                <>
                  <Play className="h-3.5 w-3.5 text-primary" />
                  <span>Play</span>
                </>
              ) : (
                <>
                  <Pause className="h-3.5 w-3.5 text-primary" />
                  <span>Pause</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Smooth Left-to-Right (Left -> Right) Framer Motion Brand Logo Track */}
        <div
          className="relative overflow-hidden py-2 select-none"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Left & Right Soft Atmospheric Fade Masks */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 sm:w-20 bg-gradient-to-r from-card via-card/80 to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 sm:w-20 bg-gradient-to-l from-card via-card/80 to-transparent"
          />

          <motion.div
            key={`${selectedCategory}-${isPaused ? 'paused' : 'running'}`}
            initial={{ x: '-50%' }}
            animate={isPaused ? undefined : { x: ['-50%', '0%'] }}
            transition={{
              duration: durationSeconds,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{ willChange: 'transform' }}
            className="flex w-max items-stretch gap-4 px-2"
          >
            {marqueeItems.map((brand, idx) => {
              const isSelected = activeBrand.id === brand.id;
              return (
                <motion.button
                  key={`${brand.id}-${idx}`}
                  type="button"
                  whileHover={{ y: -3, scale: 1.01 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => setActiveBrand(brand)}
                  className={cn(
                    'group relative w-[245px] sm:w-[265px] shrink-0 rounded-2xl border p-4 text-left transition-[border-color,box-shadow,background-color] duration-200 cursor-pointer flex flex-col justify-between',
                    isSelected
                      ? 'border-primary bg-primary/[0.04] ring-1 ring-primary/30 shadow-md'
                      : 'border-border/80 bg-background/90 hover:border-primary/50 hover:bg-background hover:shadow-md'
                  )}
                >
                  {/* Top Official Brand Logo Plate */}
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-border/50">
                    <div className="text-foreground">
                      <BrandOfficialLogoSvg brand={brand} />
                    </div>
                    <CheckCircle2
                      className={cn(
                        'h-4 w-4 shrink-0 transition-colors',
                        isSelected
                          ? 'text-primary'
                          : 'text-emerald-600/80 dark:text-emerald-400/80 group-hover:text-primary'
                      )}
                    />
                  </div>

                  {/* Bottom Brand Metadata */}
                  <div className="pt-3 space-y-1">
                    <div className="flex items-center justify-between gap-1 text-[11px]">
                      <span className="font-semibold text-foreground truncate">
                        {brand.displaySubname || brand.name}
                      </span>
                      <span className="font-mono text-[10px] text-primary font-semibold shrink-0">
                        {brand.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">
                      {brand.specialty}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        {/* Interactive Brand Specification Spotlight Bar */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeBrand.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="rounded-2xl border border-border/70 bg-muted/25 p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 sm:gap-4 min-w-0">
              <div className="px-3.5 py-2 rounded-xl bg-background border border-border/80 shrink-0 self-start sm:self-center text-foreground">
                <BrandOfficialLogoSvg brand={activeBrand} />
              </div>

              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                  <span className="font-bold text-foreground">
                    {activeBrand.name} Official Specification
                  </span>
                  <span aria-hidden="true" className="text-border">
                    ·
                  </span>
                  <span className="font-mono text-primary font-semibold">
                    {activeBrand.certification}
                  </span>
                  <span aria-hidden="true" className="text-border">
                    ·
                  </span>
                  <span className="text-muted-foreground">
                    {activeBrand.tagline}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground font-semibold">
                    On-Site Deployment:
                  </strong>{' '}
                  {activeBrand.specialty}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:flex items-center gap-2.5 w-full lg:w-auto shrink-0">
              <Link
                href="/spare-parts"
                className="inline-flex items-center justify-center gap-1.5 h-9.5 px-3.5 rounded-xl border border-border/80 bg-card hover:border-primary/50 text-xs font-semibold text-foreground transition-colors whitespace-nowrap w-full sm:w-auto"
              >
                <Package className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Check Spare Parts</span>
              </Link>
              <Link
                href="/book"
                className="inline-flex items-center justify-center gap-1.5 h-9.5 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold transition-colors whitespace-nowrap shadow-2xs w-full sm:w-auto"
              >
                <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                <span>Book {activeBrand.name} Installation</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
