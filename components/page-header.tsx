import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  className?: string;
  showBackLink?: boolean;
}

export function PageHeader({
  badge,
  title,
  description,
  className,
  showBackLink = false,
}: PageHeaderProps) {
  return (
    <section className={cn('border-b border-border/60 bg-muted/20 relative overflow-hidden', className)}>
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="max-w-3xl">
          {showBackLink && (
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline mb-4"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Home
            </Link>
          )}

          {badge && (
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-3">
              <span>{badge}</span>
            </div>
          )}

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground text-balance leading-tight">
            {title}
          </h1>

          {description && (
            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl text-balance">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
