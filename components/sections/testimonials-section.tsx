import Link from 'next/link';
import { Star, Quote, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { testimonials, businessInfo } from '@/lib/business-info';

export function TestimonialsSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-3">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="tabular-nums font-mono font-bold text-foreground">{businessInfo.rating} Out of 5.0</span>
            <span aria-hidden="true" className="text-border">·</span>
            <span>{businessInfo.reviewCount} Verified Client Reviews</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Trusted by Homeowners &amp; Businesses in South Bengal
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2">
            Every review reflects real jobs completed by our licensed technicians in Midnapore, Dantan, and surrounding districts.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.name}
              className="relative border-border/70 bg-card rounded-2xl transition-all duration-300 hover:shadow-lg hover:border-primary/40 flex flex-col justify-between"
            >
              <CardContent className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1">
                      {Array.from({ length: testimonial.rating }).map((_, idx) => (
                        <Star key={idx} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Verified
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground mb-6">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs font-mono">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-foreground">{testimonial.name}</p>
                      <p className="text-[11px] text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground max-w-[110px] truncate">
                    {testimonial.service}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA banner */}
        <div className="mt-14 text-center rounded-2xl border border-border/70 bg-muted/30 p-6 sm:p-8 max-w-xl mx-auto space-y-4">
          <h3 className="font-display font-bold text-base text-foreground">
            Experience the Sohan Pipeline Standard
          </h3>
          <p className="text-xs text-muted-foreground">
            Schedule an expert visit today and join our satisfied clients across Midnapore.
          </p>
          <div className="flex items-center justify-center gap-3 pt-1">
            <Button asChild size="sm" className="h-10 text-xs font-semibold px-5">
              <Link href="/book">
                Book Service Online
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="h-10 text-xs font-semibold px-4">
              <a href={`tel:${businessInfo.phone}`}>Call {businessInfo.phoneDisplay}</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
