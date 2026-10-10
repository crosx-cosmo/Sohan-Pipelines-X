'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight, Phone, Clock, ShieldCheck, CheckCircle2, Calendar, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { businessInfo } from '@/lib/business-info';

export function CtaSection() {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary via-primary/95 to-sky-700 p-8 sm:p-12 lg:p-16 text-center text-primary-foreground shadow-crisp-lg render-crisp"
        >
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute inset-0 pointer-events-none opacity-25">
            <div className="absolute -top-24 left-1/4 h-80 w-80 rounded-full bg-white blur-3xl" />
            <div className="absolute -bottom-24 right-1/4 h-80 w-80 rounded-full bg-white blur-3xl" />
          </div>

          <div className="relative max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.065em] text-white">
              <CheckCircle2 className="h-3.5 w-3.5 text-white shrink-0" />
              <span>Daily Plumbing Crews Active Across Midnapore</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight text-balance">
              Facing An Urgent Leak Or Planning A Pipeline Project?
            </h2>

            <p className="text-white text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto text-pretty font-normal tracking-[0.002em]">
              Do not let hidden dampness, high-pressure bursts, or drainage backups compromise
              your home. Secure your appointment with master technicians today.
            </p>

            {/* High-Intent Dual CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3.5 justify-center items-center">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="w-full sm:w-auto"
              >
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto h-12 px-7 font-bold text-sm bg-white text-slate-900 hover:bg-white/95 rounded-xl shadow-xl shadow-black/10 group whitespace-nowrap"
                >
                  <Link href="/book">
                    <Calendar className="mr-2 h-4 w-4 text-primary" />
                    Schedule Service Online
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="w-full sm:w-auto"
              >
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-12 px-7 font-bold text-sm bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-md rounded-xl whitespace-nowrap"
                >
                  <a href={`tel:${businessInfo.phone}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    Hotline: {businessInfo.phoneDisplay}
                  </a>
                </Button>
              </motion.div>
            </div>

            {/* Reassurance Checklist */}
            <div className="pt-6 border-t border-white/20 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-white">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-white" />
                Zero Advance Booking Fee
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="h-4 w-4 text-white" />
                Payment Only After Satisfaction
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="h-4 w-4 text-white" />
                Mon–Sat: {businessInfo.hours}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
