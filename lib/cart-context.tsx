'use client';

import * as React from 'react';
import { toast } from 'sonner';

export interface CartItem {
  id: string;
  name: string;
  sku?: string | null;
  category?: string | null;
  selling_price: number | null;
  stock: number | null;
  image_url: string | null;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => boolean;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItemsCount: number;
  subtotal: number;
  hasUnpricedItems: boolean;
}

const CartContext = React.createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'sohan_pipelines_cart_v1';

const EMPTY_CART: CartItem[] = [];
let memoryCart: CartItem[] = EMPTY_CART;
let isLoadedFromStorage = false;
const subscribers = new Set<() => void>();

function notifySubscribers() {
  subscribers.forEach((cb) => cb());
}

function subscribeToCart(callback: () => void) {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

function getClientCartSnapshot(): CartItem[] {
  if (typeof window === 'undefined') return EMPTY_CART;
  if (!isLoadedFromStorage) {
    isLoadedFromStorage = true;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          memoryCart = parsed;
        }
      }
    } catch {
      // Ignore storage read errors
    }
  }
  return memoryCart;
}

function getServerCartSnapshot(): CartItem[] {
  return EMPTY_CART;
}

function updateStoredCart(updater: (prev: CartItem[]) => CartItem[]) {
  const current = getClientCartSnapshot();
  const next = updater(current);
  memoryCart = next;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage write quota errors
    }
  }
  notifySubscribers();
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = React.useSyncExternalStore(
    subscribeToCart,
    getClientCartSnapshot,
    getServerCartSnapshot
  );

  const [isCartOpen, setIsCartOpen] = React.useState(false);

  const openCart = React.useCallback(() => setIsCartOpen(true), []);
  const closeCart = React.useCallback(() => setIsCartOpen(false), []);
  const toggleCart = React.useCallback(() => setIsCartOpen((prev) => !prev), []);

  const addItem = React.useCallback(
    (product: Omit<CartItem, 'quantity'>, addQty = 1): boolean => {
      // Prevent out-of-stock items from being added
      if (
        product.stock !== null &&
        product.stock !== undefined &&
        product.stock <= 0
      ) {
        toast.error('Item is currently out of stock', {
          description: `${product.name} is currently unavailable for enquiry.`,
        });
        return false;
      }

      updateStoredCart((prevItems) => {
        const existingIndex = prevItems.findIndex((it) => it.id === product.id);

        if (existingIndex > -1) {
          const current = prevItems[existingIndex];
          const newQty = current.quantity + addQty;

          if (
            product.stock !== null &&
            product.stock !== undefined &&
            newQty > product.stock
          ) {
            toast.warning(`Only ${product.stock} units available`, {
              description: `Quantity for "${product.name}" capped at maximum available stock.`,
            });
            const updated = [...prevItems];
            updated[existingIndex] = {
              ...current,
              ...product,
              quantity: product.stock,
            };
            return updated;
          }

          const updated = [...prevItems];
          updated[existingIndex] = {
            ...current,
            ...product,
            quantity: newQty,
          };
          return updated;
        }

        const initialQty = Math.max(1, addQty);
        if (
          product.stock !== null &&
          product.stock !== undefined &&
          initialQty > product.stock
        ) {
          toast.warning(`Only ${product.stock} units available`, {
            description: `Quantity for "${product.name}" adjusted to available warehouse stock.`,
          });
          return [...prevItems, { ...product, quantity: product.stock }];
        }

        return [...prevItems, { ...product, quantity: initialQty }];
      });

      toast.success(`Added ${product.name} to cart`, {
        description: product.selling_price
          ? `Price: ₹${product.selling_price}`
          : 'Price on warehouse enquiry',
        action: {
          label: 'View Cart',
          onClick: () => setIsCartOpen(true),
        },
      });

      return true;
    },
    []
  );

  const removeItem = React.useCallback((id: string) => {
    updateStoredCart((prev) => {
      const target = prev.find((it) => it.id === id);
      if (target) {
        toast.info(`Removed ${target.name} from cart`);
      }
      return prev.filter((it) => it.id !== id);
    });
  }, []);

  const updateQuantity = React.useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      updateStoredCart((prev) => prev.filter((it) => it.id !== id));
      return;
    }

    updateStoredCart((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;

        if (it.stock !== null && it.stock !== undefined && quantity > it.stock) {
          toast.warning(`Only ${it.stock} units in stock`);
          return { ...it, quantity: it.stock };
        }

        return { ...it, quantity };
      })
    );
  }, []);

  const clearCart = React.useCallback(() => {
    updateStoredCart(() => EMPTY_CART);
    toast.info('Cart cleared');
  }, []);

  const totalItemsCount = React.useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const subtotal = React.useMemo(() => {
    return items.reduce((sum, item) => {
      const price = item.selling_price || 0;
      return sum + price * item.quantity;
    }, 0);
  }, [items]);

  const hasUnpricedItems = React.useMemo(() => {
    return items.some((item) => !item.selling_price || item.selling_price <= 0);
  }, [items]);

  const value = React.useMemo(
    () => ({
      items,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItemsCount,
      subtotal,
      hasUnpricedItems,
    }),
    [
      items,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItemsCount,
      subtotal,
      hasUnpricedItems,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
