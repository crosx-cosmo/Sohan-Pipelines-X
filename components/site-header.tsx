'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  X,
  ArrowRight,
  Phone,
  Calendar,
  Sparkles,
  Wrench,
  Users,
  Star,
  MapPin,
  Search,
  MessageSquare,
  Package,
  ChevronRight,
  HelpCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { CartTriggerButton } from '@/components/cart-trigger-button';
import { businessInfo } from '@/lib/business-info';
import { BrandLogo } from '@/components/brand-logo';
import { cn } from '@/lib/utils';
import {
  drawerSlideVariants,
  drawerBackdropVariants,
} from '@/lib/motion';

const navLinks = [
  { href: '/services', label: 'Services', icon: Wrench, description: '12 Certified Engineering Disciplines' },
  { href: '/about', label: 'About', icon: Users, description: 'Master Plumber Experience & Standards' },
  { href: '/reviews', label: 'Reviews', icon: Star, description: 'Verified Client Feedback & Ratings' },
  { href: '/service-areas', label: 'Service Areas', icon: MapPin, description: 'Paschim & Purba Medinipur Coverage' },
  { href: '/find-booking', label: 'Track Booking', icon: Search, description: 'Live Status & Job Verification' },
  { href: '/contact', label: 'Contact', icon: MessageSquare, description: '24/7 Emergency Dispatch Line' },
  { href: '/faq', label: 'Help & FAQ', icon: HelpCircle, description: 'Warranty, Rates & Cleanout Procedures' },
  { href: '/spare-parts', label: 'Spare Parts', icon: Package, description: 'Genuine Hardware & Wholesale Counter' },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  // Keyboard accessibility: Escape to close
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Non-janky body scroll lock preventing layout shifts
  React.useEffect(() => {
    if (!mobileMenuOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [mobileMenuOpen]);

  // Track window scroll with passive listener
  React.useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 16);
          ticking = false;
        });
        ticking = true;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-colors duration-200',
          scrolled || pathname !== '/'
            ? 'bg-background/95 dark:bg-background/90 backdrop-blur-xl border-b border-border/80 shadow-xs'
            : 'bg-background/75 dark:bg-background/65 backdrop-blur-md border-b border-border/40'
        )}
      >
        {/* Top Emergency Utility Strip (Desktop Only) */}
        <div className="hidden md:block border-b border-border/40 bg-muted/30 py-1 px-4 sm:px-6 lg:px-8 text-[11px] text-muted-foreground">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>24/7 Rapid Emergency Response Active</span>
              </span>
              <span className="text-border" aria-hidden="true">·</span>
              <span>Bahardaltitia, Keshrambha, Dantan (PIN 721451)</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 font-medium">
                <Clock className="h-3 w-3 text-primary" />
                <span>Typical On-Site ETA: 15–30 Mins</span>
              </span>
              <span className="text-border" aria-hidden="true">·</span>
              <a
                href={`tel:${businessInfo.phone}`}
                className="font-bold text-foreground hover:text-primary transition-colors flex items-center gap-1"
              >
                <Phone className="h-3 w-3 text-primary" />
                <span>Emergency: {businessInfo.phoneDisplay}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div
          className={cn(
            'mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 transition-[height] duration-200',
            scrolled ? 'h-14 sm:h-15' : 'h-16 sm:h-18'
          )}
        >
          {/* Brand Logo & Wordmark */}
          <Link
            href="/"
            className="flex items-center gap-2.5 sm:gap-3 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl p-1 -m-1"
          >
            <div className="shrink-0 transition-transform duration-200 group-hover:scale-105 active:scale-95">
              <BrandLogo size="md" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-sm sm:text-base font-bold tracking-tight text-foreground whitespace-nowrap group-hover:text-primary transition-colors duration-200">
                Sohan Pipeline&apos;s
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground whitespace-nowrap">
                Total Plumbing Solutions
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links with Animated Pill */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-muted/50 border border-border/60">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-colors whitespace-nowrap',
                    active
                      ? 'text-foreground font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="navActivePill"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-card shadow-xs border border-border/80 -z-10"
                    />
                  )}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Zone: Theme Toggle + Book CTA + Mobile Hamburger Trigger */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <CartTriggerButton />
            <ThemeToggle />

            {/* Desktop Quick Hotline CTA */}
            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden xl:inline-flex font-semibold text-xs h-9 px-3.5 rounded-xl border-border/80 hover:bg-muted/60"
            >
              <a href={`tel:${businessInfo.phone}`}>
                <Phone className="mr-1.5 h-3.5 w-3.5 text-primary" />
                <span>{businessInfo.phoneDisplay}</span>
              </a>
            </Button>

            {/* Desktop Primary CTA Button */}
            <Button
              asChild
              size="sm"
              className="hidden sm:inline-flex font-semibold text-xs h-9 px-4.5 rounded-xl shadow-sm shadow-primary/20 group"
            >
              <Link href="/book">
                <span>Book Service</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Button>

            {/* Mobile Hamburger / Close Trigger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              className={cn(
                'lg:hidden flex h-10 w-10 items-center justify-center rounded-xl border transition-colors select-none cursor-pointer',
                mobileMenuOpen
                  ? 'border-primary/50 bg-primary/10 text-primary'
                  : 'border-border/80 bg-card text-foreground hover:bg-muted/60 active:scale-95'
              )}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 transition-transform duration-200" />
              ) : (
                <Menu className="h-5 w-5 transition-transform duration-200" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Robust, Fully-Engineered Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div
            key="mobile-drawer-portal"
            className="fixed inset-0 z-50 lg:hidden flex justify-end pointer-events-auto overflow-hidden"
          >
            {/* Standalone Backdrop Overlay */}
            <motion.div
              key="mobile-drawer-backdrop"
              variants={drawerBackdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs cursor-pointer z-0"
              aria-hidden="true"
            />

            {/* Fixed Edge-Anchored Slide-In Panel (Responsive width, stays anchored to the right) */}
            <motion.aside
              key="mobile-drawer-panel"
              variants={drawerSlideVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              id="mobile-navigation-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation Menu"
              className="relative z-10 w-[86vw] max-w-[380px] min-w-[280px] h-full bg-card border-l border-border/80 shadow-2xl flex flex-col justify-between overflow-hidden shrink-0 select-none"
            >
              {/* Drawer Top Header with Logo and Close Button */}
              <div className="p-4 sm:p-5 border-b border-border/70 flex items-center justify-between bg-muted/20 shrink-0">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5"
                >
                  <BrandLogo size="sm" />
                  <div className="flex flex-col leading-tight">
                    <span className="font-display font-bold text-sm text-foreground">
                      Sohan Pipeline&apos;s
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Total Plumbing Solutions
                    </span>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/80 bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-colors cursor-pointer"
                  aria-label="Close navigation menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Navigation Body */}
              <div className="flex-1 overflow-y-auto overscroll-contain px-3.5 py-3 space-y-1.5">
                {/* 24/7 Dispatch Status Banner */}
                <div className="p-3 mb-2 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                    <div>
                      <span className="font-semibold text-foreground block leading-tight">
                        Emergency Service Active
                      </span>
                      <span className="text-[10px] text-muted-foreground block">
                        Bahardaltitia, Keshrambha, Dantan (PIN 721451)
                      </span>
                    </div>
                  </div>
                  <a
                    href={`tel:${businessInfo.phone}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs shrink-0"
                    aria-label="Call emergency hotline"
                  >
                    <Phone className="h-3.5 w-3.5" />
                  </a>
                </div>

                {/* Main Navigation Links */}
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center justify-between w-full p-3 rounded-xl transition-colors duration-150 group',
                        active
                          ? 'bg-primary/10 text-primary font-semibold border border-primary/30 shadow-xs'
                          : 'text-foreground hover:bg-muted/60 border border-transparent'
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div
                          className={cn(
                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors',
                            active
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted/80 text-muted-foreground group-hover:bg-muted group-hover:text-foreground'
                          )}
                        >
                          <Icon className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-sm font-semibold block leading-tight text-foreground group-hover:text-primary transition-colors">
                            {link.label}
                          </span>
                          <span className="text-[11px] text-muted-foreground block line-clamp-1 mt-0.5 font-normal">
                            {link.description}
                          </span>
                        </div>
                      </div>

                      <ChevronRight
                        className={cn(
                          'h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5',
                          active ? 'text-primary' : 'text-muted-foreground'
                        )}
                      />
                    </Link>
                  );
                })}
              </div>

              {/* Bottom Drawer Action Zone */}
              <div className="p-4 border-t border-border/70 space-y-2.5 bg-muted/30 shrink-0">
                <div className="flex items-center justify-between px-1 text-xs font-medium text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    <span>Display Mode</span>
                  </span>
                  <ThemeToggle />
                </div>

                <Button asChild className="w-full font-bold h-11 text-xs rounded-xl shadow-md">
                  <Link href="/book" onClick={() => setMobileMenuOpen(false)}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Service Online
                  </Link>
                </Button>

                <a
                  href={`tel:${businessInfo.phone}`}
                  className="flex items-center justify-center gap-2 text-xs font-semibold h-10.5 rounded-xl bg-card text-foreground hover:text-primary transition-colors border border-border/80 shadow-xs active:scale-[0.99]"
                >
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  <span>Call Hotline: {businessInfo.phoneDisplay}</span>
                </a>

                <div className="pt-1 text-center">
                  <span className="text-[10px] text-muted-foreground">
                    HQ: Bahardaltitia, Keshrambha, Dantan · PIN 721451
                  </span>
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
