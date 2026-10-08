'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight, Star, ShieldCheck, MapPin, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { testimonials, businessInfo } from '@/lib/business-info';

export function HomeReviewsPreview() {
  return (
    <section className="py-20 lg:py-28 bg-card/40 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-2.5">
              <span>03. Client Experiences</span>
              <span aria-hidden="true">·</span>
              <span>100% Verified Feedback</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-4xl font-bold tracking-tight text-foreground text-balance">
              What Homeowners &amp; Businesses in Medinipur Say
            </h2>
            <p className="mt-3 text-base text-muted-foreground leading-relaxed text-balance">
              Every job is backed by a satisfaction guarantee. Here is what our clients
              experience when we service their homes and commercial facilities.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {/* Google Rating Block */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/70 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-1 font-bold text-base text-foreground tabular-nums font-mono">
                  {businessInfo.rating}
                  <span className="text-xs text-muted-foreground font-normal font-sans">/ 5.0</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {businessInfo.reviewCount} Verified Reviews
                </p>
              </div>
            </div>

            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex font-semibold text-xs h-10">
              <Link href="/reviews">
                View All Reviews
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Testimonials Grid (3 featured with motion) */}
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.slice(0, 3).map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card className="h-full border-border/70 bg-card rounded-2xl transition-all duration-200 hover:shadow-lg hover:border-primary/40 flex flex-col justify-between">
                <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex gap-0.5">
                        {Array.from({ length: testimonial.rating }).map((_, idx) => (
                          <Star key={idx} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Verified Job</span>
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed text-foreground/90 italic mb-3">
                      &ldquo;{testimonial.text}&rdquo;
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border/60">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-display font-bold text-sm text-foreground">
                        {testimonial.name}
                      </p>
                      <span className="text-xs text-muted-foreground font-medium">
                        {testimonial.service}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      {testimonial.role}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom Proof Strip */}
        <div className="mt-12 text-center flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-muted/30 border border-border/60 text-xs text-muted-foreground">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span>100% Satisfaction Guarantee on all plumbing labor &amp; materials</span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/reviews" className="font-semibold text-primary hover:underline">
              Read all {businessInfo.reviewCount} customer reviews →
            </Link>
            <span className="text-border" aria-hidden="true">·</span>
            <Link href="/book" className="font-semibold text-foreground hover:text-primary">
              Book your appointment now →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
