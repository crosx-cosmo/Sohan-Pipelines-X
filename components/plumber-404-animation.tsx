'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Droplets, Gauge, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Phase = 'inspect' | 'align' | 'slip' | 'burst' | 'react';

export function Plumber404Animation() {
  const [phase, setPhase] = React.useState<Phase>('inspect');
  const [cycle, setCycle] = React.useState(0);
  const [isManualPaused, setIsManualPaused] = React.useState(false);

  // Controlled animation sequence:
  // 1. inspect (0 - 1.2s)
  // 2. align (1.2 - 2.8s)
  // 3. slip (2.8 - 3.4s)
  // 4. burst (3.4 - 5.4s)
  // 5. react (5.4 - 7.5s)
  React.useEffect(() => {
    if (isManualPaused) return;

    const t1 = setTimeout(() => setPhase('align'), 1200);
    const t2 = setTimeout(() => setPhase('slip'), 2800);
    const t3 = setTimeout(() => setPhase('burst'), 3400);
    const t4 = setTimeout(() => setPhase('react'), 5200);
    const t5 = setTimeout(() => {
      setPhase('inspect');
      setCycle((c) => c + 1);
    }, 8000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [cycle, isManualPaused]);

  const handleReplay = () => {
    setIsManualPaused(false);
    setPhase('inspect');
    setCycle((c) => c + 1);
  };

  // Dynamic values depending on phase
  // Left pipe displacement toward center
  const leftPipeOffset = phase === 'inspect' ? 0 : phase === 'align' ? 18 : phase === 'slip' ? 24 : -6;
  // Right pipe displacement toward center
  const rightPipeOffset = phase === 'inspect' ? 0 : phase === 'align' ? -18 : phase === 'slip' ? -24 : 6;
  // Plumber character shake/effort
  const plumberY = phase === 'align' ? -3 : phase === 'slip' ? -5 : phase === 'burst' ? 4 : 0;
  // Pressure gauge angle: 0deg normal, 65deg high, 120deg critical
  const gaugeNeedleAngle =
    phase === 'inspect' ? -30 : phase === 'align' ? 35 : phase === 'slip' ? 85 : phase === 'burst' ? 115 : -10;

  return (
    <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center select-none">
      {/* Visual Canvas Container with Glass Surface */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[380px] rounded-2xl border border-border/70 dark:border-border/50 bg-radial from-card/90 via-card/50 to-muted/30 backdrop-blur-xl shadow-xl dark:shadow-2xl overflow-hidden p-2 sm:p-4 flex items-center justify-center">
        {/* Ambient background pipeline grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--foreground)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.03)_1px,transparent_1px)] bg-[size:28px_28px] opacity-60" />

        {/* Ambient failure vignette glow */}
        <motion.div
          animate={{
            opacity: phase === 'burst' ? 0.35 : 0.08,
            scale: phase === 'burst' ? 1.1 : 0.95,
          }}
          transition={{ duration: 0.4 }}
          className="pointer-events-none absolute inset-0 bg-radial from-sky-500/20 via-primary/10 to-transparent blur-2xl"
        />

        {/* Main SVG Scene */}
        <svg
          viewBox="0 0 700 420"
          className="relative z-10 w-full h-full max-h-[360px]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Pipe Metallic Linear Gradients */}
            <linearGradient id="pipeSteel" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="30%" stopColor="#94a3b8" />
              <stop offset="60%" stopColor="#cbd5e1" />
              <stop offset="90%" stopColor="#334155" />
            </linearGradient>

            <linearGradient id="pipeCopper" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#9a3412" />
              <stop offset="25%" stopColor="#ea580c" />
              <stop offset="55%" stopColor="#fdba74" />
              <stop offset="85%" stopColor="#7c2d12" />
            </linearGradient>

            <linearGradient id="brassValve" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ca8a04" />
              <stop offset="50%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#854d0e" />
            </linearGradient>

            {/* Water Spray Gradients */}
            <radialGradient id="waterBurstGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#0284c7" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.1" />
            </radialGradient>

            <linearGradient id="waterJetGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.1" />
            </linearGradient>

            {/* Plumber Uniform Gradient */}
            <linearGradient id="plumberSuit" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="50%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>

            {/* Safety Helmet Gradient */}
            <linearGradient id="hardHat" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="60%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>

            {/* Skin Tone */}
            <linearGradient id="skin" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e0a87a" />
              <stop offset="100%" stopColor="#c58652" />
            </linearGradient>

            {/* Drop Shadow filter */}
            <filter id="shadowGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* BACK WALL ARCHITECTURE PIPES */}
          <g opacity="0.4" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/40">
            <line x1="40" y1="90" x2="660" y2="90" strokeDasharray="6 6" />
            <circle cx="120" cy="90" r="14" strokeWidth="2" />
            <circle cx="580" cy="90" r="14" strokeWidth="2" />
          </g>

          {/* LEFT WALL PIPELINE ENTRY */}
          <g filter="url(#shadowGlow)">
            {/* Wall Flange Left */}
            <rect x="20" y="210" width="16" height="56" rx="4" fill="#334155" />
            <rect x="22" y="214" width="4" height="48" fill="#64748b" />
            
            {/* Pressure Gauge Station on Left Pipe */}
            <g transform="translate(100, 150)">
              <rect x="18" y="40" width="8" height="26" fill="url(#brassValve)" />
              {/* Dial body */}
              <circle cx="22" cy="24" r="26" fill="#0f172a" stroke="#cbd5e1" strokeWidth="3" />
              <circle cx="22" cy="24" r="22" fill="#f8fafc" />
              {/* Dial markings */}
              <path d="M 8 24 A 14 14 0 0 1 36 24" stroke="#94a3b8" strokeWidth="2" fill="none" />
              <path d="M 28 14 A 14 14 0 0 1 36 24" stroke="#ef4444" strokeWidth="3" fill="none" />
              {/* Gauge needle animated */}
              <motion.g
                animate={{ rotate: gaugeNeedleAngle }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{ originX: '22px', originY: '24px' }}
              >
                <line x1="22" y1="24" x2="22" y2="10" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" />
                <circle cx="22" cy="24" r="3" fill="#0f172a" />
              </motion.g>
              <text x="22" y="32" fontSize="6" fontWeight="bold" textAnchor="middle" fill="#475569">
                {phase === 'burst' ? 'BURST' : phase === 'slip' ? 'MAX PSI' : 'PSI'}
              </text>
            </g>

            {/* Left Gate Valve Wheel */}
            <g transform="translate(145, 185)">
              <rect x="6" y="16" width="6" height="18" fill="url(#brassValve)" />
              <ellipse cx="9" cy="14" rx="14" ry="4" fill="url(#brassValve)" stroke="#78350f" strokeWidth="1.5" />
            </g>
          </g>

          {/* LEFT MOVABLE PIPE SECTION */}
          <motion.g
            animate={{ x: leftPipeOffset }}
            transition={{
              type: 'spring',
              stiffness: phase === 'burst' ? 500 : 250,
              damping: phase === 'burst' ? 18 : 22,
            }}
          >
            {/* Main copper pipe body from left */}
            <path
              d="M 36 226 L 255 226 A 4 4 0 0 1 259 230 L 259 246 A 4 4 0 0 1 255 250 L 36 250 Z"
              fill="url(#pipeCopper)"
              stroke="#7c2d12"
              strokeWidth="1.5"
            />
            {/* Pipe highlights */}
            <line x1="36" y1="233" x2="255" y2="233" stroke="#ffedd5" strokeWidth="2" strokeOpacity="0.7" />
            <line x1="36" y1="244" x2="255" y2="244" stroke="#431407" strokeWidth="1.5" strokeOpacity="0.5" />

            {/* Left Pipe Flange / Coupling Head */}
            <rect x="254" y="218" width="12" height="40" rx="3" fill="url(#brassValve)" stroke="#713f12" strokeWidth="1.5" />
            {/* Bolt studs */}
            <circle cx="260" cy="225" r="2" fill="#451a03" />
            <circle cx="260" cy="251" r="2" fill="#451a03" />
          </motion.g>

          {/* RIGHT WALL PIPELINE ENTRY */}
          <g filter="url(#shadowGlow)">
            {/* Wall Flange Right */}
            <rect x="664" y="210" width="16" height="56" rx="4" fill="#334155" />
            <rect x="674" y="214" width="4" height="48" fill="#64748b" />
          </g>

          {/* RIGHT MOVABLE PIPE SECTION */}
          <motion.g
            animate={{ x: rightPipeOffset }}
            transition={{
              type: 'spring',
              stiffness: phase === 'burst' ? 500 : 250,
              damping: phase === 'burst' ? 18 : 22,
            }}
          >
            {/* Main steel pipe body from right */}
            <path
              d="M 664 226 L 445 226 A 4 4 0 0 0 441 230 L 441 246 A 4 4 0 0 0 445 250 L 664 250 Z"
              fill="url(#pipeSteel)"
              stroke="#1e293b"
              strokeWidth="1.5"
            />
            {/* Pipe highlights */}
            <line x1="664" y1="233" x2="445" y2="233" stroke="#f1f5f9" strokeWidth="2" strokeOpacity="0.8" />
            <line x1="664" y1="244" x2="445" y2="244" stroke="#0f172a" strokeWidth="1.5" strokeOpacity="0.6" />

            {/* Right Pipe Flange / Female Coupling Receiver */}
            <rect x="434" y="216" width="14" height="44" rx="3" fill="url(#brassValve)" stroke="#713f12" strokeWidth="1.5" />
            {/* Bolt studs */}
            <circle cx="441" cy="224" r="2" fill="#451a03" />
            <circle cx="441" cy="252" r="2" fill="#451a03" />
          </motion.g>

          {/* PLUMBER CHARACTER (HOMO SAPIENS MASTER ENGINEER) */}
          <motion.g
            animate={{
              y: plumberY,
              rotate: phase === 'slip' ? -2 : phase === 'burst' ? 3 : 0,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
            }}
            style={{ originX: '350px', originY: '250px' }}
          >
            {/* LEGS & WORK BOOTS */}
            <g id="plumber-legs">
              {/* Left leg */}
              <path d="M 330 290 L 322 365 L 305 365 L 305 376 L 332 376 L 338 290 Z" fill="#0f172a" />
              {/* Right leg */}
              <path d="M 368 290 L 376 365 L 393 365 L 393 376 L 366 376 L 360 290 Z" fill="#0f172a" />
              {/* Sturdy Boots */}
              <rect x="300" y="366" width="34" height="12" rx="3" fill="#78350f" stroke="#451a03" strokeWidth="1" />
              <rect x="364" y="366" width="34" height="12" rx="3" fill="#78350f" stroke="#451a03" strokeWidth="1" />
            </g>

            {/* TORSO & MECHANIC SUIT */}
            <g id="plumber-torso">
              {/* Main Body */}
              <path
                d="M 318 190 Q 350 184 382 190 L 375 295 L 325 295 Z"
                fill="url(#plumberSuit)"
                stroke="#334155"
                strokeWidth="1.5"
              />
              {/* High-visibility chest stripes */}
              <line x1="324" y1="220" x2="376" y2="220" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 3" />
              <line x1="326" y1="245" x2="374" y2="245" stroke="#0284c7" strokeWidth="2" />

              {/* Utility Belt */}
              <rect x="320" y="284" width="60" height="12" rx="2" fill="#78350f" />
              <rect x="344" y="282" width="12" height="16" rx="2" fill="url(#brassValve)" stroke="#451a03" strokeWidth="1" />
              {/* Wrench hanging on belt holster */}
              <path d="M 368 292 L 374 322" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
              <circle cx="375" cy="324" r="4" fill="#94a3b8" />
            </g>

            {/* HEAD & EXPRESSION */}
            <g id="plumber-head">
              {/* Neck */}
              <rect x="342" y="174" width="16" height="18" fill="url(#skin)" />

              {/* Face */}
              <ellipse cx="350" cy="155" rx="18" ry="21" fill="url(#skin)" stroke="#9a3412" strokeWidth="0.8" />
              {/* Ears */}
              <ellipse cx="331" cy="156" rx="4" ry="6" fill="url(#skin)" />
              <ellipse cx="369" cy="156" rx="4" ry="6" fill="url(#skin)" />

              {/* Facial features changing according to phase */}
              {phase === 'inspect' && (
                <g id="face-inspect">
                  {/* Concentrated focused eyes */}
                  <ellipse cx="344" cy="152" rx="2.5" ry="2" fill="#0f172a" />
                  <ellipse cx="356" cy="152" rx="2.5" ry="2" fill="#0f172a" />
                  {/* Eyebrows curious */}
                  <line x1="341" y1="147" x2="347" y2="148" stroke="#451a03" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="353" y1="148" x2="359" y2="147" stroke="#451a03" strokeWidth="1.5" strokeLinecap="round" />
                  {/* Determined mouth */}
                  <path d="M 346 164 Q 350 165 354 164" stroke="#451a03" strokeWidth="1.5" strokeLinecap="round" />
                </g>
              )}

              {phase === 'align' && (
                <g id="face-align">
                  {/* Strained eyes closed in effort */}
                  <path d="M 342 153 L 347 151" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 353 151 L 358 153" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
                  {/* Strained eyebrows angled down */}
                  <line x1="340" y1="146" x2="348" y2="149" stroke="#451a03" strokeWidth="2" strokeLinecap="round" />
                  <line x1="352" y1="149" x2="360" y2="146" stroke="#451a03" strokeWidth="2" strokeLinecap="round" />
                  {/* Clenched teeth effort */}
                  <rect x="345" y="162" width="10" height="4" rx="1" fill="#ffffff" stroke="#451a03" strokeWidth="1" />
                  {/* Sweat droplet */}
                  <path d="M 364 145 C 364 142 366 142 366 145 C 366 147 364 147 364 145 Z" fill="#38bdf8" />
                </g>
              )}

              {(phase === 'slip' || phase === 'burst') && (
                <g id="face-shocked">
                  {/* Wide shocked eyes */}
                  <circle cx="343" cy="151" r="4.5" fill="#ffffff" stroke="#0f172a" strokeWidth="1" />
                  <circle cx="343" cy="151" r="2" fill="#0f172a" />
                  <circle cx="357" cy="151" r="4.5" fill="#ffffff" stroke="#0f172a" strokeWidth="1" />
                  <circle cx="357" cy="151" r="2" fill="#0f172a" />
                  {/* High arched eyebrows */}
                  <path d="M 339 144 Q 343 140 347 144" stroke="#451a03" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M 353 144 Q 357 140 361 144" stroke="#451a03" strokeWidth="1.8" strokeLinecap="round" />
                  {/* Wide open 'O' mouth screaming */}
                  <ellipse cx="350" cy="164" rx="5" ry="7" fill="#7f1d1d" stroke="#451a03" strokeWidth="1.2" />
                  <ellipse cx="350" cy="167" rx="3" ry="2" fill="#ef4444" />
                </g>
              )}

              {phase === 'react' && (
                <g id="face-drenched">
                  {/* Blinking dripping wet eyes */}
                  <path d="M 342 152 Q 345 155 348 152" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 352 152 Q 355 155 358 152" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
                  {/* Disappointed curved eyebrows */}
                  <path d="M 340 148 Q 344 144 348 147" stroke="#451a03" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M 352 147 Q 356 144 360 148" stroke="#451a03" strokeWidth="1.5" strokeLinecap="round" />
                  {/* Comical crooked sigh mouth */}
                  <path d="M 345 165 Q 350 162 355 166" stroke="#451a03" strokeWidth="1.8" strokeLinecap="round" />
                  {/* Water dripping from nose/chin */}
                  <circle cx="350" cy="177" r="1.5" fill="#38bdf8" />
                  <circle cx="344" cy="172" r="1.2" fill="#38bdf8" />
                </g>
              )}

              {/* Protective Safety Goggles on forehead */}
              <g id="safety-goggles" transform="translate(332, 137)">
                <rect x="3" y="1" width="13" height="9" rx="3" fill="#38bdf8" fillOpacity="0.4" stroke="#0284c7" strokeWidth="1.2" />
                <rect x="20" y="1" width="13" height="9" rx="3" fill="#38bdf8" fillOpacity="0.4" stroke="#0284c7" strokeWidth="1.2" />
                <line x1="16" y1="5" x2="20" y2="5" stroke="#0284c7" strokeWidth="1.5" />
                <line x1="0" y1="5" x2="3" y2="5" stroke="#334155" strokeWidth="1" />
                <line x1="33" y1="5" x2="36" y2="5" stroke="#334155" strokeWidth="1" />
              </g>

              {/* Master Plumber Hard Hat */}
              <g id="hard-hat">
                {/* Cap base rim */}
                <ellipse cx="350" cy="138" rx="26" ry="6" fill="#b45309" stroke="#78350f" strokeWidth="1" />
                {/* Dome */}
                <path d="M 328 136 C 328 116 372 116 372 136 Z" fill="url(#hardHat)" stroke="#78350f" strokeWidth="1.2" />
                {/* Ridge */}
                <path d="M 347 118 L 347 136" stroke="#fef3c7" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
                {/* Brand emblem badge */}
                <circle cx="350" cy="128" r="4" fill="#0284c7" stroke="#ffffff" strokeWidth="0.8" />
                <path d="M 348.5 128 L 351.5 128" stroke="#ffffff" strokeWidth="1" />
              </g>
            </g>

            {/* ARMS & HEAVY WRENCHES CONNECTING THE TWO PIPES */}
            {/* LEFT ARM */}
            <motion.g
              animate={{
                x: phase === 'inspect' ? 0 : phase === 'align' ? 14 : phase === 'burst' ? -12 : phase === 'react' ? -6 : 10,
                y: phase === 'burst' ? -18 : phase === 'react' ? -8 : 0,
                rotate: phase === 'burst' ? -25 : phase === 'react' ? -15 : 0,
              }}
              transition={{ type: 'spring', stiffness: 350, damping: 22 }}
              style={{ originX: '320px', originY: '200px' }}
            >
              {/* Sleeve */}
              <path d="M 322 196 L 274 225 L 282 238 L 328 208 Z" fill="#1e293b" />
              {/* Forearm & Hand gripping left coupling */}
              <rect x="264" y="224" width="16" height="14" rx="4" fill="url(#skin)" stroke="#9a3412" strokeWidth="0.8" />
              {/* Plumber Heavy Pipe Wrench gripping left pipe */}
              <g transform="translate(250, 212) rotate(-15)">
                {/* Wrench Jaw */}
                <path d="M 10 10 L 22 10 L 22 28 L 10 28 L 10 22 L 18 22 L 18 16 L 10 16 Z" fill="#b91c1c" stroke="#450a0a" strokeWidth="1" />
                {/* Handle */}
                <rect x="6" y="24" width="6" height="34" rx="2" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1" />
              </g>
            </motion.g>

            {/* RIGHT ARM */}
            <motion.g
              animate={{
                x: phase === 'inspect' ? 0 : phase === 'align' ? -14 : phase === 'burst' ? 14 : phase === 'react' ? 8 : -10,
                y: phase === 'burst' ? -20 : phase === 'react' ? -8 : 0,
                rotate: phase === 'burst' ? 25 : phase === 'react' ? 15 : 0,
              }}
              transition={{ type: 'spring', stiffness: 350, damping: 22 }}
              style={{ originX: '380px', originY: '200px' }}
            >
              {/* Sleeve */}
              <path d="M 378 196 L 426 225 L 418 238 L 372 208 Z" fill="#1e293b" />
              {/* Forearm & Hand gripping right coupling */}
              <rect x="420" y="224" width="16" height="14" rx="4" fill="url(#skin)" stroke="#9a3412" strokeWidth="0.8" />
              {/* Plumber Heavy Pipe Wrench gripping right pipe */}
              <g transform="translate(432, 210) rotate(15)">
                {/* Wrench Jaw */}
                <path d="M 12 10 L 0 10 L 0 28 L 12 28 L 12 22 L 4 22 L 4 16 L 12 16 Z" fill="#0284c7" stroke="#082f49" strokeWidth="1" />
                {/* Handle */}
                <rect x="10" y="24" width="6" height="34" rx="2" fill="#38bdf8" stroke="#0369a1" strokeWidth="1" />
              </g>
            </motion.g>
          </motion.g>

          {/* SPARK & PRESSURE EFFECT DURING 'ALIGN' AND 'SLIP' */}
          <AnimatePresence>
            {(phase === 'align' || phase === 'slip') && (
              <motion.g
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: [0.8, 1.2, 0.9] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, repeat: Infinity }}
                transform="translate(350, 238)"
              >
                {/* Friction Sparks */}
                <circle cx="0" cy="0" r="4" fill="#fbbf24" filter="url(#shadowGlow)" />
                <line x1="-8" y1="-8" x2="8" y2="8" stroke="#f59e0b" strokeWidth="1.5" />
                <line x1="8" y1="-8" x2="-8" y2="8" stroke="#f59e0b" strokeWidth="1.5" />
                <circle cx="-12" cy="-5" r="1.5" fill="#ef4444" />
                <circle cx="10" cy="-7" r="1.5" fill="#facc15" />
                <circle cx="-4" cy="11" r="1.2" fill="#f59e0b" />
              </motion.g>
            )}
          </AnimatePresence>

          {/* DRAMATIC WATER BURST & SPLASH SEQUENCE */}
          <AnimatePresence>
            {phase === 'burst' && (
              <motion.g
                key="water-burst"
                initial={{ opacity: 0, scale: 0.2 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                {/* High-pressure center burst geyser */}
                <g transform="translate(350, 238)">
                  {/* Central high blast cone */}
                  <motion.path
                    d="M -15 0 C -35 -120 35 -120 15 0 Z"
                    fill="url(#waterJetGrad)"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: [0, 1.3, 1] }}
                    transition={{ duration: 0.25 }}
                  />

                  {/* Left spray fan */}
                  <motion.path
                    d="M 0 0 C -120 -80 -160 -10 -80 15 Z"
                    fill="url(#waterBurstGrad)"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Right spray fan */}
                  <motion.path
                    d="M 0 0 C 120 -80 160 -10 80 15 Z"
                    fill="url(#waterBurstGrad)"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Downward splash pool */}
                  <ellipse cx="0" cy="120" rx="90" ry="16" fill="#38bdf8" fillOpacity="0.3" />

                  {/* Water Droplet Particles Spreading */}
                  {[
                    { cx: -50, cy: -80, r: 6 },
                    { cx: 60, cy: -90, r: 5 },
                    { cx: -90, cy: -30, r: 7 },
                    { cx: 100, cy: -40, r: 6 },
                    { cx: -130, cy: 10, r: 5 },
                    { cx: 140, cy: 15, r: 5.5 },
                    { cx: -20, cy: -130, r: 4 },
                    { cx: 25, cy: -140, r: 4.5 },
                    { cx: -70, cy: -110, r: 3.5 },
                    { cx: 80, cy: -115, r: 3 },
                    { cx: -110, cy: -70, r: 4.5 },
                    { cx: 120, cy: -75, r: 4 },
                  ].map((drop, idx) => (
                    <motion.circle
                      key={idx}
                      cx={drop.cx}
                      cy={drop.cy}
                      r={drop.r}
                      fill="#38bdf8"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: [0, 1.4, 1],
                        opacity: [0, 0.9, 0.7],
                        y: [0, -10, 20],
                      }}
                      transition={{
                        duration: 0.6,
                        delay: idx * 0.02,
                        ease: 'easeOut',
                      }}
                    />
                  ))}
                </g>
              </motion.g>
            )}
          </AnimatePresence>

          {/* PHASE: REACT - CALM DRIPPING PARTICLES */}
          <AnimatePresence>
            {phase === 'react' && (
              <motion.g
                key="water-drip"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Slow puddle rippling below */}
                <ellipse cx="350" cy="365" rx="75" ry="12" fill="#0284c7" fillOpacity="0.25" />
                <ellipse cx="350" cy="365" rx="45" ry="7" fill="#38bdf8" fillOpacity="0.35" />

                {/* Dripping drops from broken joint */}
                <motion.circle
                  cx="345"
                  cy="242"
                  r="3"
                  fill="#38bdf8"
                  animate={{ y: [0, 115], opacity: [1, 0] }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: 'easeIn' }}
                />
                <motion.circle
                  cx="355"
                  cy="242"
                  r="2.5"
                  fill="#0284c7"
                  animate={{ y: [0, 115], opacity: [1, 0] }}
                  transition={{ duration: 0.8, delay: 0.4, repeat: Infinity, ease: 'easeIn' }}
                />
              </motion.g>
            )}
          </AnimatePresence>
        </svg>

        {/* Live Stage Status Indicator overlay inside visual box */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex items-center gap-2 px-2.5 py-1 rounded-full bg-background/80 dark:bg-background/70 backdrop-blur-md border border-border/70 text-[11px] font-mono text-muted-foreground shadow-xs">
          <span
            className={`h-2 w-2 rounded-full ${
              phase === 'burst'
                ? 'bg-rose-500 animate-ping'
                : phase === 'slip'
                ? 'bg-amber-500 animate-pulse'
                : phase === 'align'
                ? 'bg-sky-500 animate-pulse'
                : 'bg-emerald-500'
            }`}
          />
          <span className="uppercase tracking-wider font-semibold text-[10px]">
            {phase === 'inspect' && 'Step 1/5: Inspecting Gap'}
            {phase === 'align' && 'Step 2/5: Aligning Pipe Flanges'}
            {phase === 'slip' && 'Step 3/5: Joint Slipping!'}
            {phase === 'burst' && 'Step 4/5: Water Burst Failure!'}
            {phase === 'react' && 'Step 5/5: Connection Severed'}
          </span>
        </div>

        {/* Interactive Replay button */}
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReplay}
            className="h-7 px-2.5 text-[11px] font-medium gap-1.5 bg-background/80 backdrop-blur-md border-border/70 hover:bg-background/95 hover:text-primary transition-colors duration-150 shadow-xs"
            title="Replay connection attempt"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Replay Attempt</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
