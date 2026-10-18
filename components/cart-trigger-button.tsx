'use client';

import * as React from 'react';
import { ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CartTriggerButtonProps {
  className?: string;
  showLabel?: boolean;
}

export function CartTriggerButton({ className, showLabel = false }: CartTriggerButtonProps) {
  const { openCart, totalItemsCount } = useCart();

  return (
    <Button
      type="button"
      variant="outline"
      size={showLabel ? 'sm' : 'icon'}
      onClick={openCart}
      className={cn(
        'relative rounded-xl border-border/80 hover:bg-muted/70 transition-all select-none',
        showLabel ? 'h-9 px-3 gap-2' : 'h-9 w-9',
        totalItemsCount > 0 && 'border-primary/50 text-primary',
        className
      )}
      aria-label={`Open shopping cart (${totalItemsCount} items)`}
    >
      <ShoppingBag className="h-4 w-4" />
      {showLabel && <span className="text-xs font-semibold">Cart</span>}

      <AnimatePresence>
        {totalItemsCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className="absolute -top-1.5 -right-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow-sm font-mono pointer-events-none"
          >
            {totalItemsCount > 99 ? '99+' : totalItemsCount}
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );
}
