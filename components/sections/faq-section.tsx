'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Search, HelpCircle, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { faqs, businessInfo } from '@/lib/business-info';
import { cn } from '@/lib/utils';

export function FaqSection() {
  const [openItems, setOpenItems] = React.useState<number[]>([0]); // First item open by default
  const [searchQuery, setSearchQuery] = React.useState('');

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const query = searchQuery.trim().toLowerCase();
  const filteredFaqs = query
    ? faqs.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query)
      )
    : faqs;

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const expandAll = () => {
    setOpenItems(filteredFaqs.map((_, i) => i));
  };

  const collapseAll = () => {
    setOpenItems([]);
  };

  return (
    <section className="py-16 lg:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Interactive Search & Expand Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search frequently asked questions (pricing, emergency, warranty)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 text-xs sm:text-sm bg-card border-border/80 rounded-xl"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto text-xs font-semibold">
            <button
              type="button"
              onClick={expandAll}
              className="px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
            >
              Expand All
            </button>
            <span className="text-border">·</span>
            <button
              type="button"
              onClick={collapseAll}
              className="px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Animated Expandable FAQ List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-border/60 bg-card text-muted-foreground">
              <HelpCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="font-semibold text-foreground text-sm">No matching questions found</p>
              <p className="text-xs mt-1">Have a specific question? Call Sohan Ji directly at {businessInfo.phoneDisplay}.</p>
            </div>
          ) : (
            filteredFaqs.map((faq, i) => {
              const isOpen = openItems.includes(i);
              return (
                <motion.div
                  key={faq.question}
                  layout="position"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    'rounded-2xl border transition-[border-color,box-shadow] duration-200 bg-card/95 dark:bg-card/85 overflow-hidden shadow-crisp-xs gpu-accelerated',
                    isOpen
                      ? 'border-primary/50 ring-1 ring-primary/20 shadow-crisp-sm'
                      : 'border-border/70 hover:border-border hover:shadow-crisp-xs'
                  )}
                >
                  {/* Expandable Trigger Header with Tap Physics */}
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.992 }}
                    onClick={() => toggleItem(i)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left select-none cursor-pointer group"
                    aria-expanded={isOpen}
                  >
                    <span
                      className={cn(
                        'font-display font-semibold text-sm sm:text-base pr-4 transition-colors leading-snug',
                        isOpen ? 'text-primary' : 'text-foreground group-hover:text-primary'
                      )}
                    >
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className={cn(
                        'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors',
                        isOpen ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground group-hover:text-foreground'
                      )}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.div>
                  </motion.button>

                  {/* Smooth Framer Motion Expandable Body */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                        style={{ willChange: 'height, opacity' }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40">
                          <p>{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Quick Contact Box */}
        <div className="p-6 rounded-2xl border border-border/70 bg-muted/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-display font-bold text-sm text-foreground">
              Have an emergency leak or custom project question?
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Talk directly with master plumber Sohan Ji for immediate guidance.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <Button asChild size="sm" variant="outline" className="flex-1 sm:flex-initial text-xs h-9 font-semibold rounded-xl">
              <a href={`tel:${businessInfo.phone}`}>
                <Phone className="mr-1.5 h-3.5 w-3.5 text-primary" />
                Call Hotline
              </a>
            </Button>
            <Button asChild size="sm" className="flex-1 sm:flex-initial text-xs h-9 font-semibold rounded-xl shadow-xs">
              <Link href="/book">
                Book Visit
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
