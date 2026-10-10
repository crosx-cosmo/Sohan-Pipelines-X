import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';

interface PageHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  className?: string;
  showBackLink?: boolean;
  breadcrumbPath?: string;
}

export function PageHeader({
  badge,
  title,
  description,
  className,
  showBackLink = false,
  breadcrumbPath,
}: PageHeaderProps) {
  const baseUrl = 'https://sohan-pipelines.netlify.app';
  const label = badge || title;

  const breadcrumbSchema = breadcrumbPath
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: baseUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: label,
            item: `${baseUrl}${breadcrumbPath}`,
          },
        ],
      }
    : null;

  return (
    <section className={cn('border-b border-border/60 bg-muted/20 relative overflow-hidden', className)}>
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="max-w-3xl">
          {/* Breadcrumb Navigation for SEO & UX */}
          {breadcrumbPath && (
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
              <span className="text-foreground font-medium truncate" aria-current="page">
                {label}
              </span>
            </nav>
          )}

          {showBackLink && !breadcrumbPath && (
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline mb-4"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Home
            </Link>
          )}

          {badge && (
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.065em] text-primary mb-3">
              <span>{badge}</span>
            </div>
          )}

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground text-balance leading-tight">
            {title}
          </h1>

          {description && (
            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl text-pretty font-normal tracking-[0.002em]">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
