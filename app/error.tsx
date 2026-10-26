'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowLeft, RotateCcw, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MonsoonPipelineErrorScene } from '@/components/monsoon-pipeline-error-scene';
import { businessInfo } from '@/lib/business-info';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-[calc(100vh-4rem)] w-full bg-[#bae6fd] text-slate-900 overflow-hidden flex items-center justify-center px-4 py-16 select-none"
    >
      <MonsoonPipelineErrorScene mood="clear-daylight" errorCode="ERR" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/70 via-white/25 to-white/75"
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 max-w-lg w-full rounded-3xl border border-slate-200/90 bg-white/90 backdrop-blur-xl p-6 sm:p-8 text-center space-y-5 shadow-2xl"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-mono font-bold">
          <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          TEMPORARY LINE INTERRUPTION
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            Our Crew Is Restoring Flow on This Page
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            A temporary interruption occurred while loading this section. Click below to restore the connection or return to the main dashboard.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => reset()}
            size="lg"
            className="h-11 px-6 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-600/20"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Retry Connection
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-11 px-5 rounded-xl text-xs font-semibold border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
          >
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-11 px-4 rounded-xl text-xs font-semibold border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100"
          >
            <a href={`tel:${businessInfo.phone}`}>
              <Phone className="mr-1.5 h-3.5 w-3.5 text-amber-500" />
              Call Hotline
            </a>
          </Button>
        </div>
      </motion.div>
    </motion.section>
  );
}
