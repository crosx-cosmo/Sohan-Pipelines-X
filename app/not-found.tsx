'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  Home,
  ArrowLeft,
  Calendar,
  Phone,
  Search,
  Wrench,
  MapPin,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { businessInfo } from '@/lib/business-info';
import { Plumber404Animation } from '@/components/plumber-404-animation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-12 sm:py-16 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[480px] w-[640px] rounded-full bg-primary/5 blur-3xl" />
        <div className="h-[360px] w-[400px] rounded-full bg-sky-500/5 blur-3xl -translate-y-24" />
      </div>

      <div className="max-w-3xl w-full mx-auto space-y-8">
        {/* Animated Visual Storytelling Component */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Plumber404Animation />
        </motion.div>

        {/* Narrative & Messaging */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-4 max-w-xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Pipeline Pressure Failure</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            404 — Looks like this connection didn’t go as planned.
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            The requested pipeline route or address was severed, rerouted, or never joined to the main supply line. Don&apos;t worry—our master plumbers are ready to reconnect your real pipes anytime!
          </p>
        </motion.div>

        {/* Primary and Secondary Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25 }}
          className="flex flex-wrap items-center justify-center gap-3 pt-2"
        >
          <Button asChild size="lg" className="h-11 px-6 font-semibold text-xs sm:text-sm shadow-md">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => router.back()}
            className="h-11 px-6 font-semibold text-xs sm:text-sm border-border/80 hover:bg-muted/60"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>

          <Button asChild variant="secondary" size="lg" className="h-11 px-5 font-semibold text-xs sm:text-sm">
            <Link href="/book">
              <Calendar className="mr-2 h-4 w-4 text-primary" />
              Book a Service
            </Link>
          </Button>
        </motion.div>

        {/* Quick Route Directory Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.35 }}
          className="mt-8 rounded-xl border border-border/70 bg-card/60 backdrop-blur-md p-4 sm:p-5 shadow-xs"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Wrench className="h-4 w-4 text-primary shrink-0" />
              <span>Looking for quick assistance?</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              <Link
                href="/services"
                className="text-foreground hover:text-primary transition-colors font-medium flex items-center gap-1"
              >
                <span>Services Catalog</span>
              </Link>
              <span className="text-border">·</span>
              <Link
                href="/service-areas"
                className="text-foreground hover:text-primary transition-colors font-medium flex items-center gap-1"
              >
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span>Service Areas</span>
              </Link>
              <span className="text-border">·</span>
              <Link
                href="/find-booking"
                className="text-foreground hover:text-primary transition-colors font-medium flex items-center gap-1"
              >
                <Search className="h-3 w-3 text-muted-foreground" />
                <span>Find My Booking</span>
              </Link>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>24/7 Emergency Burst Pipe & Leak Dispatch:</span>
            <a
              href={`tel:${businessInfo.phone}`}
              className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>{businessInfo.phoneDisplay} ({businessInfo.hours})</span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
