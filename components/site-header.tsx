'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ArrowRight, Phone, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/theme-toggle';
import { businessInfo } from '@/lib/business-info';
import { SITE_LOGO_URL } from '@/lib/site-logo';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/service-areas', label: 'Service Areas' },
  { href: '/find-booking', label: 'Track Booking' },
  { href: '/contact', label: 'Contact' },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = React.useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) => pathname === href;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-200',
        scrolled || pathname !== '/'
          ? 'bg-background/90 backdrop-blur-xl border-b border-border/80 shadow-xs'
          : 'bg-background/70 backdrop-blur-md border-b border-border/40'
      )}
    >
      <div
        className={cn(
          'mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 transition-all duration-300',
          scrolled ? 'h-14' : 'h-16'
        )}
      >
        {/* Zone 1: Single Element Brand Wordmark */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <img
            src={SITE_LOGO_URL}
            alt="Sohan Pipeline's & Plumbing"
            className="h-8 w-8 rounded-lg object-cover ring-1 ring-border/60 transition-transform group-hover:scale-105"
          />
          <span className="font-display text-base font-bold tracking-tight text-foreground whitespace-nowrap">
            Sohan Pipeline&apos;s
          </span>
        </Link>

        {/* Zone 2: 4–6 Clean Nav Links with subtle hover underlines */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors relative py-1 whitespace-nowrap',
                isActive(link.href)
                  ? 'text-foreground font-semibold after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-primary'
                  : 'text-muted-foreground hover:text-foreground after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[2px] after:bg-primary after:transition-all after:duration-200'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Zone 3: 1–2 Primary Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <ThemeToggle />

          <Button asChild size="sm" className="hidden sm:inline-flex font-semibold text-xs h-9 px-4 whitespace-nowrap shadow-xs group">
            <Link href="/book">
              Book Service
              <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>

          {/* Mobile Navigation Drawer */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden h-9 w-9"
                aria-label="Open menu"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0 flex flex-col">
              <SheetTitle className="sr-only">Site Navigation</SheetTitle>
              <div className="p-5 border-b border-border/60 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2.5">
                  <img
                    src={SITE_LOGO_URL}
                    alt="Sohan Pipeline's & Plumbing"
                    className="h-8 w-8 rounded-lg object-cover ring-1 ring-border/50"
                  />
                  <span className="font-display font-bold text-sm">
                    Sohan Pipeline&apos;s
                  </span>
                </Link>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                      isActive(link.href)
                        ? 'text-foreground bg-muted font-semibold'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                    )}
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-40" />
                  </Link>
                ))}

                <Link
                  href="/faq"
                  className={cn(
                    'flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                    isActive('/faq')
                      ? 'text-foreground bg-muted font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                  )}
                >
                  <span>Frequently Asked Questions</span>
                  <ArrowRight className="h-3.5 w-3.5 opacity-40" />
                </Link>
              </div>

              <div className="p-4 border-t border-border/60 space-y-3 bg-card/60">
                <div className="flex items-center justify-between px-1 text-xs font-medium text-muted-foreground">
                  <span>Display Theme</span>
                  <ThemeToggle />
                </div>
                <Button asChild className="w-full font-semibold h-10 text-xs">
                  <Link href="/book" onClick={() => setOpen(false)}>
                    <Calendar className="mr-2 h-3.5 w-3.5" />
                    Book Service Online
                  </Link>
                </Button>
                <a
                  href={`tel:${businessInfo.phone}`}
                  className="flex items-center justify-center gap-2 text-xs font-semibold py-2.5 rounded-lg bg-muted text-foreground hover:text-primary transition-colors border border-border/60"
                >
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  Call {businessInfo.phoneDisplay}
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
