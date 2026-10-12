'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { Activity, Gauge, CheckCircle2, ShieldCheck, Zap, Sliders, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';
import { luxuryEasing } from '@/lib/motion';

export function HeroPipelineVisual() {
  const [activeValve, setActiveValve] = React.useState<number>(1);
  const [flowRate, setFlowRate] = React.useState<string>('4.2 BAR');

  const handleValveToggle = (valveId: number, pressure: string) => {
    setActiveValve(valveId);
    setFlowRate(pressure);
  };

  return (
    <div className="relative w-full rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-crisp-md overflow-hidden gpu-accelerated">
      {/* Precision Blueprint Grid Backdrop */}
      <div className="absolute inset-0 bg-grid-blueprint opacity-[0.25] dark:opacity-[0.2] pointer-events-none" />

      {/* Top Telemetry Header */}
      <div className="relative z-10 flex items-center justify-between pb-3 border-b border-border/70 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center h-6 w-6 rounded-lg bg-primary/10 text-primary">
            <Gauge className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="font-mono font-bold text-[11px] uppercase tracking-wider text-foreground block leading-tight">
              Hydraulic Topology Console
            </span>
            <span className="text-[10px] text-muted-foreground block">
              Interactive Flow Diagnostics · South Bengal Grid
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-[10px] font-semibold text-foreground flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/80 border border-border/70">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{flowRate}</span>
            <span className="text-muted-foreground">· NOMINAL</span>
          </span>
        </div>
      </div>

      {/* Interactive Valve Selector Controls */}
      <div className="relative z-10 grid grid-cols-3 gap-1.5 my-3 text-[11px] font-medium">
        <button
          type="button"
          onClick={() => handleValveToggle(1, '4.2 BAR')}
          className={cn(
            'px-2.5 py-1.5 rounded-lg border text-center transition-colors cursor-pointer',
            activeValve === 1
              ? 'bg-primary text-primary-foreground border-primary font-bold shadow-xs'
              : 'bg-muted/40 text-muted-foreground border-border/60 hover:text-foreground hover:bg-muted/80'
          )}
        >
          <span>V-01 Main Inflow</span>
        </button>
        <button
          type="button"
          onClick={() => handleValveToggle(2, '5.6 BAR')}
          className={cn(
            'px-2.5 py-1.5 rounded-lg border text-center transition-colors cursor-pointer',
            activeValve === 2
              ? 'bg-primary text-primary-foreground border-primary font-bold shadow-xs'
              : 'bg-muted/40 text-muted-foreground border-border/60 hover:text-foreground hover:bg-muted/80'
          )}
        >
          <span>V-02 Booster Line</span>
        </button>
        <button
          type="button"
          onClick={() => handleValveToggle(3, '3.8 BAR')}
          className={cn(
            'px-2.5 py-1.5 rounded-lg border text-center transition-colors cursor-pointer',
            activeValve === 3
              ? 'bg-primary text-primary-foreground border-primary font-bold shadow-xs'
              : 'bg-muted/40 text-muted-foreground border-border/60 hover:text-foreground hover:bg-muted/80'
          )}
        >
          <span>V-03 Pressure Port</span>
        </button>
      </div>

      {/* Vector Geometry Schematic */}
      <div className="relative z-10 py-2">
        <svg
          viewBox="0 0 520 180"
          className="w-full h-auto max-h-[165px] overflow-visible select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="mainlineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="50%" stopColor="#0369a1" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>

            <linearGradient id="boosterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c2410c" />
              <stop offset="50%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#fb923c" />
            </linearGradient>

            <filter id="crispShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.12" />
            </filter>
          </defs>

          {/* BACK RIG RAILS */}
          <line x1="20" y1="90" x2="500" y2="90" stroke="hsl(var(--border))" strokeWidth="10" strokeLinecap="round" opacity="0.5" />
          <line x1="260" y1="30" x2="260" y2="150" stroke="hsl(var(--border))" strokeWidth="6" strokeLinecap="round" opacity="0.5" />

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

          {/* ANIMATED FLUID FLOW PARTICLES */}
          <motion.line
            x1="30"
            y1="90"
            x2="490"
            y2="90"
            stroke="#e0f2fe"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="14 26"
            animate={{ strokeDashoffset: [0, -80] }}
            transition={{
              duration: activeValve === 2 ? 1.4 : activeValve === 3 ? 2.6 : 2.0,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          {/* VERTICAL BRANCH (UPWARD TO BOOSTER MANIFOLD) */}
          <line
            x1="160"
            y1="90"
            x2="160"
            y2="30"
            stroke="url(#boosterGrad)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <line
            x1="160"
            y1="30"
            x2="220"
            y2="30"
            stroke="url(#boosterGrad)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <motion.path
            d="M 160 90 L 160 30 L 220 30"
            stroke="#fed7aa"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="10 20"
            fill="none"
            animate={{ strokeDashoffset: [0, -60] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
          />

          {/* VERTICAL BRANCH 2 (DOWNWARD TO MAIN DRAINAGE) */}
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
          <motion.path
            d="M 360 90 L 360 150 L 420 150"
            stroke="#e0f2fe"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="12 24"
            fill="none"
            animate={{ strokeDashoffset: [0, -72] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: 'linear' }}
          />

          {/* NODE 1: MAIN INFLOW PORT */}
          <g
            transform="translate(60, 90)"
            className="cursor-pointer"
            onClick={() => handleValveToggle(1, '4.2 BAR')}
          >
            <circle cx="0" cy="0" r="14" fill="hsl(var(--card))" stroke="#0284c7" strokeWidth="2.5" filter="url(#crispShadow)" />
            <circle cx="0" cy="0" r="6" fill={activeValve === 1 ? '#0284c7' : '#94a3b8'} />
            <rect x="-44" y="-30" width="88" height="15" rx="3.5" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1" />
            <text x="0" y="-19" fontSize="8" fontWeight="700" textAnchor="middle" fill="hsl(var(--foreground))" className="font-mono">
              INFLOW · 4.2 BAR
            </text>
          </g>

          {/* NODE 2: OVERHEAD BOOSTER MANIFOLD */}
          <g
            transform="translate(220, 30)"
            className="cursor-pointer"
            onClick={() => handleValveToggle(2, '5.6 BAR')}
          >
            <circle cx="0" cy="0" r="12" fill="hsl(var(--card))" stroke="#ea580c" strokeWidth="2.5" filter="url(#crispShadow)" />
            <circle cx="0" cy="0" r="5" fill={activeValve === 2 ? '#ea580c' : '#94a3b8'} />
            <rect x="-50" y="-28" width="100" height="15" rx="3.5" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1" />
            <text x="0" y="-17" fontSize="8" fontWeight="700" textAnchor="middle" fill="hsl(var(--foreground))" className="font-mono">
              BOOSTER MANIFOLD
            </text>
          </g>

          {/* NODE 3: CENTER REGULATOR VALVE */}
          <g
            transform="translate(260, 90)"
            className="cursor-pointer"
            onClick={() => handleValveToggle(3, '3.8 BAR')}
          >
            <rect x="-14" y="-14" width="28" height="28" rx="6" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2" filter="url(#crispShadow)" />
            <circle cx="0" cy="0" r="7" fill={activeValve === 3 ? 'hsl(var(--primary))' : 'hsl(var(--primary)/0.25)'} />
            <rect x="-56" y="16" width="112" height="15" rx="3.5" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1" />
            <text x="0" y="27" fontSize="8" fontWeight="700" textAnchor="middle" fill="hsl(var(--foreground))" className="font-mono">
              REGULATOR V-03
            </text>
          </g>

          {/* NODE 4: DRAINAGE DISCHARGE */}
          <g transform="translate(420, 150)">
            <circle cx="0" cy="0" r="12" fill="hsl(var(--card))" stroke="#0284c7" strokeWidth="2.5" filter="url(#crispShadow)" />
            <circle cx="0" cy="0" r="5" fill="#0284c7" />
            <rect x="-52" y="15" width="104" height="15" rx="3.5" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1" />
            <text x="0" y="26" fontSize="8" fontWeight="700" textAnchor="middle" fill="hsl(var(--foreground))" className="font-mono">
              DRAIN JETTING PORT
            </text>
          </g>

          {/* End cap */}
          <g transform="translate(480, 90)">
            <rect x="-4" y="-10" width="8" height="20" rx="3" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
          </g>
        </svg>
      </div>

      {/* Real Diagnostics Status Bar */}
      <div className="relative z-10 grid grid-cols-3 gap-2 pt-2.5 border-t border-border/70 text-center font-mono">
        <div className="p-2 rounded-xl bg-muted/40 border border-border/60">
          <span className="block text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Static Pressure</span>
          <span className="text-xs sm:text-sm font-bold text-foreground tabular-nums">{flowRate}</span>
        </div>
        <div className="p-2 rounded-xl bg-muted/40 border border-border/60">
          <span className="block text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Flow Velocity</span>
          <span className="text-xs sm:text-sm font-bold text-foreground tabular-nums">1.8 m/s OK</span>
        </div>
        <div className="p-2 rounded-xl bg-muted/40 border border-border/60">
          <span className="block text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Joint Integrity</span>
          <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">100% Hermetic</span>
        </div>
      </div>
    </div>
  );
}
