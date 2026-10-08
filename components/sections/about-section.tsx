import Link from 'next/link';
import { Award, Users, Clock, ThumbsUp, Wrench, Shield, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { businessInfo } from '@/lib/business-info';

const stats = [
  { icon: Users, value: '500+', label: 'Happy Customers' },
  { icon: Wrench, value: '12+', label: 'Service Types' },
  { icon: Star, value: `${businessInfo.rating}`, label: 'Customer Rating' },
  { icon: Award, value: `${new Date().getFullYear() - businessInfo.established}+`, label: 'Years Experience' },
];

const values = [
  {
    icon: Shield,
    title: 'Honest Pricing',
    description: 'Transparent rates with no hidden charges. You approve the price before we start.',
  },
  {
    icon: Award,
    title: 'Skilled Workmanship',
    description: 'Years of hands-on experience with all types of plumbing systems and materials.',
  },
  {
    icon: Clock,
    title: 'On-Time Service',
    description: 'We respect your time. Fast response and punctual arrivals for every booking.',
  },
  {
    icon: Heart,
    title: 'Customer First',
    description: 'Your satisfaction is our priority. We clean up after every job, big or small.',
  },
];

export function AboutSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-4">
              <span>Our Track Record</span>
              <span aria-hidden="true">·</span>
              <span>Medinipur Master Plumbers</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground text-balance">
              {new Date().getFullYear() - businessInfo.established} Years of Trusted Plumbing in Midnapore
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              {businessInfo.name} has been serving the people of Midnapore, Dantan, and
              surrounding areas with reliable plumbing services. From small household
              repairs to large commercial installations, we bring the same level of
              dedication and quality to every project.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Our team understands the local plumbing challenges — from hard water
              issues to monsoon drainage problems — and we have the experience to solve
              them efficiently. We are proud of our {businessInfo.rating} rating from{' '}
              {businessInfo.reviewCount}+ satisfied customers.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="h-11 px-5 text-xs sm:text-sm font-semibold">
                <Link href="/book">Book a Service</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-11 px-5 text-xs sm:text-sm font-semibold">
                <a href={`tel:${businessInfo.phone}`}>Call {businessInfo.phoneDisplay}</a>
              </Button>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="rounded-2xl border border-border/60 bg-card p-5 transition-all hover:shadow-md hover:shadow-primary/5"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
                    <value.icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-display font-semibold text-sm mb-1">{value.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="relative rounded-3xl border border-border/60 bg-card p-6 sm:p-8 text-center overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'both' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 hover:opacity-100 transition-opacity" />
                <span className="relative flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary mb-4">
                  <stat.icon className="h-7 w-7" />
                </span>
                <p className="relative font-display text-3xl sm:text-4xl font-bold tracking-tight tabular-nums font-mono">
                  {stat.value}
                </p>
                <p className="relative text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
