'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Wrench,
  Droplets,
  Bath,
  Gauge,
  Clock,
  ArrowRight,
  CheckCircle2,
  Calculator,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { luxuryEasing } from '@/lib/motion';

export interface EstimatorServiceItem {
  id: string;
  name: string;
  price: number;
  time: string;
  icon: typeof Wrench;
  desc: string;
  badge?: string;
}

export const defaultEstimatorServices: EstimatorServiceItem[] = [
  {
    id: 'pipe-fitting-repair',
    name: 'Pipe Fitting & Leak Repair',
    price: 499,
    time: '1–3 hrs',
    icon: Wrench,
    desc: 'CPVC, UPVC & copper joint repair, acoustic leak pinpointing & high-pressure solvent welds.',
    badge: 'Popular',
  },
  {
    id: 'drainage-cleaning',
    name: 'Drainage & Sewer Jetting',
    price: 399,
    time: '1–2 hrs',
    icon: Droplets,
    desc: 'Motorized mechanical augers & hydro-jetting for floor traps, grease lines & main sewer lines.',
    badge: 'Fast Dispatch',
  },
  {
    id: 'bathroom-fitting',
    name: 'Sanitary & Bathroom Fitting',
    price: 799,
    time: '2–5 hrs',
    icon: Bath,
    desc: 'Wall-hung commodes, thermostatic diverters, shower mixers & complete sanitary renovations.',
    badge: 'Master Plumber',
  },
  {
    id: 'water-tank-installation',
    name: 'Water Tank & Booster Setup',
    price: 999,
    time: '3–6 hrs',
    icon: Gauge,
    desc: 'Multi-layer overhead storage tanks, automatic booster pumps & non-return bypass manifolds.',
    badge: 'Heavy Duty',
  },
];

interface ServiceEstimatorProps {
  className?: string;
  title?: string;
  subtitle?: string;
}

export function ServiceEstimator({
  className = '',
  title = 'Service Cost Estimator & Instant Dispatch Guide',
  subtitle = 'Select an engineering service below for transparent, upfront pricing breakdown and typical job turnaround.',
}: ServiceEstimatorProps) {
  const [activeTab, setActiveTab] = React.useState(0);
  const selectedService = defaultEstimatorServices[activeTab];

  return (
    <div
      id="pricing-estimator"
      className={`rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-crisp-lg gpu-accelerated ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/70">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-foreground leading-tight">
              {title}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>100% Upfront Approval</span>
          </span>
        </div>
      </div>

      {/* Service Selection Grid */}
      <div className="mt-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {defaultEstimatorServices.map((item, idx) => {
            const Icon = item.icon;
            const isSelected = activeTab === idx;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between cursor-pointer select-none group relative ${
                  isSelected
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/30 shadow-sm'
                    : 'border-border/70 bg-muted/30 hover:border-border hover:bg-muted/60'
                }`}
              >
                {item.badge && (
                  <span className="absolute top-3 right-3 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-muted/80 text-muted-foreground group-hover:text-foreground">
                    {item.badge}
                  </span>
                )}
                <div className="flex items-center gap-2.5 mb-3">
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground group-hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-foreground block font-mono">
                      ₹{item.price}
                    </span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.time}
                    </span>
                  </div>
                </div>
                <span className="font-semibold text-xs sm:text-sm text-foreground line-clamp-1 leading-snug">
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Service Detailed Breakdown Panel */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, ease: luxuryEasing }}
          className="p-5 sm:p-6 rounded-2xl bg-muted/40 border border-border/70 space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-primary block">
                Selected Discipline Breakdown
              </span>
              <h4 className="text-base sm:text-lg font-bold text-foreground">
                {selectedService.name}
              </h4>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] uppercase font-mono text-muted-foreground block">
                  Turnaround ETA
                </span>
                <span className="text-sm font-bold text-foreground flex items-center gap-1 tabular-nums font-mono">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  {selectedService.time}
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {selectedService.desc}
          </p>

          <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground block">
                  Base Inspection &amp; Labor
                </span>
                <span className="text-lg font-bold text-foreground tabular-nums font-mono">
                  From ₹{selectedService.price}
                </span>
              </div>
              <div className="hidden sm:block h-8 w-px bg-border/70" />
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>Includes 12-Month Joint Warranty</span>
              </div>
            </div>

            <Button asChild size="default" className="h-10 text-xs font-semibold px-5 rounded-xl shadow-xs">
              <Link href={`/book?service=${selectedService.id}`}>
                <span>Book This Service Online</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
