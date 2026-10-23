'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Package,
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  Check,
  Truck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SparePartImage } from '@/components/spare-part-image';
import { supabase } from '@/lib/supabase';
import {
  fetchLiveSpareParts,
  getCachedSpareParts,
  type DbSparePart,
} from '@/lib/supabase-data';
import { getSparePartImageUrl } from '@/lib/spare-parts-mapping';
import { useCart } from '@/lib/cart-context';
import { businessInfo } from '@/lib/business-info';
import { cn } from '@/lib/utils';
import { luxuryEasing } from '@/lib/motion';

export function HomeSparePartsPreview() {
  const [parts, setParts] = React.useState<DbSparePart[]>(
    () => getCachedSpareParts() ?? []
  );
  const [loading, setLoading] = React.useState(() => !getCachedSpareParts());
  const { items: cartItems, addItem, openCart, totalItemsCount } = useCart();

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

  React.useEffect(() => {
    let active = true;

    const load = async (force = false) => {
      const { data } = await fetchLiveSpareParts({ forceRefresh: force });
      if (!active) return;
      setParts(data);
      setLoading(false);
    };

    load(false);

    const channel = supabase
      .channel('home-spare-parts-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'spare_parts' },
        () => {
          if (active) {
            load(true);
          }
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const featuredParts = React.useMemo(() => parts.slice(0, 4), [parts]);

  const handleQuickAdd = (part: DbSparePart) => {
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
        image_path: part.image_path ?? null,
        image_url: getSparePartImageUrl(part),
      },
      1
    );
  };

  return (
    <section className="py-16 lg:py-20 bg-background border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, ease: luxuryEasing }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.065em] text-primary mb-2.5">
              <span>02. Authorized Hardware Counter</span>
              <span aria-hidden="true">·</span>
              <span className="text-muted-foreground font-medium">
                Live Spare Parts Inventory
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-4xl font-bold tracking-tight text-foreground text-balance">
              Genuine Plumbing Spare Parts &amp; Pipeline Fittings
            </h2>
            <p className="mt-3 text-base text-muted-foreground leading-relaxed text-pretty font-normal">
              Direct counter supply of pressure-rated CPVC/UPVC pipes, brass ball valves, quarter-turn bib taps, and sanitaryware mechanisms with instant WhatsApp enquiry.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {totalItemsCount > 0 && (
              <Button
                type="button"
                onClick={openCart}
                variant="outline"
                size="sm"
                className="font-semibold text-xs h-10 rounded-xl border-emerald-500/40 text-emerald-700 dark:text-emerald-400"
              >
                <ShoppingBag className="mr-1.5 h-3.5 w-3.5" />
                Cart ({totalItemsCount})
              </Button>
            )}
            <Button
              asChild
              size="sm"
              className="font-semibold text-xs h-10 px-4 rounded-xl shadow-xs"
            >
              <Link href="/spare-parts">
                View All Spare Parts
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-border/70 bg-card overflow-hidden p-0 space-y-0 animate-pulse flex flex-col justify-between"
              >
                <div className="w-full aspect-[4/3] bg-muted/60 border-b border-border/50" />
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="h-4 w-24 rounded-md bg-muted/70" />
                    <div className="h-4 w-16 rounded-md bg-muted/70" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-5 w-3/4 rounded bg-muted/80" />
                  </div>
                  <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                    <div className="h-6 w-20 rounded bg-muted/80" />
                    <div className="h-9 w-28 rounded-xl bg-muted/80" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Featured Live Database Spare Parts Grid */}
        {!loading && featuredParts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredParts.map((part, index) => {
              const inCartQty = cartQtyById[part.id] || 0;
              const isOutOfStock =
                part.stock !== null &&
                part.stock !== undefined &&
                part.stock <= 0;

              return (
                <motion.div
                  key={part.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.04,
                    ease: luxuryEasing,
                  }}
                >
                  <Card className="group h-full p-0 gap-0 rounded-2xl border border-border/80 bg-card overflow-hidden transition-all duration-200 flex flex-col justify-between shadow-crisp-xs hover:shadow-crisp-md hover:border-primary/50">
                    <div>
                      <div className="relative w-full aspect-[4/3] bg-white dark:bg-slate-900/95 overflow-hidden border-b border-border/60">
                        <SparePartImage
                          name={part.name}
                          category={part.category}
                          imagePath={part.image_path}
                          imageUrl={part.image_url}
                          isOutOfStock={isOutOfStock}
                          className="group-hover:scale-[1.03]"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      </div>

                      <CardContent className="p-4 space-y-2.5">
                        {/* Category & Stock Status Row (Placed cleanly outside image area) */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 truncate max-w-[58%]">
                            {part.category || 'Plumbing Hardware'}
                          </span>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {inCartQty > 0 && (
                              <button
                                type="button"
                                onClick={openCart}
                                className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600 text-white flex items-center gap-1 cursor-pointer"
                              >
                                <Check className="h-2.5 w-2.5" />
                                <span>{inCartQty}</span>
                              </button>
                            )}
                            <span
                              className={cn(
                                'px-2 py-0.5 rounded-md text-[10px] font-semibold border shrink-0',
                                isOutOfStock
                                  ? 'bg-destructive/10 text-destructive border-destructive/30'
                                  : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25'
                              )}
                            >
                              {isOutOfStock
                                ? 'Out of Stock'
                                : part.stock !== null && part.stock !== undefined
                                ? `${part.stock} in Stock`
                                : 'In Stock'}
                            </span>
                          </div>
                        </div>

                        <div>
                          {part.sku && (
                            <span className="inline-block text-[10px] font-mono text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded border border-border/60 mb-1">
                              SKU: {part.sku}
                            </span>
                          )}
                          <h3 className="font-display font-bold text-sm text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                            {part.name}
                          </h3>
                        </div>

                        <div className="pt-2 border-t border-border/60 flex items-baseline justify-between gap-2">
                          <div>
                            <span className="text-[10px] text-muted-foreground block">
                              Selling Price
                            </span>
                            {part.selling_price !== null &&
                            part.selling_price !== undefined &&
                            Number(part.selling_price) > 0 ? (
                              <span className="font-mono font-extrabold text-base text-foreground">
                                ₹
                                {Number(part.selling_price).toLocaleString(
                                  'en-IN'
                                )}
                              </span>
                            ) : (
                              <span className="text-xs font-semibold text-primary">
                                Price on Enquiry
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            {isOutOfStock ? 'Restocking' : 'Available'}
                          </span>
                        </div>
                      </CardContent>
                    </div>

                    <div className="p-4 pt-0 flex items-center gap-2">
                      <Button
                        type="button"
                        onClick={() => handleQuickAdd(part)}
                        disabled={isOutOfStock}
                        size="sm"
                        className="flex-1 text-xs font-semibold h-9 rounded-xl gap-1.5"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        <span>
                          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                        </span>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-9 px-3 rounded-xl border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10"
                      >
                        <a
                          href={`https://wa.me/${rawPhone}?text=${encodeURIComponent(
                            `Hello Sohan Pipeline's, I would like to enquire about ${part.name}${
                              part.sku ? ` [SKU: ${part.sku}]` : ''
                            }.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Enquire about ${part.name} on WhatsApp`}
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Empty State on Home Preview (when database currently returns 0 visible rows) */}
        {!loading && featuredParts.length === 0 && (
          <div className="rounded-3xl border border-border/80 bg-card p-8 sm:p-10 text-center space-y-4 shadow-crisp-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto">
              <Package className="h-6 w-6" />
            </div>
            <div className="max-w-lg mx-auto space-y-1.5">
              <h3 className="font-display font-bold text-lg text-foreground">
                Plumbing Spare Parts &amp; Hardware Counter
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Visit our Spare Parts Storefront to browse live warehouse inventory or send a direct WhatsApp parts enquiry to our Keshrambha &amp; Dantan counter.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <Button asChild size="sm" className="rounded-xl font-semibold text-xs">
                <Link href="/spare-parts">
                  Open Spare Parts Storefront
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="rounded-xl font-semibold text-xs border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
              >
                <a
                  href={`https://wa.me/${rawPhone}?text=${encodeURIComponent(
                    "Hello Sohan Pipeline's, I would like to enquire about plumbing spare parts availability and pricing."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
                  WhatsApp Parts Desk
                </a>
              </Button>
            </div>
          </div>
        )}

        {/* Bottom Warehouse Highlights Strip */}
        <div className="mt-8 rounded-2xl border border-border/70 bg-muted/25 p-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-muted-foreground">
            <span className="flex items-center gap-2 font-medium text-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Authorized Astral, Supreme, Finolex &amp; Jaquar Supply
            </span>
            <span className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              Same-Day Counter Pickup &amp; Site Delivery in Dantan &amp; Midnapore
            </span>
          </div>
          <Link
            href="/spare-parts"
            className="font-bold text-primary hover:underline whitespace-nowrap flex items-center gap-1"
          >
            <Package className="h-3.5 w-3.5" />
            <span>View All Spare Parts &rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
