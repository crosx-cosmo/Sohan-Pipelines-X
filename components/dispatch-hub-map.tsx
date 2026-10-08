'use client';

import * as React from 'react';
import { motion } from 'motion/react';
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
    <div className="relative rounded-2xl border border-border/70 bg-card/90 dark:bg-card/70 backdrop-blur-xl p-5 sm:p-6 shadow-lg overflow-hidden">
      {/* Background Cartographic Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--foreground)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Header bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border/60 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-primary animate-pulse" />
            <h3 className="font-display font-bold text-sm sm:text-base text-foreground">
              South Bengal Regional Dispatch Grid
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Operational route matrix covering all 10 verified service municipalities &amp; townships
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>HQ Online: Keshrambha</span>
          </span>
        </div>
      </div>

      {/* SVG Network Map */}
      <div className="relative z-10 py-4">
        <svg
          viewBox="0 0 500 280"
          className="w-full h-auto max-h-[280px] overflow-visible select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Arterial Connecting Routes */}
          {/* Dantan -> Kharagpur -> Midnapore */}
          <line x1="210" y1="220" x2="250" y2="130" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeDasharray="4 4" opacity="0.6" />
          <line x1="250" y1="130" x2="230" y2="70" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeDasharray="4 4" opacity="0.6" />
          {/* Dantan -> Jhargram */}
          <line x1="210" y1="220" x2="90" y2="110" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="3 3" />
          {/* Midnapore -> Ghatal */}
          <line x1="230" y1="70" x2="340" y2="50" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="3 3" />
          {/* Dantan -> Egra -> Contai */}
          <line x1="210" y1="220" x2="320" y2="200" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeDasharray="4 4" opacity="0.6" />
          <line x1="320" y1="200" x2="390" y2="240" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
          {/* Egra -> Tamluk */}
          <line x1="320" y1="200" x2="430" y2="120" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="3 3" />
          {/* Kharagpur -> Tamluk */}
          <line x1="250" y1="130" x2="430" y2="120" stroke="hsl(var(--border))" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />

          {/* Animated dispatch signal pulses travelling from Dantan */}
          <motion.circle
            cx="210"
            cy="220"
            r="4"
            fill="hsl(var(--primary))"
            animate={{
              cx: [210, 250, 230],
              cy: [220, 130, 70],
              opacity: [1, 0.8, 0],
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.circle
            cx="210"
            cy="220"
            r="4"
            fill="hsl(var(--primary))"
            animate={{
              cx: [210, 320, 390],
              cy: [220, 200, 240],
              opacity: [1, 0.8, 0],
            }}
            transition={{ duration: 4, delay: 1, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Interactive Hub Markers */}
          {hubs.map((hub) => {
            const isSelected = hub.id === activeHub;
            const isHQ = hub.id === 'Dantan';

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
                    animate={{ scale: [1, 1.8, 1], opacity: [0.7, 0, 0.7] }}
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
                  className="transition-all duration-200 group-hover:scale-125"
                />

                {/* Center dot */}
                <circle
                  cx="0"
                  cy="0"
                  r={isHQ ? 4 : 2.5}
                  fill={isHQ ? '#ffffff' : isSelected ? 'hsl(var(--background))' : 'hsl(var(--primary))'}
                />

                {/* Label */}
                <text
                  x="0"
                  y={hub.y < 100 ? 18 : -14}
                  fontSize={isHQ ? '10' : '9'}
                  fontWeight={isHQ || isSelected ? '700' : '500'}
                  textAnchor="middle"
                  fill="currentColor"
                  className={`transition-colors font-mono ${
                    isSelected ? 'fill-primary font-bold' : isHQ ? 'fill-foreground font-bold' : 'fill-muted-foreground'
                  }`}
                >
                  {hub.id} {isHQ && '★'}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Hub Telemetry Card */}
      <div className="relative z-10 p-3.5 sm:p-4 rounded-xl bg-muted/40 border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground text-sm">
              {selected.name}
            </span>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-primary/10 text-primary font-semibold">
              {selected.district}
            </span>
          </div>
          <p className="text-muted-foreground text-xs mt-1">
            {selected.type} · Typical response: <strong className="text-foreground">{selected.eta}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{selected.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
