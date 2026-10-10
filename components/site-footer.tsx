'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { businessInfo } from '@/lib/business-info';
import { BrandLogo } from '@/components/brand-logo';
import { cn } from '@/lib/utils';

const footerSections = [
  {
    id: 'services',
    title: 'Core Services',
    links: [
      { label: 'All Services Catalogue', href: '/services' },
      { label: 'Pipe Fitting & Repair', href: '/services' },
      { label: 'Drainage & Sewer Jetting', href: '/services' },
      { label: 'Bathroom & Fixture Fitting', href: '/services' },
      { label: 'Water Tank Installation', href: '/services' },
      { label: 'Leak Detection & Pressure Testing', href: '/services' },
      { label: 'Kitchen & Water Purifier Hookup', href: '/services' },
    ],
  },
  {
    id: 'company',
    title: 'Customer & Company',
    links: [
      { label: 'About Our Contractors', href: '/about' },
      { label: 'Customer Reviews (5.0 ★)', href: '/reviews' },
      { label: 'Service Areas & Hubs', href: '/service-areas' },
      { label: 'Plumbing FAQs', href: '/faq' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Book a Service Online', href: '/book' },
      { label: 'Find Existing Booking', href: '/find-booking' },
    ],
  },
];

export function SiteFooter() {
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({
    services: false,
    company: false,
    coverage: false,
  });

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <footer className="border-t border-border/70 bg-card/60 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Top Trust & Engineering Standards Strip */}
        <div className="pb-10 mb-10 border-b border-border/60 grid sm:grid-cols-3 gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Verified Local Contractor</p>
              <p className="text-[11px]">Serving South Bengal households since 2015</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Transparent Written Quotes</p>
              <p className="text-[11px]">Pay only after work completion &amp; inspection</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Emergency Hotline Ready</p>
              <p className="text-[11px]">Direct mobile access to on-duty plumbers</p>
            </div>
          </div>
        </div>

        {/* Main Footer Layout */}
        <div className="grid gap-10 lg:grid-cols-4">
          {/* Brand & Direct Contact */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <BrandLogo size="md" />
              <span className="flex flex-col leading-none">
                <span className="font-display text-base font-bold tracking-tight text-foreground">
                  Sohan Pipeline&apos;s
                </span>
                <span className="text-[11px] text-muted-foreground font-medium">
                  &amp; Total Plumbing Solutions
                </span>
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-muted-foreground max-w-md leading-relaxed">
              {businessInfo.description}
            </p>

            <div className="pt-2 space-y-2.5 text-xs">
              <a
                href={`tel:${businessInfo.phone}`}
                className="flex items-center gap-3 text-foreground hover:text-primary transition-colors font-medium"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-primary shrink-0">
                  <Phone className="h-4 w-4" />
                </span>
                <span>{businessInfo.phoneDisplay} (Direct Line)</span>
              </a>

              <a
                href={`mailto:${businessInfo.email}`}
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted shrink-0">
                  <Mail className="h-4 w-4" />
                </span>
                <span>{businessInfo.email}</span>
              </a>

              <div className="flex items-center gap-3 text-muted-foreground">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted shrink-0">
                  <MapPin className="h-4 w-4" />
                </span>
                <span>{businessInfo.address}, {businessInfo.area}</span>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-[11px] text-muted-foreground">
                Accepted Payment: <strong className="text-foreground">Cash, UPI (PhonePe, Google Pay, Paytm), Bank Transfer</strong> after job inspection.
              </p>
            </div>
          </div>

          {/* Collapsible Mobile Accordions / Desktop Multi-column */}
          {footerSections.map((section) => {
            const isOpen = openSections[section.id];
            return (
              <div key={section.id} className="border-b lg:border-b-0 border-border/50 pb-4 lg:pb-0">
                {/* Mobile accordion toggle button with tap feedback */}
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleSection(section.id)}
                  className="flex lg:hidden w-full items-center justify-between py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-foreground select-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{section.title}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center justify-center"
                  >
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </motion.span>
                </motion.button>

                {/* Desktop static header */}
                <h4 className="hidden lg:block font-display font-semibold text-xs uppercase tracking-wider text-foreground mb-4">
                  {section.title}
                </h4>

                {/* Mobile animated collapsible container */}
                <div className="lg:hidden">
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key={`footer-col-${section.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                        style={{ willChange: 'height, opacity' }}
                        className="overflow-hidden pt-1"
                      >
                        <ul className="space-y-2.5 pb-2">
                          {section.links.map((link) => (
                            <li key={link.label}>
                              <Link
                                href={link.href}
                                className="text-xs text-muted-foreground hover:text-foreground transition-colors block py-0.5"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Desktop static links list */}
                <div className="hidden lg:block">
                  <ul className="space-y-2.5">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors block py-0.5"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Service Towns Directory Row */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
            <p className="text-[11px] font-semibold text-foreground uppercase tracking-wider">
              Regional Service Coverage Hubs:
            </p>
            <span className="text-[11px] text-muted-foreground">
              Paschim &amp; Purba Medinipur Districts
            </span>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
            {businessInfo.serviceAreas.map((town, idx) => (
              <span key={town} className="inline-flex items-center">
                <Link
                  href="/service-areas"
                  className="hover:text-primary transition-colors hover:underline"
                >
                  {town}
                </Link>
                {idx < businessInfo.serviceAreas.length - 1 && (
                  <span className="mx-2 text-border">·</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Copyright and Operating Hours Sub-bar */}
        <div className="mt-8 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p className="text-[11px]">
            &copy; {new Date().getFullYear()} {businessInfo.name}. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-primary" />
              <span>{businessInfo.hours}</span>
            </span>
            <span>{businessInfo.hoursDays}</span>
            <span className="text-muted-foreground font-medium">Sunday: Emergency Calls Only</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
