'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CustomSelect, type SelectOption } from '@/components/ui/custom-select';
import { businessInfo } from '@/lib/business-info';
import { cn } from '@/lib/utils';
import {
  fetchLiveSpareParts,
  getCachedSpareParts,
  type DbSparePart,
} from '@/lib/supabase-data';
import {
  resolveProductImage,
  SPARE_PARTS_STORAGE_ASSETS,
} from '@/lib/spare-parts-mapping';
import { useCart } from '@/lib/cart-context';
import { luxuryEasing } from '@/lib/motion';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'stock-desc' | 'name-asc';

const sortOptions: SelectOption[] = [
  {
    value: 'default',
    label: 'Default Order',
    description: 'Standard warehouse catalog sequence',
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
  const [parts, setParts] = React.useState<DbSparePart[]>(
    () => getCachedSpareParts() ?? initialParts ?? []
  );
  const [loading, setLoading] = React.useState(
    () => !getCachedSpareParts() && !initialParts
  );
  const [error, setError] = React.useState<string | null>(null);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [sortBy, setSortBy] = React.useState<SortOption>('default');

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
    const { data, error: err } = await fetchLiveSpareParts({ forceRefresh: true });
    if (err) {
      setError(err);
      setParts([]);
    } else {
      setParts(data);
    }
    setLoading(false);
  }, []);

  React.useEffect(() => {
    let active = true;
    fetchLiveSpareParts().then(({ data, error: err }) => {
      if (!active) return;
      if (err) {
        setError(err);
        setParts([]);
      } else {
        setParts(data);
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  // Update card quantity
  const handleQuantityChange = (id: string, delta: number, maxStock: number | null | undefined) => {
    setCardQuantities((prev) => {
      const current = prev[id] || 1;
      const next = current + delta;
      if (next < 1) return prev;
      if (maxStock !== null && maxStock !== undefined && next > maxStock) return prev;
      return { ...prev, [id]: next };
    });
  };

  // Add to cart from card
  const handleAddToCart = (part: DbSparePart) => {
    const qty = cardQuantities[part.id] || 1;
    const imageUrl = resolveProductImage(part);
    addItem(
      {
        id: part.id,
        name: part.name,
        sku: part.sku,
        category: part.category,
        selling_price: part.selling_price ?? null,
        stock: part.stock ?? null,
        image_url: imageUrl,
      },
      qty
    );
    // Reset card quantity counter back to 1
    setCardQuantities((prev) => ({ ...prev, [part.id]: 1 }));
  };

  // Build direct WhatsApp URL for single item
  const getDirectWhatsAppUrl = (part: DbSparePart) => {
    const priceText = part.selling_price ? `₹${part.selling_price}` : 'Price on warehouse enquiry';
    const skuText = part.sku ? ` (SKU: ${part.sku})` : '';
    const qty = cardQuantities[part.id] || 1;
    const message = `Hello Sohan Pipeline's, I am inquiring about availability and purchase for the spare part "${part.name}"${skuText} — Quantity: ${qty}. Listed Price: ${priceText}. Please confirm current stock, final pricing, and delivery/pickup availability.`;
    return `https://wa.me/${rawPhone}?text=${encodeURIComponent(message)}`;
  };

  // Filtered and sorted products
  const filteredAndSortedParts = React.useMemo(() => {
    let result = parts.filter((part) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        part.name.toLowerCase().includes(q) ||
        (part.sku && part.sku.toLowerCase().includes(q)) ||
        (part.category && part.category.toLowerCase().includes(q)) ||
        (part.description && part.description.toLowerCase().includes(q)) ||
        (part.brand && part.brand.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (selectedCategory === 'all') return true;
      const combined = `${part.name} ${part.category || ''} ${part.description || ''}`.toLowerCase();

      if (selectedCategory === 'pipes') {
        return (
          combined.includes('pipe') ||
          combined.includes('fitting') ||
          combined.includes('cpvc') ||
          combined.includes('upvc') ||
          combined.includes('swr') ||
          combined.includes('elbow') ||
          combined.includes('bend') ||
          combined.includes('tee') ||
          combined.includes('coupling') ||
          combined.includes('solvent')
        );
      }
      if (selectedCategory === 'valves') {
        return (
          combined.includes('valve') ||
          combined.includes('cock') ||
          combined.includes('regulator') ||
          combined.includes('stop') ||
          combined.includes('check')
        );
      }
      if (selectedCategory === 'taps') {
        return (
          combined.includes('tap') ||
          combined.includes('diverter') ||
          combined.includes('faucet') ||
          combined.includes('bib') ||
          combined.includes('shower')
        );
      }
      if (selectedCategory === 'sanitary') {
        return (
          combined.includes('sanitary') ||
          combined.includes('commode') ||
          combined.includes('flush') ||
          combined.includes('cistern') ||
          combined.includes('basin') ||
          combined.includes('trap')
        );
      }
      if (selectedCategory === 'heaters') {
        return (
          combined.includes('geyser') ||
          combined.includes('heater') ||
          combined.includes('hot water') ||
          combined.includes('thermal')
        );
      }
      if (selectedCategory === 'tanks') {
        return (
          combined.includes('tank') ||
          combined.includes('float') ||
          combined.includes('motor') ||
          combined.includes('pump') ||
          combined.includes('foot valve')
        );
      }

      return true;
    });

    // Apply sorting
    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => (a.selling_price || 0) - (b.selling_price || 0));
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => (b.selling_price || 0) - (a.selling_price || 0));
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
            <span className="font-semibold text-foreground truncate">100% Genuine Fittings</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Truck className="h-4 w-4 text-primary shrink-0" />
            <span className="font-semibold text-foreground truncate">Warehouse Dispatch</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold text-foreground truncate">Verified Database Rates</span>
          </div>
          <div className="flex items-center gap-2.5">
            <MessageCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold text-foreground truncate">Direct WhatsApp Checkout</span>
          </div>
        </div>

        {/* Filter, Search, Sort & Cart Control Strip */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category Filter Pills */}
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

            {/* Search Input, Sort Selector & Cart Button */}
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

              {/* Theme-Based Sort Dropdown & Cart Trigger */}
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

                {/* Quick Cart Trigger in Control Bar */}
                <Button
                  type="button"
                  onClick={openCart}
                  variant={totalItemsCount > 0 ? 'default' : 'outline'}
                  size="sm"
                  className={cn(
                    'h-9.5 px-3.5 rounded-xl text-xs font-semibold gap-1.5 shrink-0',
                    totalItemsCount > 0 && 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
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
                Showing <strong className="text-foreground font-mono">{filteredAndSortedParts.length}</strong> of{' '}
                <strong className="text-foreground font-mono">{parts.length}</strong> live inventory items
              </span>
              {(searchQuery || selectedCategory !== 'all' || sortBy !== 'default') && (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 py-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="h-96 rounded-2xl border border-border/70 bg-card/60 p-4 flex flex-col justify-between animate-pulse"
              >
                <div className="space-y-3">
                  <div className="h-44 rounded-xl bg-muted/60" />
                  <div className="h-5 w-3/4 rounded bg-muted/70" />
                  <div className="h-3 w-1/2 rounded bg-muted/50" />
                  <div className="h-6 w-1/3 rounded bg-muted/60" />
                </div>
                <div className="h-10 rounded-xl bg-muted/50" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-6 rounded-2xl border border-destructive/30 bg-destructive/5 text-center space-y-3">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
            <h4 className="font-display font-bold text-sm text-foreground">
              Unable to Load Spare Parts
            </h4>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">{error}</p>
            <Button
              onClick={() => loadParts(true)}
              size="sm"
              variant="outline"
              className="text-xs rounded-xl"
            >
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Retry Connection
            </Button>
          </div>
        )}

        {/* Products Grid (When database items are present) */}
        {!loading && !error && filteredAndSortedParts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredAndSortedParts.map((part) => {
              const imageUrl = resolveProductImage(part);
              const cardQty = cardQuantities[part.id] || 1;
              const inCartQty = cartQtyById[part.id] || 0;
              const isOutOfStock =
                part.stock !== null && part.stock !== undefined && part.stock <= 0;
              const isLowStock =
                part.stock !== null &&
                part.stock !== undefined &&
                part.stock > 0 &&
                part.reorder_level !== null &&
                part.reorder_level !== undefined &&
                part.stock <= part.reorder_level;

              return (
                <motion.div
                  key={part.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, ease: luxuryEasing }}
                  whileHover={{ y: -3 }}
                  className="gpu-accelerated h-full"
                >
                  <Card className="h-full border border-border/80 bg-card hover:border-primary/50 transition-[border-color,box-shadow] duration-200 rounded-2xl overflow-hidden shadow-crisp-xs hover:shadow-crisp-md flex flex-col justify-between group">
                    <div>
                      {/* Product Visual Container with Supabase Storage Asset */}
                      <div className="relative h-48 w-full bg-slate-950/5 dark:bg-slate-900/40 overflow-hidden border-b border-border/60">
                        <Image
                          src={imageUrl}
                          alt={part.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          referrerPolicy="no-referrer"
                        />

                        {/* Category Tag */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-background/90 backdrop-blur-md text-foreground border border-border/70 shadow-xs">
                            {part.category || 'Plumbing Hardware'}
                          </span>
                          {inCartQty > 0 && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-primary text-primary-foreground shadow-xs">
                              In Cart: {inCartQty}
                            </span>
                          )}
                        </div>

                        {/* SKU Badge */}
                        {part.sku && (
                          <div className="absolute top-2.5 right-2.5">
                            <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded bg-slate-950/80 text-white backdrop-blur-sm">
                              {part.sku}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content Body */}
                      <CardContent className="p-4 space-y-2.5">
                        <h3 className="font-display font-bold text-sm text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                          {part.name}
                        </h3>

                        {part.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {part.description}
                          </p>
                        )}

                        {/* Price & Stock Row */}
                        <div className="flex items-baseline justify-between pt-2 border-t border-border/50">
                          <div>
                            <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                              Verified Price
                            </span>
                            <span className="font-display text-lg font-bold text-foreground font-mono">
                              {part.selling_price ? `₹${part.selling_price.toLocaleString('en-IN')}` : 'Enquire'}
                            </span>
                            {part.unit && (
                              <span className="text-[10px] text-muted-foreground ml-1">
                                / {part.unit}
                              </span>
                            )}
                          </div>

                          {/* Stock Status Badge */}
                          <div>
                            {isOutOfStock ? (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-destructive/10 text-destructive border border-destructive/20 inline-flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                                Out of Stock
                              </span>
                            ) : isLowStock ? (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 inline-flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                Only {part.stock} left
                              </span>
                            ) : part.stock !== null && part.stock !== undefined ? (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 inline-flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                In Stock ({part.stock})
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 inline-flex items-center gap-1">
                                <Check className="h-3 w-3" />
                                Available
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </div>

                    {/* Bottom Actions: Stepper + Add to Cart + Quick WhatsApp */}
                    <div className="p-4 pt-0 space-y-2">
                      <div className="flex items-center gap-2">
                        {/* Quantity Stepper */}
                        {!isOutOfStock && (
                          <div className="flex items-center rounded-xl border border-border/80 bg-muted/40 p-0.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(part.id, -1, part.stock)}
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
                              onClick={() => handleQuantityChange(part.id, 1, part.stock)}
                              disabled={part.stock !== null && part.stock !== undefined && cardQty >= part.stock}
                              className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        )}

                        {/* Add to Cart Button */}
                        <Button
                          onClick={() => handleAddToCart(part)}
                          disabled={isOutOfStock}
                          className="flex-1 font-semibold text-xs h-9.5 rounded-xl shadow-xs gap-1.5"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                          <span>{isOutOfStock ? 'Unavailable' : 'Add to Cart'}</span>
                        </Button>
                      </div>

                      {/* Direct Quick WhatsApp Button (Native Anchor) */}
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

        {/* Empty State / Warehouse Desk (When 0 items match filter or table has 0 rows) */}
        {!loading && !error && filteredAndSortedParts.length === 0 && (
          <div className="space-y-8">
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
                    Direct counter supply from our Keshrambha &amp; Dantan warehouse across Paschim and Purba Medinipur
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
                    {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} in cart
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
