'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  Navigation,
  CheckCircle2,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { businessInfo } from '@/lib/business-info';
import {
  fetchLiveServiceAreas,
  getCachedServiceAreas,
  type DbServiceArea,
} from '@/lib/supabase-data';

interface HubNode {
  id: string;
  locality: string;
  name: string;
  district: string;
  pincode: string;
  type: string;
  eta: string;
  status: string;
  isHQ?: boolean;
  x: number;
  y: number;
}

const KNOWN_NODE_COORDS: Record<string, { x: number; y: number }> = {
  bahardaltitia: { x: 220, y: 220 },
  keshrambha: { x: 220, y: 220 },
  dantan: { x: 200, y: 235 },
  belda: { x: 265, y: 170 },
  narayangarh: { x: 255, y: 145 },
  kharagpur: { x: 245, y: 110 },
  midnapore: { x: 230, y: 65 },
  medinipur: { x: 230, y: 65 },
  jhargram: { x: 100, y: 110 },
  ghatal: { x: 340, y: 55 },
  chandrakona: { x: 310, y: 60 },
  egra: { x: 330, y: 205 },
  contai: { x: 400, y: 235 },
  tamluk: { x: 425, y: 120 },
};

function getCoordinatesForArea(locality: string, index: number, total: number) {
  const key = locality.trim().toLowerCase();
  if (KNOWN_NODE_COORDS[key]) {
    return KNOWN_NODE_COORDS[key];
  }
  const angle = -Math.PI * 0.8 + (index / Math.max(1, total)) * Math.PI * 1.1;
  const radius = 115 + (index % 2) * 30;
  return {
    x: Math.round(220 + Math.cos(angle) * radius),
    y: Math.round(180 + Math.sin(angle) * radius * 0.75),
  };
}

export function DispatchHubMap() {
  const [areas, setAreas] = React.useState<DbServiceArea[]>(
    () => getCachedServiceAreas() ?? []
  );
  const [activeNodeId, setActiveNodeId] = React.useState<string>('');

  React.useEffect(() => {
    let active = true;
    fetchLiveServiceAreas().then(({ data }) => {
      if (!active) return;
      setAreas(data);
      if (data.length > 0) {
        setActiveNodeId((prev) => prev || data[0].id || data[0].locality);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const hqNode: HubNode = {
    id: 'hq-keshrambha',
    locality: 'Keshrambha',
    name: 'Bahardaltitia, PO - Keshrambha, PS - Dantan',
    district: businessInfo.district,
    pincode: businessInfo.pincode,
    type: 'Headquarters & Spare Parts Counter',
    eta: 'Base Workshop Origin',
    status: `Active · PIN ${businessInfo.pincode}`,
    isHQ: true,
    x: 170,
    y: 220,
  };

  const serviceNodes: HubNode[] = React.useMemo(() => {
    return areas.map((area, idx) => {
      const coords = getCoordinatesForArea(area.locality, idx, areas.length);
      return {
        id: area.id || area.locality,
        locality: area.locality,
        name: `${area.locality} Service Zone`,
        district: area.district || 'West Medinipur',
        pincode: area.pincode || '721451',
        type: area.block
          ? `Block: ${area.block}${
              area.subdivision ? ` · Subdivision: ${area.subdivision}` : ''
            }`
          : 'Verified Plumbing & Pipeline Coverage',
        eta: 'Same-Day Technician Dispatch',
        status: `Active · PIN ${area.pincode || '721451'}`,
        isHQ: false,
        x: coords.x,
        y: coords.y,
      };
    });
  }, [areas]);

  const allNodes = React.useMemo(
    () => [hqNode, ...serviceNodes],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [serviceNodes]
  );

  const selected =
    allNodes.find((n) => n.id === activeNodeId) ||
    serviceNodes[0] ||
    hqNode;

  return (
    <div className="relative rounded-2xl border border-border/80 bg-card/95 dark:bg-card/85 backdrop-blur-xl p-5 sm:p-6 shadow-crisp-md overflow-hidden render-crisp">
      {/* Background Cartographic Grid */}
      <div className="absolute inset-0 bg-grid-blueprint opacity-[0.3] dark:opacity-[0.2] pointer-events-none" />

      {/* Header bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border/70 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-5 w-5 rounded-md bg-primary/10 text-primary">
              <Navigation className="h-3.5 w-3.5" />
            </div>
            <h3 className="font-display font-bold text-sm sm:text-base text-foreground">
              Regional Service Area &amp; Pin Code Dispatch Grid
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Live route coverage from {businessInfo.addressShort} (PIN{' '}
            {businessInfo.pincode}) to {areas.length} active service{' '}
            {areas.length === 1 ? 'area' : 'areas'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-500/25">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>HQ: Bahardaltitia · PIN {businessInfo.pincode}</span>
          </span>
        </div>
      </div>

      {/* SVG Network Map */}
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
              <feDropShadow
                dx="0"
                dy="1"
                stdDeviation="1.5"
                floodColor="#000000"
                floodOpacity="0.18"
              />
            </filter>
          </defs>

          {/* Connecting Routes from HQ to every Live Database Service Area */}
          {serviceNodes.map((node, idx) => (
            <React.Fragment key={`route-${node.id}`}>
              <line
                x1={hqNode.x}
                y1={hqNode.y}
                x2={node.x}
                y2={node.y}
                stroke="hsl(var(--primary))"
                strokeWidth="2.5"
                strokeDasharray="5 5"
                opacity="0.85"
              />
              <motion.circle
                cx={hqNode.x}
                cy={hqNode.y}
                r="4.5"
                fill="hsl(var(--primary))"
                stroke="#ffffff"
                strokeWidth="1.5"
                animate={{
                  cx: [hqNode.x, node.x],
                  cy: [hqNode.y, node.y],
                  opacity: [1, 0.9, 0],
                }}
                transition={{
                  duration: 3 + (idx % 3) * 0.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </React.Fragment>
          ))}

          {/* Interactive Hub Markers */}
          {allNodes.map((hub) => {
            const isSelected = hub.id === selected.id;
            const isHQ = Boolean(hub.isHQ);
            const labelAbove = hub.y > 120;

            return (
              <g
                key={hub.id}
                transform={`translate(${hub.x}, ${hub.y})`}
                onClick={() => setActiveNodeId(hub.id)}
                className="cursor-pointer group"
              >
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

                <circle
                  cx="0"
                  cy="0"
                  r={isHQ ? 9 : 8}
                  fill={
                    isHQ
                      ? 'hsl(var(--primary))'
                      : isSelected
                        ? 'hsl(var(--foreground))'
                        : 'hsl(var(--card))'
                  }
                  stroke={
                    isHQ ? 'hsl(var(--primary))' : 'hsl(var(--foreground))'
                  }
                  strokeWidth={2}
                  filter="url(#hubDrop)"
                  className="transition-transform duration-200 group-hover:scale-125"
                />

                <circle
                  cx="0"
                  cy="0"
                  r={isHQ ? 4 : 3}
                  fill={
                    isHQ
                      ? '#ffffff'
                      : isSelected
                        ? 'hsl(var(--background))'
                        : 'hsl(var(--primary))'
                  }
                />

                <g transform={`translate(0, ${labelAbove ? -18 : 20})`}>
                  <rect
                    x="-52"
                    y="-10"
                    width="104"
                    height="20"
                    rx="5"
                    fill="hsl(var(--card))"
                    stroke={
                      isSelected
                        ? 'hsl(var(--primary))'
                        : isHQ
                          ? 'hsl(var(--foreground))'
                          : 'hsl(var(--border))'
                    }
                    strokeWidth={isSelected ? 1.5 : 1}
                    filter="url(#hubDrop)"
                  />
                  <text
                    x="0"
                    y="3"
                    fontSize="8.5"
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
                    {isHQ
                      ? `HQ (${hub.pincode})`
                      : `${hub.locality} (${hub.pincode})`}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Hub Details Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 p-4 rounded-xl bg-card border border-border/80 shadow-crisp-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
        >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="font-bold text-foreground text-sm">
                {selected.name}
              </span>
              <span className="text-[11px] font-mono text-primary font-bold">
                · {selected.district} · PIN {selected.pincode}
              </span>
            </div>
            <p className="text-muted-foreground text-xs mt-1">
              {selected.type} · Response:{' '}
              <strong className="text-foreground font-semibold">
                {selected.eta}
              </strong>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <Button
              asChild
              size="sm"
              className="h-9 sm:h-8 w-full sm:w-auto justify-center rounded-lg text-xs font-semibold"
            >
              <Link
                href={`/book?area=${encodeURIComponent(selected.locality)}`}
              >
                Book in {selected.locality}
                <ArrowRight className="ml-1.5 h-3 w-3 shrink-0" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
