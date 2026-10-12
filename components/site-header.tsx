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
  ChevronRight,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { businessInfo } from '@/lib/business-info';
import { BrandLogo } from '@/components/brand-logo';
import { cn } from '@/lib/utils';
import {
  luxuryEasing,
  drawerSlideVariants,
  drawerBackdropVariants,
  transitionPresets,
} from '@/lib/motion';

const navLinks = [
  { href: '/services', label: 'Services', icon: Wrench, description: '12 Certified Engineering Disciplines' },
  { href: '/about', label: 'About', icon: Users, description: 'Master Plumber Experience & Standards' },
  { href: '/reviews', label: 'Reviews', icon: Star, description: `${businessInfo.reviewCount} Verified 5.0★ Testimonials` },
  { href: '/service-areas', label: 'Service Areas', icon: MapPin, description: 'Paschim & Purba Medinipur Coverage' },
  { href: '/find-booking', label: 'Track Booking', icon: Search, description: 'Live Status & Job Verification' },
  { href: '/contact', label: 'Contact', icon: MessageSquare, description: '24/7 Emergency Dispatch Line' },
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
          'fixed top-0 left-0 right-0 z-40 transition-colors duration-250',
          scrolled || pathname !== '/'
            ? 'bg-background/90 dark:bg-background/85 backdrop-blur-xl border-b border-border/80 shadow-xs'
            : 'bg-background/70 dark:bg-background/60 backdrop-blur-md border-b border-border/40'
        )}
      >
        <div
          className={cn(
            'mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 transition-[height] duration-250',
            scrolled ? 'h-14 sm:h-15' : 'h-16 sm:h-18'
          )}
        >
          {/* Brand Logo & Wordmark */}
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl p-1 -m-1"
          >
            <div className="shrink-0 transition-transform duration-200 group-hover:scale-105 active:scale-95">
              <BrandLogo size="md" />
            </div>
            <div className="flex flex-col leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="font-display text-sm sm:text-base font-bold tracking-tight text-foreground whitespace-nowrap group-hover:text-primary transition-colors duration-200">
                  Sohan Pipeline&apos;s
                </span>
                <span className="hidden sm:inline-flex px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-primary/10 text-primary border border-primary/20">
                  PRO
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground">
                Total Plumbing Solutions
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
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

          {/* Action Zone */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <ThemeToggle />

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

            {/* Direct High-Performance Mobile Menu Toggle (Zero-Lag Icon Transition) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
              className={cn(
                'lg:hidden flex h-9.5 w-9.5 items-center justify-center rounded-xl border transition-colors select-none cursor-pointer',
                mobileMenuOpen
                  ? 'border-primary/50 bg-primary/10 text-primary'
                  : 'border-border/80 bg-card text-foreground hover:bg-muted/60'
              )}
            >
              {mobileMenuOpen ? (
                <X className="h-4.5 w-4.5 transition-transform duration-200 rotate-0" />
              ) : (
                <Menu className="h-4.5 w-4.5 transition-transform duration-200" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Lag-Free Mobile Drawer (GPU Composited Surface & Clean Backdrop Scrim) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
            {/* Scrim Overlay */}
            <motion.div
              variants={drawerBackdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/70"
              aria-hidden="true"
            />

            {/* Solid Slide-out Drawer Panel */}
            <motion.aside
              variants={drawerSlideVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              style={{ willChange: 'transform' }}
              className="relative z-10 w-[84vw] max-w-sm h-full bg-card border-l border-border/90 shadow-2xl flex flex-col justify-between overflow-hidden gpu-accelerated"
            >
              {/* Drawer Top Header */}
              <div className="p-4 sm:p-5 border-b border-border/70 flex items-center justify-between bg-muted/20">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5"
                >
                  <BrandLogo size="sm" />
                  <div>
                    <span className="font-display font-bold text-sm text-foreground block leading-tight">
                      Sohan Pipeline&apos;s
                    </span>
                    <span className="text-[10px] text-muted-foreground block">
                      Engineering Hub
                    </span>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Navigation Items List */}
              <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center justify-between p-3 rounded-xl transition-colors duration-150',
                        active
                          ? 'bg-primary/10 text-primary font-semibold border border-primary/30'
                          : 'text-foreground hover:bg-muted/60 border border-transparent'
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={cn(
                            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors',
                            active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="truncate">
                          <span className="text-xs sm:text-sm font-semibold block leading-tight">
                            {link.label}
                          </span>
                          <span className="text-[10px] text-muted-foreground block truncate mt-0.5">
                            {link.description}
                          </span>
                        </div>
                      </div>

                      <ChevronRight
                        className={cn(
                          'h-4 w-4 shrink-0 transition-colors',
                          active ? 'text-primary' : 'text-muted-foreground'
                        )}
                      />
                    </Link>
                  );
                })}

                {/* FAQ Extra Link */}
                <Link
                  href="/faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-xl transition-colors duration-150',
                    isActive('/faq')
                      ? 'bg-primary/10 text-primary font-semibold border border-primary/30'
                      : 'text-foreground hover:bg-muted/60 border border-transparent'
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <HelpCircle className="h-4 w-4" />
                    </div>
                    <div className="truncate">
                      <span className="text-xs sm:text-sm font-semibold block leading-tight">
                        Help &amp; FAQ
                      </span>
                      <span className="text-[10px] text-muted-foreground block truncate mt-0.5">
                        Warranty, Rates &amp; Cleanout Procedures
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>
              </div>

              {/* Bottom Drawer Actions */}
              <div className="p-4 border-t border-border/70 space-y-3 bg-muted/30">
                <div className="flex items-center justify-between px-1 text-xs font-medium text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    <span>Theme Lighting</span>
                  </span>
                  <ThemeToggle />
                </div>

                <Button asChild className="w-full font-semibold h-11 text-xs rounded-xl shadow-md">
                  <Link href="/book" onClick={() => setMobileMenuOpen(false)}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Service Online
                  </Link>
                </Button>

                <a
                  href={`tel:${businessInfo.phone}`}
                  className="flex items-center justify-center gap-2 text-xs font-semibold py-2.5 rounded-xl bg-card text-foreground hover:text-primary transition-colors border border-border/70 shadow-xs"
                >
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  <span>Call Hotline: {businessInfo.phoneDisplay}</span>
                </a>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
