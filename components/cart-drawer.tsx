'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  User,
  Copy,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SparePartImage } from '@/components/spare-part-image';
import { useCart } from '@/lib/cart-context';
import { buildCartWhatsAppMessage, getCartWhatsAppUrl } from '@/lib/whatsapp-checkout';
import { cn } from '@/lib/utils';
import { luxuryEasing } from '@/lib/motion';

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
    totalItemsCount,
    subtotal,
    hasUnpricedItems,
  } = useCart();

  const [customerName, setCustomerName] = React.useState('');
  const [deliveryArea, setDeliveryArea] = React.useState('');
  const [additionalNotes, setAdditionalNotes] = React.useState('');
  const [showCustomerFields, setShowCustomerFields] = React.useState(false);
  const [showMessagePreview, setShowMessagePreview] = React.useState(false);
  const [copiedSummary, setCopiedSummary] = React.useState(false);

  // Close on escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Lock body scroll when drawer is open
  React.useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  const customerInfo = React.useMemo(
    () => ({
      customerName: customerName.trim() || undefined,
      deliveryArea: deliveryArea.trim() || undefined,
      additionalNotes: additionalNotes.trim() || undefined,
    }),
    [customerName, deliveryArea, additionalNotes]
  );

  const formattedWhatsAppMessage = React.useMemo(
    () => buildCartWhatsAppMessage(items, customerInfo),
    [items, customerInfo]
  );

  const checkoutWhatsAppUrl = React.useMemo(
    () => getCartWhatsAppUrl(items, customerInfo),
    [items, customerInfo]
  );

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(formattedWhatsAppMessage);
      setCopiedSummary(true);
      toast.success('Order summary copied to clipboard', {
        description: 'You can paste this list directly into WhatsApp or SMS.',
      });
      setTimeout(() => setCopiedSummary(false), 2500);
    } catch {
      toast.error('Unable to copy automatically');
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: luxuryEasing }}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping Cart Drawer"
            className="relative w-full max-w-md bg-card border-l border-border/80 shadow-2xl flex flex-col h-full z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-border/70 flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-foreground leading-tight">
                    Your Parts Cart
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} selected
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCart}
                    className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive"
                  >
                    Clear All
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeCart}
                  className="h-9 w-9 rounded-xl hover:bg-muted"
                  aria-label="Close cart"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground">
                    <ShoppingBag className="h-8 w-8 stroke-1" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-base text-foreground">
                      Your Cart is Empty
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
                      Browse our spare parts catalog and add genuine fittings, pipes, or valves to your inquiry.
                    </p>
                  </div>
                  <Button
                    asChild
                    className="font-semibold text-xs h-9.5 px-4 rounded-xl shadow-xs"
                  >
                    <Link href="/spare-parts" onClick={closeCart}>
                      Browse Spare Parts
                    </Link>
                  </Button>
                </div>
              ) : (
                items.map((item) => {
                  const lineTotal = (item.selling_price || 0) * item.quantity;
                  const isMaxStock =
                    item.stock !== null &&
                    item.stock !== undefined &&
                    item.quantity >= item.stock;

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="p-3.5 rounded-2xl border border-border/70 bg-card hover:border-border transition-colors flex gap-3.5"
                    >
                      {/* Product Thumbnail */}
                      <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-muted/60 shrink-0 border border-border/50">
                        <SparePartImage
                          name={item.name}
                          category={item.category}
                          imagePath={item.image_path}
                          imageUrl={item.image_url}
                          sizes="80px"
                          compact
                        />
                      </div>

                      {/* Content & Actions */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="font-display font-semibold text-xs sm:text-sm text-foreground line-clamp-2 leading-snug">
                              {item.name}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="text-muted-foreground hover:text-destructive p-1 rounded-md transition-colors cursor-pointer"
                              aria-label={`Remove ${item.name}`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2 mt-1">
                            {item.sku && (
                              <span className="font-mono text-[9px] font-bold px-1.5 py-0.2 rounded bg-muted text-muted-foreground">
                                {item.sku}
                              </span>
                            )}
                            <span className="text-xs font-bold text-foreground font-mono">
                              {item.selling_price ? `₹${item.selling_price}` : 'Enquire'}
                            </span>
                          </div>
                        </div>

                        {/* Quantity Controls & Line Total */}
                        <div className="flex items-center justify-between pt-2 border-t border-border/40 mt-2">
                          <div className="flex items-center rounded-lg border border-border/70 bg-muted/30 p-0.5">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-6 w-6 rounded-md flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold font-mono text-foreground">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={isMaxStock}
                              className={cn(
                                'h-6 w-6 rounded-md flex items-center justify-center transition-colors',
                                isMaxStock
                                  ? 'opacity-40 cursor-not-allowed text-muted-foreground'
                                  : 'hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer'
                              )}
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <span className="font-mono text-xs font-bold text-foreground">
                            {item.selling_price ? `₹${lineTotal.toLocaleString('en-IN')}` : 'TBD'}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}

              {/* Optional Customer Notes Accordion */}
              {items.length > 0 && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCustomerFields((prev) => !prev)}
                    className="flex items-center justify-between w-full p-2.5 rounded-xl border border-border/60 bg-muted/20 text-xs font-semibold text-foreground hover:bg-muted/40 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-primary" />
                      <span>Add Your Name &amp; Delivery Location (Optional)</span>
                    </span>
                    <span className="text-muted-foreground text-[10px]">
                      {showCustomerFields ? 'Hide' : 'Add'}
                    </span>
                  </button>

                  {showCustomerFields && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3 mt-2 rounded-xl border border-border/60 bg-muted/20 space-y-2.5 text-xs"
                    >
                      <div>
                        <label className="text-[10px] font-semibold text-muted-foreground block mb-1">
                          Customer Name
                        </label>
                        <Input
                          type="text"
                          placeholder="e.g. Subhajit Mondal"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="h-8.5 text-xs rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-muted-foreground block mb-1">
                          Delivery Locality / Town
                        </label>
                        <Input
                          type="text"
                          placeholder="e.g. Dantan / Kharagpur / Midnapore"
                          value={deliveryArea}
                          onChange={(e) => setDeliveryArea(e.target.value)}
                          className="h-8.5 text-xs rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-muted-foreground block mb-1">
                          Special Specification / Pipe Size Notes
                        </label>
                        <Input
                          type="text"
                          placeholder="e.g. Need plumber for fitting as well"
                          value={additionalNotes}
                          onChange={(e) => setAdditionalNotes(e.target.value)}
                          className="h-8.5 text-xs rounded-lg"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Checkout Actions */}
            {items.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-border/70 bg-card space-y-3">
                {/* Summary Table */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Selected Items</span>
                    <span className="font-mono font-medium">{totalItemsCount} units</span>
                  </div>
                  <div className="flex items-center justify-between text-foreground font-semibold">
                    <span>Estimated Subtotal</span>
                    <span className="font-mono text-base font-bold text-primary">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  {hasUnpricedItems && (
                    <p className="text-[10px] text-amber-600 dark:text-amber-400">
                      * Some items have wholesale rates confirmed upon stock lookup.
                    </p>
                  )}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setShowMessagePreview((prev) => !prev)}
                      className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                    >
                      {showMessagePreview
                        ? 'Hide WhatsApp Message Preview'
                        : 'Preview Prefilled WhatsApp Message'}
                    </button>
                    {showMessagePreview && (
                      <pre className="mt-1.5 max-h-32 overflow-y-auto rounded-xl border border-border/70 bg-muted/40 p-2.5 font-mono text-[10px] leading-relaxed text-foreground whitespace-pre-wrap">
                        {formattedWhatsAppMessage}
                      </pre>
                    )}
                  </div>
                </div>

                {/* Primary WhatsApp Checkout Button (Native Anchor) */}
                <div className="flex flex-col gap-2">
                  <Button
                    asChild
                    size="lg"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm h-11 rounded-xl shadow-md"
                  >
                    <a
                      href={checkoutWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Send Cart on WhatsApp to Confirm</span>
                    </a>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopySummary}
                    className="w-full text-xs font-semibold h-8.5 rounded-xl border-border/80"
                  >
                    {copiedSummary ? (
                      <>
                        <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-600" />
                        <span>Summary Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="mr-1.5 h-3.5 w-3.5" />
                        <span>Copy Enquiry List</span>
                      </>
                    )}
                  </Button>
                </div>

                {/* Notice & Guarantees */}
                <div className="flex items-start gap-2 text-[10px] text-muted-foreground leading-relaxed pt-0.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    Sending this inquiry connects you directly with our parts counter team. Final stock, contractor discounts, and delivery/pickup will be confirmed with you.
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
