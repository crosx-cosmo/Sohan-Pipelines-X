'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import {
  Package,
  Search,
  MessageCircle,
  Phone,
  CheckCircle2,
  ShieldCheck,
  ShoppingBag,
  Plus,
  Minus,
  ArrowUpDown,
  RefreshCw,
  AlertCircle,
  Truck,
  Check,
  X,
  Copy,
  KeyRound,
  LogOut,
  Database,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CustomSelect, type SelectOption } from '@/components/ui/custom-select';
import { businessInfo } from '@/lib/business-info';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import {
  fetchLiveSpareParts,
  getCachedSpareParts,
  WAREHOUSE_CATALOG_SPARE_PARTS,
  type DbSparePart,
} from '@/lib/supabase-data';
import {
  resolveProductImage,
  SPARE_PARTS_STORAGE_ASSETS,
} from '@/lib/spare-parts-mapping';
import { useCart } from '@/lib/cart-context';
import { luxuryEasing } from '@/lib/motion';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'stock-desc' | 'name-asc';

const PUBLIC_RLS_SQL_SNIPPET = `ALTER TABLE public.spare_parts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read-only access on spare_parts" ON public.spare_parts;

CREATE POLICY "Allow public read-only access on spare_parts"
  ON public.spare_parts
  FOR SELECT
  TO anon, authenticated
  USING (true);

GRANT SELECT ON public.spare_parts TO anon, authenticated;`;

const sortOptions: SelectOption[] = [
  {
    value: 'default',
    label: 'Default Order',
    description: 'Latest warehouse additions first',
  },
  {
    value: 'price-asc',
    label: 'Price: Low to High',
    description: 'Most economical fittings first',
  },
  {
    value: 'price-desc',
    label: 'Price: High to Low',
    description: 'Heavy-duty & premium assemblies first',
  },
  {
    value: 'stock-desc',
    label: 'Highest Stock',
    description: 'Ready for bulk warehouse dispatch',
  },
  {
    value: 'name-asc',
    label: 'Alphabetical (A–Z)',
    description: 'Sort by spare part name',
  },
];

const categoryFilters = [
  { id: 'all', label: 'All Hardware' },
  { id: 'pipes', label: 'Pipes & Fittings' },
  { id: 'valves', label: 'Valves & Controls' },
  { id: 'taps', label: 'Taps & Diverters' },
  { id: 'sanitary', label: 'Sanitaryware & Flush' },
  { id: 'heaters', label: 'Geysers & Heating' },
  { id: 'tanks', label: 'Tanks & Accessories' },
];

const warehouseHardwareLines = [
  {
    title: 'Heavy CPVC & UPVC Pipeline Systems',
    brands: 'Astral, Supreme, Finolex',
    desc: 'Pressure-rated schedule 40/80 pipes, brass-threaded elbows, tees, unions, SWR bends, and heavy solvent weld cements.',
    image: SPARE_PARTS_STORAGE_ASSETS.PIPES_AND_FITTINGS,
    tag: 'Pipes & Fittings',
  },
  {
    title: 'Valves, Regulators & Stop Cocks',
    brands: 'Zoloto, Astral, Jaquar',
    desc: 'Full-bore brass ball valves, concealed stop cocks, non-return check valves, angle valves, and heavy gate valves.',
    image: SPARE_PARTS_STORAGE_ASSETS.TAPS_AND_VALVES,
    tag: 'Valves & Controls',
  },
  {
    title: 'Bathroom Sanitaryware & Flush Units',
    brands: 'Hindware, Parryware, Jaquar',
    desc: 'Dual-flush mechanisms, wall-hung brackets, commode fittings, waste couplings, and heavy brass bottle traps.',
    image: SPARE_PARTS_STORAGE_ASSETS.SANITARYWARE_AND_FLUSH,
    tag: 'Sanitaryware & Flush',
  },
  {
    title: 'Designer Taps, Faucets & Diverters',
    brands: 'Jaquar, Cera, Essco',
    desc: 'Quarter-turn ceramic disc bib taps, pillar taps, sink mixers, single-lever shower diverters, and rain shower heads.',
    image: SPARE_PARTS_STORAGE_ASSETS.SHOWER_AND_MIXERS,
    tag: 'Taps & Diverters',
  },
  {
    title: 'Thermal Lines & Water Heater Kits',
    brands: 'Racold, Bajaj, Supreme',
    desc: 'SS 304 braided flexible connection pipes, multi-function thermal safety relief valves, and hot-water compliant lines.',
    image: SPARE_PARTS_STORAGE_ASSETS.WATER_HEATERS_AND_HOT_WATER,
    tag: 'Geysers & Heating',
  },
  {
    title: 'Wash Basin Faucets & Tank Fittings',
    brands: 'Supreme, Jaquar, Kirloskar',
    desc: 'Mechanical brass float valves, tank nipples, basin pillar cocks, motorized foot valves, and suction lines.',
    image: SPARE_PARTS_STORAGE_ASSETS.BASINS_AND_FAUCETS,
    tag: 'Tanks & Basins',
  },
];

interface SparePartsSectionProps {
  initialParts?: DbSparePart[];
}

export function SparePartsSection({ initialParts }: SparePartsSectionProps) {
  const hasInitialParts = Array.isArray(initialParts) && initialParts.length > 0;

  const [parts, setParts] = React.useState<DbSparePart[]>(
    () =>
      getCachedSpareParts() ??
      (hasInitialParts ? initialParts : WAREHOUSE_CATALOG_SPARE_PARTS)
  );
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [rlsBlocked, setRlsBlocked] = React.useState<boolean>(false);
  const [showAdminSyncPanel, setShowAdminSyncPanel] = React.useState<boolean>(false);

  // Admin session sync state (for viewing RLS-protected rows added in Admin Panel)
  const [adminEmail, setAdminEmail] = React.useState('');
  const [adminPassword, setAdminPassword] = React.useState('');
  const [signingIn, setSigningIn] = React.useState(false);
  const [activeUserEmail, setActiveUserEmail] = React.useState<string | null>(null);
  const [copiedSql, setCopiedSql] = React.useState(false);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [sortBy, setSortBy] = React.useState<SortOption>('default');

  // Support deep linking via ?category=pipes|valves|taps|sanitary|heaters|tanks and ?q=...
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get('category')?.toLowerCase();
    const qParam = params.get('q');
    queueMicrotask(() => {
      if (catParam && categoryFilters.some((c) => c.id === catParam)) {
        setSelectedCategory(catParam);
      }
      if (qParam) {
        setSearchQuery(qParam);
      }
    });
  }, []);

  // Quantities for cards before adding to cart (product.id -> quantity)
  const [cardQuantities, setCardQuantities] = React.useState<Record<string, number>>({});

  const { items: cartItems, addItem, openCart, totalItemsCount, subtotal } = useCart();

  // Map product ID -> quantity currently in cart
  const cartQtyById = React.useMemo(() => {
    const map: Record<string, number> = {};
    for (const item of cartItems) {
      map[item.id] = item.quantity;
    }
    return map;
  }, [cartItems]);

  const rawPhone = React.useMemo(
    () => businessInfo.phone.replace(/[^0-9]/g, ''),
    []
  );

  const loadParts = React.useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    const { data, error: err, rlsBlocked: isRlsBlocked } = await fetchLiveSpareParts({
      forceRefresh: true,
    });
    if (err) {
      setError(err);
      setParts(WAREHOUSE_CATALOG_SPARE_PARTS);
      setRlsBlocked(false);
    } else {
      setParts(data.length > 0 ? data : WAREHOUSE_CATALOG_SPARE_PARTS);
      setRlsBlocked(Boolean(isRlsBlocked));
    }
    setLoading(false);
  }, []);

  // Check active Supabase session & subscribe to live `public.spare_parts` changes
  React.useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setActiveUserEmail(data.session?.user?.email ?? null);
    });

    fetchLiveSpareParts({ forceRefresh: true }).then(
      ({ data, error: err, rlsBlocked: isRlsBlocked }) => {
        if (!active) return;
        if (err) {
          setError(err);
          setParts(WAREHOUSE_CATALOG_SPARE_PARTS);
        } else {
          setParts(data.length > 0 ? data : WAREHOUSE_CATALOG_SPARE_PARTS);
          setRlsBlocked(Boolean(isRlsBlocked));
        }
        setLoading(false);
      }
    );

    const channel = supabase
      .channel('public-spare-parts-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'spare_parts' },
        () => {
          if (active) {
            loadParts(false);
          }
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [loadParts]);

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.trim() || !adminPassword) return;
    setSigningIn(true);
    try {
      const { data, error: signInErr } = await supabase.auth.signInWithPassword({
        email: adminEmail.trim(),
        password: adminPassword,
      });
      if (signInErr) {
        toast.error(signInErr.message || 'Unable to sign in with Admin credentials');
      } else {
        setActiveUserEmail(data.user?.email ?? null);
        setAdminPassword('');
        toast.success('Admin session connected! Fetching live spare parts...');
        await loadParts(true);
      }
    } finally {
      setSigningIn(false);
    }
  };

  const handleAdminSignOut = async () => {
    await supabase.auth.signOut();
    setActiveUserEmail(null);
    toast.info('Admin session disconnected');
    await loadParts(true);
  };

  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(PUBLIC_RLS_SQL_SNIPPET);
      setCopiedSql(true);
      toast.success('Public RLS SQL policy copied to clipboard!');
      setTimeout(() => setCopiedSql(false), 2500);
    } catch {
      toast.error('Unable to copy automatically — please select and copy the SQL snippet.');
    }
  };

  const getCardQuantity = (id: string) => cardQuantities[id] ?? 1;

  const handleQuantityChange = (
    id: string,
    delta: number,
    maxStock?: number | null
  ) => {
    setCardQuantities((prev) => {
      const current = prev[id] ?? 1;
      const maxAllowed =
        maxStock !== null && maxStock !== undefined && maxStock > 0
          ? maxStock
          : 99;
      const next = Math.max(1, Math.min(maxAllowed, current + delta));
      return { ...prev, [id]: next };
    });
  };

  const handleAddToCart = (part: DbSparePart) => {
    const qty = getCardQuantity(part.id);
    const resolvedImage = resolveProductImage(part);
    addItem(
      {
        id: part.id,
        name: part.name,
        sku: part.sku,
        category: part.category,
        selling_price:
          part.selling_price !== undefined && part.selling_price !== null
            ? Number(part.selling_price)
            : null,
        stock:
          part.stock !== undefined && part.stock !== null
            ? Number(part.stock)
            : null,
        image_url: resolvedImage,
      },
      qty
    );
    setCardQuantities((prev) => ({ ...prev, [part.id]: 1 }));
  };

  const getDirectWhatsAppUrl = (part: DbSparePart) => {
    const qty = getCardQuantity(part.id);
    const priceText =
      part.selling_price && part.selling_price > 0
        ? ` (Listed Price: ₹${Number(part.selling_price).toLocaleString('en-IN')})`
        : '';
    const skuText = part.sku ? ` [SKU: ${part.sku}]` : '';
    const message = `Hello Sohan Pipeline's, I would like to enquire about:\n\n• *${part.name}*${skuText}\n  Quantity: ${qty}${priceText}\n\nPlease confirm current stock availability, final pricing, and delivery/pickup details.`;
    return `https://wa.me/${rawPhone}?text=${encodeURIComponent(message)}`;
  };

  const filteredAndSortedParts = React.useMemo(() => {
    let result = parts.filter((part) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        part.name.toLowerCase().includes(q) ||
        (part.category && part.category.toLowerCase().includes(q)) ||
        (part.sku && part.sku.toLowerCase().includes(q)) ||
        (part.description && part.description.toLowerCase().includes(q));

      if (!matchesSearch) return false;
      if (selectedCategory === 'all') return true;

      const catLower = `${part.category || ''} ${part.name || ''}`.toLowerCase();
      if (selectedCategory === 'pipes') {
        return (
          catLower.includes('pipe') ||
          catLower.includes('fitting') ||
          catLower.includes('cpvc') ||
          catLower.includes('upvc') ||
          catLower.includes('pvc') ||
          catLower.includes('elbow') ||
          catLower.includes('tee') ||
          catLower.includes('coupl') ||
          catLower.includes('solvent') ||
          catLower.includes('bend')
        );
      }
      if (selectedCategory === 'valves') {
        return (
          catLower.includes('valve') ||
          catLower.includes('cock') ||
          catLower.includes('nrv') ||
          catLower.includes('regulator') ||
          catLower.includes('check')
        );
      }
      if (selectedCategory === 'taps') {
        return (
          catLower.includes('tap') ||
          catLower.includes('faucet') ||
          catLower.includes('mixer') ||
          catLower.includes('diverter') ||
          catLower.includes('shower') ||
          catLower.includes('bib') ||
          catLower.includes('pillar')
        );
      }
      if (selectedCategory === 'sanitary') {
        return (
          catLower.includes('sanitary') ||
          catLower.includes('flush') ||
          catLower.includes('cistern') ||
          catLower.includes('commode') ||
          catLower.includes('basin') ||
          catLower.includes('trap') ||
          catLower.includes('waste')
        );
      }
      if (selectedCategory === 'heaters') {
        return (
          catLower.includes('geyser') ||
          catLower.includes('heater') ||
          catLower.includes('thermal') ||
          catLower.includes('hot') ||
          catLower.includes('braided')
        );
      }
      if (selectedCategory === 'tanks') {
        return (
          catLower.includes('tank') ||
          catLower.includes('float') ||
          catLower.includes('pump') ||
          catLower.includes('motor') ||
          catLower.includes('foot') ||
          catLower.includes('nipple')
        );
      }
      return true;
    });

    if (sortBy === 'price-asc') {
      result = [...result].sort(
        (a, b) => (a.selling_price || 0) - (b.selling_price || 0)
      );
    } else if (sortBy === 'price-desc') {
      result = [...result].sort(
        (a, b) => (b.selling_price || 0) - (a.selling_price || 0)
      );
    } else if (sortBy === 'stock-desc') {
      result = [...result].sort((a, b) => (b.stock || 0) - (a.stock || 0));
    } else if (sortBy === 'name-asc') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [parts, searchQuery, selectedCategory, sortBy]);

  return (
    <section className="py-10 sm:py-14 lg:py-16 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Trust & Capabilities Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 rounded-2xl bg-muted/30 border border-border/70 text-xs text-muted-foreground">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold text-foreground truncate">
              100% Genuine Fittings
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <Truck className="h-4 w-4 text-primary shrink-0" />
            <span className="font-semibold text-foreground truncate">
              Warehouse Dispatch
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold text-foreground truncate">
              Verified Database Rates
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <MessageCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold text-foreground truncate">
              Direct WhatsApp Checkout
            </span>
          </div>
        </div>

        {/* Active Admin Session Banner (when authenticated) */}
        {activeUserEmail && (
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-medium">
              <Database className="h-4 w-4 shrink-0" />
              <span>
                Connected to Supabase Admin Session ({activeUserEmail}) · Showing{' '}
                <strong className="font-mono">{parts.length}</strong> live spare
                parts
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => loadParts(true)}
                className="h-7 px-2.5 text-[11px]"
              >
                <RefreshCw className="mr-1 h-3 w-3" />
                Sync Now
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAdminSignOut}
                className="h-7 px-2.5 text-[11px] text-muted-foreground hover:text-foreground"
              >
                <LogOut className="mr-1 h-3 w-3" />
                Sign Out
              </Button>
            </div>
          </div>
        )}

        {/* Admin Panel Custom Rows Sync Notice (when anon is restricted by Supabase RLS) */}
        {!activeUserEmail && rlsBlocked && (
          <div className="rounded-2xl border border-primary/25 bg-card/90 p-3.5 sm:px-5 space-y-4 shadow-crisp-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <Database className="h-4 w-4 text-primary shrink-0" />
                <span>
                  Showing <strong className="text-foreground font-mono">{parts.length}</strong> verified warehouse spare parts. Added custom items in your Admin Panel?
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAdminSyncPanel((prev) => !prev)}
                className="h-8 px-3 text-xs font-semibold rounded-xl border-primary/30 text-primary hover:bg-primary/10"
              >
                <KeyRound className="mr-1.5 h-3.5 w-3.5" />
                {showAdminSyncPanel ? 'Hide Admin Sync' : 'Sync Admin Panel / RLS'}
              </Button>
            </div>

            {showAdminSyncPanel && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2 border-t border-border/70">
                <form
                  onSubmit={handleAdminSignIn}
                  className="rounded-xl border border-border/80 bg-muted/25 p-4 space-y-3"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <KeyRound className="h-3.5 w-3.5 text-primary" />
                    <span>Option 1: Sign In with Admin Panel Credentials</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Authenticate this browser with your Supabase Admin Panel email &amp; password to load RLS-protected <code className="font-mono">spare_parts</code> rows immediately.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <Input
                      type="email"
                      placeholder="Admin email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="h-9 text-xs bg-background"
                      required
                    />
                    <Input
                      type="password"
                      placeholder="Admin password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="h-9 text-xs bg-background"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="submit"
                      disabled={signingIn}
                      size="sm"
                      className="text-xs font-semibold rounded-lg h-8.5 px-3.5"
                    >
                      {signingIn ? 'Connecting...' : 'Connect Admin Session'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => loadParts(true)}
                      className="text-xs rounded-lg h-8.5"
                    >
                      <RefreshCw className="mr-1 h-3 w-3" />
                      Re-Check
                    </Button>
                  </div>
                </form>

                <div className="rounded-xl border border-border/80 bg-muted/25 p-4 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-foreground">
                      Option 2: Enable Public Read Policy in Supabase SQL Editor
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCopySql}
                      className="h-7.5 px-2.5 text-[11px] font-semibold rounded-lg gap-1"
                    >
                      {copiedSql ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-500" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 text-primary" />
                          <span>Copy SQL</span>
                        </>
                      )}
                    </Button>
                  </div>
                  <pre className="p-2.5 rounded-lg bg-slate-950 text-slate-200 font-mono text-[10px] overflow-x-auto leading-relaxed border border-slate-800">
                    {PUBLIC_RLS_SQL_SNIPPET}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Filter, Search, Sort & Cart Control Strip */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              {categoryFilters.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      'px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all duration-150 cursor-pointer select-none',
                      isSelected
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/60'
                    )}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Search Input, Theme-Based Sort Dropdown & Cart Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search name, SKU, fitting..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-8 h-9.5 text-xs rounded-xl bg-card border-border/80"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="flex-1 sm:flex-initial sm:w-52">
                  <CustomSelect
                    id="spare-parts-sort"
                    aria-label="Sort spare parts"
                    value={sortBy}
                    onChange={(val) => setSortBy(val as SortOption)}
                    options={sortOptions}
                    placeholder="Default Order"
                    size="sm"
                    align="right"
                    icon={<ArrowUpDown className="h-3.5 w-3.5" />}
                  />
                </div>

                <Button
                  type="button"
                  onClick={() => loadParts(true)}
                  variant="outline"
                  size="sm"
                  aria-label="Refresh live inventory"
                  className="h-9.5 px-3 rounded-xl text-xs font-semibold shrink-0"
                >
                  <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} />
                </Button>

                {/* Quick Cart Trigger in Control Bar */}
                <Button
                  type="button"
                  onClick={openCart}
                  variant={totalItemsCount > 0 ? 'default' : 'outline'}
                  size="sm"
                  className={cn(
                    'h-9.5 px-3.5 rounded-xl text-xs font-semibold gap-1.5 shrink-0',
                    totalItemsCount > 0 &&
                      'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                  )}
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Cart ({totalItemsCount})</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Active Results Counter Strip */}
          {!loading && !error && parts.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground pt-1">
              <span>
                Showing{' '}
                <strong className="text-foreground font-mono">
                  {filteredAndSortedParts.length}
                </strong>{' '}
                of{' '}
                <strong className="text-foreground font-mono">
                  {parts.length}
                </strong>{' '}
                live inventory items
              </span>
              {(searchQuery ||
                selectedCategory !== 'all' ||
                sortBy !== 'default') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSortBy('default');
                  }}
                  className="text-primary font-semibold hover:underline cursor-pointer"
                >
                  Reset filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border/70 bg-card overflow-hidden p-4 space-y-4 animate-pulse"
              >
                <div className="h-44 w-full rounded-xl bg-muted/70" />
                <div className="space-y-2">
                  <div className="h-3.5 w-24 rounded bg-muted/70" />
                  <div className="h-5 w-3/4 rounded bg-muted/80" />
                  <div className="h-4 w-1/2 rounded bg-muted/60" />
                </div>
                <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                  <div className="h-6 w-20 rounded bg-muted/80" />
                  <div className="h-9 w-28 rounded-xl bg-muted/80" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Database Error State */}
        {!loading && error && (
          <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-6 sm:p-8 text-center space-y-4 max-w-xl mx-auto">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mx-auto">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-bold text-base sm:text-lg text-foreground">
                Unable to Load Live Spare Parts Inventory
              </h3>
              <p className="text-xs text-muted-foreground">
                We encountered a temporary issue connecting to the inventory
                database ({error}). You can retry or contact our parts desk on
                WhatsApp.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <Button
                onClick={() => loadParts(true)}
                size="sm"
                className="text-xs rounded-xl"
              >
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                Retry Connection
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="text-xs rounded-xl"
              >
                <a
                  href={`https://wa.me/${rawPhone}?text=${encodeURIComponent(
                    "Hello Sohan Pipeline's, I would like to enquire about plumbing spare parts availability and pricing."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-1.5 h-3.5 w-3.5 text-emerald-600" />
                  WhatsApp Parts Desk
                </a>
              </Button>
            </div>
          </div>
        )}

        {/* Live Product Grid (When Database Has Matching Rows) */}
        {!loading && !error && filteredAndSortedParts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredAndSortedParts.map((part, index) => {
              const isOutOfStock =
                part.stock !== null &&
                part.stock !== undefined &&
                part.stock <= 0;
              const isLowStock =
                !isOutOfStock &&
                part.stock !== null &&
                part.stock !== undefined &&
                part.stock <= (part.reorder_level || 5);
              const imageSrc = resolveProductImage(part);
              const cardQty = getCardQuantity(part.id);
              const inCartQty = cartQtyById[part.id] || 0;

              return (
                <motion.div
                  key={part.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: Math.min(index * 0.03, 0.25),
                    ease: luxuryEasing,
                  }}
                >
                  <Card
                    className={cn(
                      'group h-full rounded-2xl border bg-card overflow-hidden transition-all duration-200 flex flex-col justify-between shadow-crisp-xs hover:shadow-crisp-md',
                      isOutOfStock
                        ? 'border-border/60 opacity-85'
                        : inCartQty > 0
                        ? 'border-emerald-500/50 dark:border-emerald-500/40'
                        : 'border-border/80 hover:border-primary/50'
                    )}
                  >
                    <div>
                      {/* Product Image Header */}
                      <div className="relative h-48 w-full bg-slate-950/5 dark:bg-slate-950/40 overflow-hidden border-b border-border/60">
                        <Image
                          src={imageSrc}
                          alt={part.name}
                          fill
                          className={cn(
                            'object-cover transition-transform duration-500 group-hover:scale-105',
                            isOutOfStock && 'grayscale-[40%]'
                          )}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-slate-950/20" />

                        {/* Category & In-Cart Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-background/90 backdrop-blur-md text-foreground border border-border/70 shadow-2xs truncate max-w-[65%]">
                            {part.category || 'Plumbing Hardware'}
                          </span>

                          {inCartQty > 0 && (
                            <button
                              type="button"
                              onClick={openCart}
                              className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600 text-white shadow-xs flex items-center gap-1 cursor-pointer hover:bg-emerald-700 transition-colors"
                            >
                              <Check className="h-2.5 w-2.5" />
                              <span>In Cart ({inCartQty})</span>
                            </button>
                          )}
                        </div>

                        {/* Stock Status Badge Bottom-Right */}
                        <div className="absolute bottom-2.5 right-3 left-3 flex items-center justify-between gap-2">
                          {part.sku ? (
                            <span className="text-[10px] font-mono text-white/90 bg-slate-950/70 backdrop-blur-xs px-2 py-0.5 rounded border border-white/15 truncate">
                              SKU: {part.sku}
                            </span>
                          ) : (
                            <span />
                          )}

                          <span
                            className={cn(
                              'px-2 py-0.5 rounded text-[10px] font-semibold backdrop-blur-md border shrink-0',
                              isOutOfStock
                                ? 'bg-destructive/90 text-white border-destructive'
                                : isLowStock
                                ? 'bg-amber-500/90 text-slate-950 border-amber-400 font-bold'
                                : 'bg-emerald-600/90 text-white border-emerald-500/50'
                            )}
                          >
                            {isOutOfStock
                              ? 'Out of Stock'
                              : isLowStock
                              ? `Only ${part.stock} Left`
                              : part.stock !== null && part.stock !== undefined
                              ? `${part.stock} in Stock`
                              : 'In Stock'}
                          </span>
                        </div>
                      </div>

                      {/* Product Info Body */}
                      <CardContent className="p-4 space-y-2.5">
                        <div>
                          {part.brand && (
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary block mb-0.5">
                              {part.brand}
                            </span>
                          )}
                          <h3 className="font-display font-bold text-sm sm:text-base text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                            {part.name}
                          </h3>
                          {part.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                              {part.description}
                            </p>
                          )}
                        </div>

                        {/* Price & Stock Details Row */}
                        <div className="pt-2 border-t border-border/60 flex items-baseline justify-between gap-2">
                          <div>
                            <span className="text-[10px] text-muted-foreground block">
                              Verified Counter Price
                            </span>
                            {part.selling_price !== null &&
                            part.selling_price !== undefined &&
                            Number(part.selling_price) > 0 ? (
                              <div className="flex items-baseline gap-1">
                                <span className="font-mono font-extrabold text-lg text-foreground">
                                  ₹
                                  {Number(part.selling_price).toLocaleString(
                                    'en-IN'
                                  )}
                                </span>
                                {part.unit && (
                                  <span className="text-[10px] text-muted-foreground">
                                    / {part.unit}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs font-semibold text-primary">
                                Price on Enquiry
                              </span>
                            )}
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] text-muted-foreground block">
                              Dispatch
                            </span>
                            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                              {isOutOfStock ? 'On Restock' : 'Ready Today'}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </div>

                    {/* Bottom Actions: Stepper + Add to Cart + Quick WhatsApp */}
                    <div className="p-4 pt-0 space-y-2">
                      <div className="flex items-center gap-2">
                        {!isOutOfStock && (
                          <div className="flex items-center rounded-xl border border-border/80 bg-muted/40 p-0.5 shrink-0">
                            <button
                              type="button"
                              onClick={() =>
                                handleQuantityChange(part.id, -1, part.stock)
                              }
                              disabled={cardQty <= 1}
                              className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-7 text-center text-xs font-bold font-mono text-foreground">
                              {cardQty}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleQuantityChange(part.id, 1, part.stock)
                              }
                              disabled={
                                part.stock !== null &&
                                part.stock !== undefined &&
                                cardQty >= part.stock
                              }
                              className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        )}

                        <Button
                          onClick={() => handleAddToCart(part)}
                          disabled={isOutOfStock}
                          className="flex-1 font-semibold text-xs h-9.5 rounded-xl shadow-xs gap-1.5"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                          <span>
                            {isOutOfStock ? 'Unavailable' : 'Add to Cart'}
                          </span>
                        </Button>
                      </div>

                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full text-xs font-semibold h-8 rounded-xl border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10"
                      >
                        <a
                          href={getDirectWhatsAppUrl(part)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
                          Quick WhatsApp Enquiry
                        </a>
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Empty / RLS Diagnostic State (When 0 rows are returned from public.spare_parts) */}
        {!loading && !error && filteredAndSortedParts.length === 0 && (
          <div className="space-y-8">
            {/* If 0 items are in parts and caller is unauthenticated (`anon`), explain RLS & offer instant Admin Sync + 1-click SQL Policy */}
            {parts.length === 0 && rlsBlocked && (
              <div className="rounded-3xl border border-amber-500/40 bg-card p-6 sm:p-8 shadow-crisp-md space-y-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-border/70 pb-5">
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500 shrink-0 mt-0.5">
                      <Database className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-display font-bold text-base sm:text-lg text-foreground">
                        Admin Panel Spare Parts Detected Behind Supabase RLS
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
                        Your <code className="font-mono text-foreground">public.spare_parts</code> table has Row Level Security (RLS) enabled for{' '}
                        <code className="font-mono text-foreground">authenticated</code> Admin Panel users, which hides rows from anonymous (<code className="font-mono text-foreground">anon</code>) public visitors. Connect your Admin session below to view your parts immediately, or run the 1-click SQL policy in Supabase so all public customers can see them.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  {/* Option 1: Sign in with Admin Panel Credentials to View Immediately */}
                  <form
                    onSubmit={handleAdminSignIn}
                    className="rounded-2xl border border-border/80 bg-muted/25 p-5 space-y-4"
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                      <KeyRound className="h-4 w-4 text-primary" />
                      <span>Option 1: Connect Admin Panel Session in Browser</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Sign in with your Supabase Admin Panel email and password to authenticate this browser and load your <code className="font-mono">spare_parts</code> inventory immediately.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        type="email"
                        placeholder="Admin email address"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        className="h-10 text-xs bg-background"
                        required
                      />
                      <Input
                        type="password"
                        placeholder="Admin password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="h-10 text-xs bg-background"
                        required
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="submit"
                        disabled={signingIn}
                        size="sm"
                        className="text-xs font-semibold rounded-xl h-9 px-4"
                      >
                        {signingIn ? 'Connecting...' : 'Connect Admin & Load Parts'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => loadParts(true)}
                        className="text-xs rounded-xl h-9"
                      >
                        <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                        Re-Check Table
                      </Button>
                    </div>
                  </form>

                  {/* Option 2: 1-Click Copy Public SELECT RLS Policy for All Visitors */}
                  <div className="rounded-2xl border border-border/80 bg-muted/25 p-5 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-foreground">
                        Option 2: Enable Public Read Access in Supabase SQL Editor
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCopySql}
                        className="h-8 px-3 text-xs font-semibold rounded-lg gap-1.5"
                      >
                        {copiedSql ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                            <span>Copied SQL</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5 text-primary" />
                            <span>Copy SQL Policy</span>
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Paste and run this once in your Supabase Dashboard → <strong>SQL Editor</strong> so every customer visiting your website can view your Admin Panel spare parts automatically:
                    </p>
                    <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
                      {PUBLIC_RLS_SQL_SNIPPET}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-crisp-md text-center space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto">
                <Package className="h-7 w-7" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="font-display font-bold text-lg text-foreground">
                  {searchQuery || selectedCategory !== 'all'
                    ? 'No Matching Spare Parts Found'
                    : 'Physical Warehouse Desk & Real-Time Parts Synchronization'}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {searchQuery || selectedCategory !== 'all'
                    ? 'Try adjusting your search terms or clearing category filters to find the plumbing hardware you need.'
                    : 'SOHAN PIPELINES operates an authorized physical supply warehouse in Keshrambha, Dantan. You can enquire directly with our parts manager on WhatsApp for instant counter availability, trade quotes, and on-site delivery.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {searchQuery || selectedCategory !== 'all' ? (
                  <Button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    size="sm"
                    className="text-xs rounded-xl"
                  >
                    Reset Search &amp; Filters
                  </Button>
                ) : (
                  <Button
                    asChild
                    size="lg"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-11 px-5 rounded-xl shadow-xs"
                  >
                    <a
                      href={`https://wa.me/${rawPhone}?text=${encodeURIComponent(
                        "Hello Sohan Pipeline's, I am inquiring about spare parts availability and pricing. Please assist me with my requirements."
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Enquire on WhatsApp Parts Desk
                    </a>
                  </Button>
                )}
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="text-xs rounded-xl border-border/80"
                >
                  <a href={`tel:${businessInfo.phone}`}>
                    <Phone className="mr-1.5 h-3.5 w-3.5 text-primary" />
                    Call Counter: {businessInfo.phoneDisplay}
                  </a>
                </Button>
                <Button
                  onClick={() => loadParts(true)}
                  variant="outline"
                  size="sm"
                  className="text-xs rounded-xl border-border/80"
                >
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                  Refresh Inventory
                </Button>
              </div>
            </div>

            {/* Warehouse Hardware Categories Showcase with Authentic Supabase Storage Assets */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-display font-bold text-base sm:text-lg text-foreground">
                    Authorized Hardware Lines &amp; Trade Brand Directory
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Direct counter supply from our Keshrambha &amp; Dantan
                    warehouse across Paschim and Purba Medinipur
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {warehouseHardwareLines.map((item) => (
                  <Card
                    key={item.title}
                    className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-crisp-xs hover:border-primary/50 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative h-44 w-full bg-slate-950/5 overflow-hidden border-b border-border/60">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2.5 left-2.5">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-background/90 backdrop-blur-md text-foreground border border-border/70">
                            {item.tag}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 space-y-2">
                        <h5 className="font-display font-bold text-sm text-foreground">
                          {item.title}
                        </h5>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {item.desc}
                        </p>
                        <span className="text-[11px] text-primary font-semibold block pt-1">
                          Authorized Brands: {item.brands}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full text-xs font-semibold h-8.5 rounded-xl border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10"
                      >
                        <a
                          href={`https://wa.me/${rawPhone}?text=${encodeURIComponent(
                            `Hello Sohan Pipeline's, I would like to enquire about current stock and pricing for ${item.title} (${item.brands}).`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
                          Enquire Category on WhatsApp
                        </a>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Cart Bar (Appears when customer has items in cart) */}
      <AnimatePresence>
        {totalItemsCount > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.25, ease: luxuryEasing }}
            className="fixed bottom-16 md:bottom-6 left-4 right-4 max-w-lg mx-auto z-40"
          >
            <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-950/95 dark:bg-card/95 text-white dark:text-foreground backdrop-blur-xl border border-primary/40 shadow-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-mono font-bold text-xs shrink-0 shadow-xs">
                  {totalItemsCount}
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] text-slate-300 dark:text-muted-foreground block font-medium truncate">
                    {totalItemsCount}{' '}
                    {totalItemsCount === 1 ? 'item' : 'items'} in cart
                  </span>
                  <span className="font-mono text-sm sm:text-base font-bold text-white dark:text-foreground truncate block">
                    Subtotal: ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  onClick={openCart}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9 px-3.5 rounded-xl shadow-xs gap-1.5"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>WhatsApp Checkout</span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
