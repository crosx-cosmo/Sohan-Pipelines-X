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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { businessInfo } from '@/lib/business-info';
import { BrandLogo } from '@/components/brand-logo';
import { cn } from '@/lib/utils';

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

  const [prevPathname, setPrevPathname] = React.useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  // Lock body scroll while mobile menu is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Track window scroll
  React.useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
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
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled || pathname !== '/'
            ? 'bg-background/85 dark:bg-background/80 backdrop-blur-2xl border-b border-border/80 shadow-md shadow-black/5 dark:shadow-black/20'
            : 'bg-background/60 dark:bg-background/50 backdrop-blur-md border-b border-border/40'
        )}
      >
        <div
          className={cn(
            'mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 transition-all duration-300',
            scrolled ? 'h-14 sm:h-15' : 'h-16 sm:h-18'
          )}
        >
          {/* Brand Logo & Editorial Wordmark with micro-hover scale */}
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl p-1 -m-1 transition-transform"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="shrink-0"
            >
              <BrandLogo size="md" />
            </motion.div>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-sm sm:text-base font-bold tracking-tight text-foreground whitespace-nowrap group-hover:text-primary transition-colors duration-200">
                Sohan Pipeline&apos;s
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground">
                Total Plumbing Solutions
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links with Framer Motion Layout Pill */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-muted/40 border border-border/50 backdrop-blur-md">
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
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-card shadow-sm border border-border/70 -z-10"
                    />
                  )}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Zone: Theme Toggle + Book CTA + Mobile Trigger */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <ThemeToggle />

            {/* Desktop Primary CTA Button with interactive shimmer */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                asChild
                size="sm"
                className="hidden sm:inline-flex font-semibold text-xs h-9 px-4.5 rounded-xl shadow-md shadow-primary/15 group relative overflow-hidden"
              >
                <Link href="/book">
                  <span>Book Service</span>
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>

            {/* Animated Hamburger / Close Button */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-border/80 bg-card/80 text-foreground hover:bg-muted/60 transition-colors shadow-xs"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <X className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Menu className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer with Framer Motion backdrop & spring slide */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            />

            {/* Slide-out Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ willChange: 'transform' }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[84vw] max-w-sm bg-card/95 dark:bg-card/90 backdrop-blur-2xl border-l border-border/80 shadow-2xl flex flex-col justify-between lg:hidden overflow-hidden gpu-accelerated"
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-border/60 flex items-center justify-between">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5"
                >
                  <BrandLogo size="sm" />
                  <div>
                    <span className="font-display font-bold text-sm text-foreground block">
                      Sohan Pipeline&apos;s
                    </span>
                    <span className="text-[10px] text-muted-foreground block">
                      Engineering Navigation
                    </span>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Staggered Navigation Items */}
              <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1.5">
                {navLinks.map((link, idx) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 + idx * 0.03, duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center justify-between p-3 rounded-xl transition-colors duration-150',
                          active
                            ? 'bg-primary/10 text-primary font-semibold border border-primary/30 shadow-xs'
                            : 'text-foreground hover:bg-muted/60 hover:text-foreground border border-transparent'
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={cn(
                              'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                              active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="truncate">
                            <span className="text-xs sm:text-sm font-semibold block leading-tight">
                              {link.label}
                            </span>
                            <span className="text-[10px] text-muted-foreground block truncate mt-0.5 font-normal tracking-normal">
                              {link.description}
                            </span>
                          </div>
                        </div>

                        <ChevronRight
                          className={cn(
                            'h-4 w-4 shrink-0 transition-transform',
                            active ? 'text-primary' : 'text-muted-foreground'
                          )}
                        />
                      </Link>
                    </motion.div>
                  );
                })}

                {/* FAQ Extra Link */}
                <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 + navLinks.length * 0.03, duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                >
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
                          Frequently Asked Questions
                        </span>
                        <span className="text-[10px] text-muted-foreground block truncate mt-0.5 font-normal tracking-normal">
                          Warranty, Pricing &amp; Waterlines
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </Link>
                </motion.div>
              </div>

              {/* Drawer Bottom Controls */}
              <div className="p-4 border-t border-border/60 space-y-3 bg-muted/20">
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
