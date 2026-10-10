'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { Activity, Gauge, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export function HeroPipelineVisual() {
  const [activeValve, setActiveValve] = React.useState<number>(1);

  return (
    <div className="relative w-full rounded-2xl border border-border/80 bg-card/95 dark:bg-card/85 backdrop-blur-xl p-4 sm:p-5 shadow-crisp-md overflow-hidden render-crisp">
      {/* Blueprint grid background */}
      <div className="absolute inset-0 bg-grid-blueprint opacity-[0.35] dark:opacity-[0.25] pointer-events-none" />

      {/* Header bar */}
      <div className="relative z-10 flex items-center justify-between pb-3 border-b border-border/70 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center h-5 w-5 rounded-md bg-primary/10 text-primary">
            <Gauge className="h-3.5 w-3.5" />
          </div>
          <span className="font-mono font-bold text-[11px] uppercase tracking-wider text-foreground">
            Pipeline Hydraulic Topology
          </span>
        </div>
        <span className="font-mono text-[10px] font-semibold text-muted-foreground flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted/60 border border-border/60">
          <Activity className="h-3 w-3 text-primary" />
          <span className="text-foreground">4.2 BAR</span>
          <span className="text-muted-foreground">· FLOW ACTIVE</span>
        </span>
      </div>

      {/* SVG Pipeline Diagram with High-Precision Vector Geometry */}
      <div className="relative z-10 py-3">
        <svg
          viewBox="0 0 520 180"
          className="w-full h-auto max-h-[170px] overflow-visible select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          shapeRendering="geometricPrecision"
          textRendering="geometricPrecision"
        >
          <defs>
            {/* Pipe gradients with high-contrast luminance stops */}
            <linearGradient id="mainlineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="50%" stopColor="#0369a1" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>

            <linearGradient id="copperGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c2410c" />
              <stop offset="50%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#fb923c" />
            </linearGradient>

            <linearGradient id="pipeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.8" />
            </linearGradient>

            <filter id="crispDrop" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* BACK RIG RAILS */}
          <line x1="20" y1="90" x2="500" y2="90" stroke="hsl(var(--border))" strokeWidth="12" strokeLinecap="round" opacity="0.6" />
          <line x1="260" y1="30" x2="260" y2="150" stroke="hsl(var(--border))" strokeWidth="8" strokeLinecap="round" opacity="0.6" />

          {/* MAIN SUPPLY PIPELINE (HORIZONTAL) */}
          <line
            x1="30"
            y1="90"
            x2="490"
            y2="90"
            stroke="url(#mainlineGrad)"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* ANIMATED FLUID PULSE PARTICLES (LEFT TO RIGHT) */}
          <motion.line
            x1="30"
            y1="90"
            x2="490"
            y2="90"
            stroke="#e0f2fe"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="16 28"
            animate={{ strokeDashoffset: [0, -88] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
          />

          {/* VERTICAL BRANCH 1 (UPWARD TO WATER TANK & ROOF) */}
          <line
            x1="160"
            y1="90"
            x2="160"
            y2="30"
            stroke="url(#copperGrad)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <line
            x1="160"
            y1="30"
            x2="220"
            y2="30"
            stroke="url(#copperGrad)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Fluid flow upward */}
          <motion.path
            d="M 160 90 L 160 30 L 220 30"
            stroke="#ffedd5"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="12 24"
            fill="none"
            animate={{ strokeDashoffset: [0, -72] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
          />

          {/* VERTICAL BRANCH 2 (DOWNWARD TO DRAINAGE & SEWER) */}
          <line
            x1="360"
            y1="90"
            x2="360"
            y2="150"
            stroke="url(#mainlineGrad)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <line
            x1="360"
            y1="150"
            x2="420"
            y2="150"
            stroke="url(#mainlineGrad)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Fluid flow downward */}
          <motion.path
            d="M 360 90 L 360 150 L 420 150"
            stroke="#e0f2fe"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="12 24"
            fill="none"
            animate={{ strokeDashoffset: [0, -72] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
          />

          {/* PIPELINE VALVE NODES & HUBS WITH HIGH-CONTRAST BACKDROPS */}
          {/* Node 1: Inflow Grid (Dantan Hub) */}
          <g transform="translate(60, 90)">
            <circle cx="0" cy="0" r="14" fill="hsl(var(--card))" stroke="#0284c7" strokeWidth="2.5" filter="url(#crispDrop)" />
            <circle cx="0" cy="0" r="6" fill="#0284c7" />
            <motion.circle
              cx="0"
              cy="0"
              r="14"
              stroke="#38bdf8"
              strokeWidth="1.5"
              fill="none"
              animate={{ scale: [1, 1.35, 1], opacity: [0.9, 0, 0.9] }}
              transition={{ duration: 2.2, repeat: Infinity }}
            />
            {/* High-contrast label backdrop */}
            <rect x="-44" y="-30" width="88" height="15" rx="3.5" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1" />
            <text x="0" y="-19" fontSize="8" fontWeight="700" textAnchor="middle" fill="hsl(var(--foreground))" className="font-mono">
              INFLOW · 4.2 BAR
            </text>
          </g>

          {/* Node 2: Overhead Booster Branch (Midnapore Hub) */}
          <g transform="translate(220, 30)">
            <circle cx="0" cy="0" r="12" fill="hsl(var(--card))" stroke="#ea580c" strokeWidth="2.5" filter="url(#crispDrop)" />
            <circle cx="0" cy="0" r="5" fill="#ea580c" />
            <rect x="-50" y="-28" width="100" height="15" rx="3.5" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1" />
            <text x="0" y="-17" fontSize="8" fontWeight="700" textAnchor="middle" fill="hsl(var(--foreground))" className="font-mono">
              BOOSTER MANIFOLD
            </text>
          </g>

          {/* Node 3: Center Pressure Valve (Regulator) */}
          <g transform="translate(260, 90)">
            <rect x="-14" y="-14" width="28" height="28" rx="6" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2" filter="url(#crispDrop)" />
            <circle cx="0" cy="0" r="7" fill="hsl(var(--primary)/0.25)" />
            <path d="M -4 0 L 4 0 M 0 -4 L 0 4" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" />
            <rect x="-56" y="16" width="112" height="15" rx="3.5" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1" />
            <text x="0" y="27" fontSize="8" fontWeight="700" textAnchor="middle" fill="hsl(var(--foreground))" className="font-mono">
              VALVE V-01 (BALANCED)
            </text>
          </g>

          {/* Node 4: Drainage Discharge (Kharagpur Hub) */}
          <g transform="translate(420, 150)">
            <circle cx="0" cy="0" r="12" fill="hsl(var(--card))" stroke="#0284c7" strokeWidth="2.5" filter="url(#crispDrop)" />
            <circle cx="0" cy="0" r="5" fill="#0284c7" />
            <rect x="-52" y="15" width="104" height="15" rx="3.5" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1" />
            <text x="0" y="26" fontSize="8" fontWeight="700" textAnchor="middle" fill="hsl(var(--foreground))" className="font-mono">
              DRAIN JETTING PORT
            </text>
          </g>

          {/* End cap right */}
          <g transform="translate(480, 90)">
            <rect x="-4" y="-10" width="8" height="20" rx="3" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
          </g>
        </svg>
      </div>

      {/* Telemetry Status Bar with High-Contrast Engineering Readouts */}
      <div className="relative z-10 grid grid-cols-3 gap-2.5 pt-2.5 border-t border-border/70 text-center font-mono">
        <div className="p-2.5 rounded-xl bg-card border border-border/70 shadow-crisp-xs">
          <span className="block text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Static Pressure</span>
          <span className="text-xs sm:text-sm font-bold text-foreground tabular-nums">62.4 PSI</span>
        </div>
        <div className="p-2.5 rounded-xl bg-card border border-border/70 shadow-crisp-xs">
          <span className="block text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Flow Velocity</span>
          <span className="text-xs sm:text-sm font-bold text-foreground tabular-nums">1.8 m/s OK</span>
        </div>
        <div className="p-2.5 rounded-xl bg-card border border-border/70 shadow-crisp-xs">
          <span className="block text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Joint Integrity</span>
          <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">100% Hermetic</span>
        </div>
      </div>
    </div>
  );
}
