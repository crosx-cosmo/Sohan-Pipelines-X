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
import {
  fetchLiveServices,
  getCachedServices,
  fetchLiveServiceAreas,
  getCachedServiceAreas,
  type DbService,
  type DbServiceArea,
} from '@/lib/supabase-data';
import { BrandLogo } from '@/components/brand-logo';

const companyLinks = [
  { label: 'About Our Contractors', href: '/about' },
  { label: 'Verified Client Reviews', href: '/reviews' },
  { label: 'Service Areas & Hubs', href: '/service-areas' },
  { label: 'Plumbing FAQs', href: '/faq' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Book a Service Online', href: '/book' },
  { label: 'Find Existing Booking', href: '/find-booking' },
  { label: 'Plumbing Spare Parts', href: '/spare-parts' },
];

export function SiteFooter() {
  const [openSections, setOpenSections] = React.useState<
    Record<string, boolean>
  >({
    services: false,
    company: false,
    coverage: false,
  });
  const [liveServices, setLiveServices] = React.useState<DbService[]>(
    () => getCachedServices() ?? []
  );
  const [liveAreas, setLiveAreas] = React.useState<DbServiceArea[]>(
    () => getCachedServiceAreas() ?? []
  );

  React.useEffect(() => {
    let active = true;
    fetchLiveServices().then(({ data }) => {
      if (active) {
        setLiveServices(data);
      }
    });
    fetchLiveServiceAreas().then(({ data }) => {
      if (active) {
        setLiveAreas(data);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const footerSections = React.useMemo(
    () => [
      {
        id: 'services',
        title: 'Core Services',
        links: [
          { label: 'All Services Catalogue', href: '/services' },
          ...liveServices.map((s) => ({
            label: s.name,
            href: `/book?service=${encodeURIComponent(s.id)}`,
          })),
        ],
      },
      {
        id: 'company',
        title: 'Customer & Company',
        links: companyLinks,
      },
    ],
    [liveServices]
  );

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
              <p className="font-semibold text-foreground">
                Verified Local Contractor
              </p>
              <p className="text-[11px]">
                Serving South Bengal households since 2015
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                Transparent Written Quotes
              </p>
              <p className="text-[11px]">
                Pay only after work completion &amp; inspection
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                Emergency Hotline Ready
              </p>
              <p className="text-[11px]">
                Direct mobile access to on-duty plumbers
              </p>
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

              <div className="flex items-start gap-3 text-muted-foreground">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted shrink-0 mt-0.5">
                  <MapPin className="h-4 w-4 text-primary" />
                </span>
                <span className="leading-relaxed">{businessInfo.address}</span>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-[11px] text-muted-foreground">
                Accepted Payment:{' '}
                <strong className="text-foreground">
                  Cash, UPI (PhonePe, Google Pay, Paytm), Bank Transfer
                </strong>{' '}
                after job inspection.
              </p>
            </div>
          </div>

          {/* Collapsible Mobile Accordions / Desktop Multi-column */}
          {footerSections.map((section, idx) => {
            const isOpen = openSections[section.id];
            const isLastSection = idx === footerSections.length - 1;
            return (
              <div
                key={section.id}
                className={
                  isLastSection
                    ? 'pb-1 lg:pb-0'
                    : 'border-b lg:border-b-0 border-border/50 pb-4 lg:pb-0'
                }
              >
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

                <h4 className="hidden lg:block font-display font-semibold text-xs uppercase tracking-wider text-foreground mb-4">
                  {section.title}
                </h4>

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

        {/* Key Service Hubs & Base Workshop Directory Card (Aligned for Mobile & Desktop) */}
        <div className="mt-8 lg:mt-10 rounded-2xl border border-border/80 bg-muted/20 p-4 sm:p-5 lg:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-border/60">
            <div className="flex items-start sm:items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5 sm:mt-0">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Key Service Hubs &amp; Regional Dispatch
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Verified rapid-response coverage across Paschim &amp; Purba Medinipur
                </p>
              </div>
            </div>

            {/* Structured Base Workshop Badge/Box */}
            <div className="flex items-start sm:items-center gap-2.5 rounded-xl bg-card border border-border/70 px-3.5 py-2.5 text-left shrink-0">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 mt-1.5 sm:mt-0" />
              <div className="text-[11px] leading-snug">
                <span className="font-semibold text-foreground block sm:inline">
                  Base Workshop:{' '}
                </span>
                <span className="text-muted-foreground">
                  Bahardaltitia, Keshrambha, Dantan
                </span>{' '}
                <span className="font-mono font-semibold text-primary">
                  (PIN {businessInfo.pincode})
                </span>
              </div>
            </div>
          </div>

          {liveAreas.length > 0 ? (
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
                {liveAreas.slice(0, 8).map((area, idx) => (
                  <Link
                    key={`${area.id || area.locality}-${idx}`}
                    href={`/book?area=${encodeURIComponent(area.locality)}`}
                    className="inline-flex items-center justify-between sm:justify-start gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border/70 text-[11px] font-semibold text-foreground hover:border-primary/50 hover:text-primary transition-colors truncate"
                  >
                    <span className="truncate">{area.locality}</span>
                    {area.pincode && (
                      <span className="font-mono text-[10px] text-muted-foreground shrink-0">
                        ({area.pincode})
                      </span>
                    )}
                  </Link>
                ))}
              </div>

              <Link
                href="/service-areas"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/15 border border-primary/20 font-semibold text-xs transition-colors shrink-0"
              >
                <span>View All Service Areas</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          ) : (
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground">
              <span>
                Same-day mobile plumbing teams serving Dantan, Keshrambha, Midnapore, Kharagpur, and surrounding blocks.
              </span>
              <Link
                href="/service-areas"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/15 border border-primary/20 font-semibold text-xs transition-colors shrink-0"
              >
                <span>View All Service Areas</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          )}
        </div>

        {/* Copyright and Operating Hours Sub-bar */}
        <div className="mt-8 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 text-xs text-muted-foreground">
          <p className="text-[11px] text-left">
            &copy; {new Date().getFullYear()} {businessInfo.name}. All rights
            reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px]">
            <span className="flex items-center gap-1.5 text-foreground font-medium">
              <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>{businessInfo.hours}</span>
            </span>
            <span>{businessInfo.hoursDays}</span>
            <span className="text-muted-foreground font-medium">
              Sunday: Emergency Calls Only
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
