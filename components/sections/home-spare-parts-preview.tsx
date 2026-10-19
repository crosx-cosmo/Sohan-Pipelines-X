'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
import {
  fetchLiveSpareParts,
  getCachedSpareParts,
  WAREHOUSE_CATALOG_SPARE_PARTS,
  type DbSparePart,
} from '@/lib/supabase-data';
import { resolveProductImage } from '@/lib/spare-parts-mapping';
import { useCart } from '@/lib/cart-context';
import { businessInfo } from '@/lib/business-info';
import { cn } from '@/lib/utils';
import { luxuryEasing } from '@/lib/motion';

export function HomeSparePartsPreview() {
  const [parts, setParts] = React.useState<DbSparePart[]>(
    () => getCachedSpareParts() ?? WAREHOUSE_CATALOG_SPARE_PARTS
  );
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
    fetchLiveSpareParts({ forceRefresh: false }).then(({ data }) => {
      if (!active) return;
      if (data && data.length > 0) {
        setParts(data);
      }
    });
    return () => {
      active = false;
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
        image_url: resolveProductImage(part),
      },
      1
    );
  };

  return (
    <section className="py-20 lg:py-28 bg-background border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: luxuryEasing }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
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
              Direct counter supply of pressure-rated CPVC/UPVC pipes, brass ball valves, quarter-turn bib taps, and sanitaryware mechanisms with instant WhatsApp checkout.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {totalItemsCount > 0 && (
              <Button
                type="button"
                onClick={openCart}
                variant="outline"
                size="sm"
                className="font-semibold text-xs h-9.5 rounded-xl border-emerald-500/40 text-emerald-700 dark:text-emerald-400"
              >
                <ShoppingBag className="mr-1.5 h-3.5 w-3.5" />
                Cart ({totalItemsCount})
              </Button>
            )}
            <Button
              asChild
              size="sm"
              className="font-semibold text-xs h-9.5 rounded-xl shadow-sm"
            >
              <Link href="/spare-parts">
                Explore All Spare Parts ({parts.length})
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* 4-Card Featured Spare Parts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredParts.map((part, index) => {
            const imageSrc = resolveProductImage(part);
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
                <Card className="group h-full rounded-2xl border border-border/80 bg-card overflow-hidden transition-all duration-200 flex flex-col justify-between shadow-crisp-xs hover:shadow-crisp-md hover:border-primary/50">
                  <div>
                    <div className="relative h-44 w-full bg-slate-950/5 dark:bg-slate-950/40 overflow-hidden border-b border-border/60">
                      <Image
                        src={imageSrc}
                        alt={part.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-slate-950/20" />

                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-background/90 backdrop-blur-md text-foreground border border-border/70 truncate max-w-[70%]">
                          {part.category || 'Plumbing Hardware'}
                        </span>
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
                      </div>

                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between gap-2">
                        {part.sku ? (
                          <span className="text-[10px] font-mono text-white/90 bg-slate-950/70 backdrop-blur-xs px-2 py-0.5 rounded border border-white/15 truncate">
                            {part.sku}
                          </span>
                        ) : (
                          <span />
                        )}
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded text-[10px] font-semibold backdrop-blur-md border shrink-0',
                            isOutOfStock
                              ? 'bg-destructive/90 text-white border-destructive'
                              : 'bg-emerald-600/90 text-white border-emerald-500/50'
                          )}
                        >
                          {isOutOfStock
                            ? 'Out of Stock'
                            : part.stock
                            ? `${part.stock} in Stock`
                            : 'In Stock'}
                        </span>
                      </div>
                    </div>

                    <CardContent className="p-4 space-y-2.5">
                      <div>
                        {part.brand && (
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary block mb-0.5">
                            {part.brand}
                          </span>
                        )}
                        <h3 className="font-display font-bold text-sm text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                          {part.name}
                        </h3>
                      </div>

                      <div className="pt-2 border-t border-border/60 flex items-baseline justify-between gap-2">
                        <div>
                          <span className="text-[10px] text-muted-foreground block">
                            Counter Price
                          </span>
                          <span className="font-mono font-extrabold text-base text-foreground">
                            ₹
                            {Number(part.selling_price || 0).toLocaleString(
                              'en-IN'
                            )}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          Ready Today
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
                      <span>Add to Cart</span>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="h-9 px-3 rounded-xl border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10"
                    >
                      <a
                        href={`https://wa.me/${rawPhone}?text=${encodeURIComponent(
                          `Hello Sohan Pipeline's, I would like to enquire about ${part.name} [SKU: ${part.sku || 'N/A'}].`
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
            <span>Open Full Spare Parts Catalogue &rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
