'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Navigation, Radio, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import { businessInfo } from '@/lib/business-info';

export function DispatchHubMap() {
  const [activeHub, setActiveHub] = React.useState<string>('Dantan');

  const hubs = [
    {
      id: 'Dantan',
      name: 'Dantan & Keshrambha',
      district: 'Paschim Medinipur',
      type: 'Headquarters & Primary Depot',
      eta: 'Immediate (15–30 min)',
      status: 'Active · On Duty',
      x: 210,
      y: 220,
    },
    {
      id: 'Kharagpur',
      name: 'Kharagpur Railway & IIT Hub',
      district: 'Paschim Medinipur',
      type: 'Industrial & Residential Line',
      eta: '30–45 min dispatch',
      status: 'Active · Available',
      x: 250,
      y: 130,
    },
    {
      id: 'Midnapore',
      name: 'Midnapore Town Division',
      district: 'Paschim Medinipur',
      type: 'Administrative Headquarters',
      eta: '45–60 min dispatch',
      status: 'Active · Available',
      x: 230,
      y: 70,
    },
    {
      id: 'Jhargram',
      name: 'Jhargram Branch Route',
      district: 'Paschim Medinipur border',
      type: 'Regional Service Fleet',
      eta: 'Scheduled visit',
      status: 'Available on slot',
      x: 90,
      y: 110,
    },
    {
      id: 'Ghatal',
      name: 'Ghatal & Chandrakona',
      district: 'Paschim Medinipur (North)',
      type: 'High-Volume Drainage Hub',
      eta: 'Scheduled booking',
      status: 'Available on slot',
      x: 340,
      y: 50,
    },
    {
      id: 'Egra',
      name: 'Egra Township',
      district: 'Purba Medinipur',
      type: 'Subdivisional Depot Route',
      eta: '45–60 min dispatch',
      status: 'Active · Available',
      x: 320,
      y: 200,
    },
    {
      id: 'Contai',
      name: 'Contai (Kanthi) Hub',
      district: 'Purba Medinipur',
      type: 'Coastal Sanitary Division',
      eta: 'Daily scheduled slots',
      status: 'Active · Available',
      x: 390,
      y: 240,
    },
    {
      id: 'Tamluk',
      name: 'Tamluk Port & Town',
      district: 'Purba Medinipur',
      type: 'Commercial Pipeline Unit',
      eta: 'Daily scheduled slots',
      status: 'Active · Available',
      x: 430,
      y: 120,
    },
  ];

  const selected = hubs.find((h) => h.id === activeHub) || hubs[0];

  return (
    <div className="relative rounded-2xl border border-border/80 bg-card/95 dark:bg-card/85 backdrop-blur-xl p-5 sm:p-6 shadow-crisp-md overflow-hidden render-crisp">
      {/* Background Cartographic Grid with crisp hairline lines */}
      <div className="absolute inset-0 bg-grid-blueprint opacity-[0.3] dark:opacity-[0.2] pointer-events-none" />

      {/* Header bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border/70 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-5 w-5 rounded-md bg-primary/10 text-primary">
              <Navigation className="h-3.5 w-3.5" />
            </div>
            <h3 className="font-display font-bold text-sm sm:text-base text-foreground">
              South Bengal Regional Dispatch Grid
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Operational route matrix covering all 10 verified service municipalities &amp; townships
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-500/25">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>HQ Online: Keshrambha</span>
          </span>
        </div>
      </div>

      {/* SVG Network Map with High-Resolution Geometry */}
      <div className="relative z-10 py-4">
        <svg
          viewBox="0 0 500 280"
          className="w-full h-auto max-h-[290px] overflow-visible select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          shapeRendering="geometricPrecision"
          textRendering="geometricPrecision"
        >
          <defs>
            <filter id="hubDrop" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.18" />
            </filter>
          </defs>

          {/* Arterial Connecting Routes with High Contrast */}
          {/* Dantan -> Kharagpur -> Midnapore */}
          <line x1="210" y1="220" x2="250" y2="130" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeDasharray="5 5" opacity="0.8" />
          <line x1="250" y1="130" x2="230" y2="70" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeDasharray="5 5" opacity="0.8" />
          {/* Dantan -> Jhargram */}
          <line x1="210" y1="220" x2="90" y2="110" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="4 4" opacity="0.7" />
          {/* Midnapore -> Ghatal */}
          <line x1="230" y1="70" x2="340" y2="50" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="4 4" opacity="0.7" />
          {/* Dantan -> Egra -> Contai */}
          <line x1="210" y1="220" x2="320" y2="200" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeDasharray="5 5" opacity="0.8" />
          <line x1="320" y1="200" x2="390" y2="240" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="5 5" opacity="0.7" />
          {/* Egra -> Tamluk */}
          <line x1="320" y1="200" x2="430" y2="120" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="4 4" opacity="0.7" />
          {/* Kharagpur -> Tamluk */}
          <line x1="250" y1="130" x2="430" y2="120" stroke="hsl(var(--border))" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />

          {/* Animated dispatch signal pulses travelling from Dantan */}
          <motion.circle
            cx="210"
            cy="220"
            r="4.5"
            fill="hsl(var(--primary))"
            stroke="#ffffff"
            strokeWidth="1.5"
            animate={{
              cx: [210, 250, 230],
              cy: [220, 130, 70],
              opacity: [1, 0.9, 0],
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.circle
            cx="210"
            cy="220"
            r="4.5"
            fill="hsl(var(--primary))"
            stroke="#ffffff"
            strokeWidth="1.5"
            animate={{
              cx: [210, 320, 390],
              cy: [220, 200, 240],
              opacity: [1, 0.9, 0],
            }}
            transition={{ duration: 4, delay: 1, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Interactive Hub Markers with High-Contrast Pill Badges */}
          {hubs.map((hub) => {
            const isSelected = hub.id === activeHub;
            const isHQ = hub.id === 'Dantan';
            const labelAbove = hub.y > 100;

            return (
              <g
                key={hub.id}
                transform={`translate(${hub.x}, ${hub.y})`}
                onClick={() => setActiveHub(hub.id)}
                className="cursor-pointer group"
              >
                {/* Outer ripple for HQ */}
                {isHQ && (
                  <motion.circle
                    cx="0"
                    cy="0"
                    r="16"
                    stroke="hsl(var(--primary))"
                    strokeWidth="1.5"
                    fill="none"
                    animate={{ scale: [1, 1.6, 1], opacity: [0.8, 0, 0.8] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  />
                )}

                {/* Node Target Circle */}
                <circle
                  cx="0"
                  cy="0"
                  r={isHQ ? 9 : 7}
                  fill={isHQ ? 'hsl(var(--primary))' : isSelected ? 'hsl(var(--foreground))' : 'hsl(var(--card))'}
                  stroke={isHQ ? 'hsl(var(--primary))' : 'hsl(var(--foreground))'}
                  strokeWidth={2}
                  filter="url(#hubDrop)"
                  className="transition-transform duration-200 group-hover:scale-125"
                />

                {/* Center dot */}
                <circle
                  cx="0"
                  cy="0"
                  r={isHQ ? 4 : 2.5}
                  fill={isHQ ? '#ffffff' : isSelected ? 'hsl(var(--background))' : 'hsl(var(--primary))'}
                />

                {/* High-Contrast Label Pill Backdrop */}
                <g transform={`translate(0, ${labelAbove ? -16 : 18})`}>
                  <rect
                    x="-34"
                    y="-9"
                    width="68"
                    height="18"
                    rx="4"
                    fill="hsl(var(--card))"
                    stroke={isSelected ? 'hsl(var(--primary))' : isHQ ? 'hsl(var(--foreground))' : 'hsl(var(--border))'}
                    strokeWidth={isSelected ? 1.5 : 1}
                    filter="url(#hubDrop)"
                  />
                  <text
                    x="0"
                    y="3"
                    fontSize={isHQ ? '9' : '8.5'}
                    fontWeight={isHQ || isSelected ? '700' : '600'}
                    textAnchor="middle"
                    fill="currentColor"
                    className={`font-mono ${
                      isSelected
                        ? 'fill-primary font-bold'
                        : isHQ
                        ? 'fill-foreground font-bold'
                        : 'fill-foreground/90'
                    }`}
                  >
                    {hub.id} {isHQ && '★'}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Hub Telemetry Card with High Contrast & Animated Presence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 p-4 rounded-xl bg-card border border-border/80 shadow-crisp-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground text-sm">
                {selected.name}
              </span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-primary/10 text-primary font-bold border border-primary/20">
                {selected.district}
              </span>
            </div>
            <p className="text-muted-foreground text-xs mt-1">
              {selected.type} · Typical response: <strong className="text-foreground font-semibold">{selected.eta}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-bold text-xs px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{selected.status}</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
