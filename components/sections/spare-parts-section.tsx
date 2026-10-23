'use client';

import * as React from 'react';
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
  LogOut,
  Upload,
  Eye,
  Pencil,
  Trash2,
  ImagePlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CustomSelect, type SelectOption } from '@/components/ui/custom-select';
import { SparePartImage } from '@/components/spare-part-image';
import { businessInfo } from '@/lib/business-info';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import {
  fetchLiveSpareParts,
  getCachedSpareParts,
  clearSparePartsCache,
  type DbSparePart,
} from '@/lib/supabase-data';
import {
  SPARE_PARTS_BUCKET_NAME,
  getSparePartImageUrl,
  uploadSparePartImageToBucket,
  normalizeSparePartStoragePath,
} from '@/lib/spare-parts-mapping';
import { useCart } from '@/lib/cart-context';
import { luxuryEasing } from '@/lib/motion';

type SortOption =
  | 'default'
  | 'price-asc'
  | 'price-desc'
  | 'stock-desc'
  | 'name-asc';

const sortOptions: SelectOption[] = [
  {
    value: 'default',
    label: 'Default Order',
    description: 'Latest Admin Panel additions first',
  },
  {
    value: 'price-asc',
    label: 'Price: Low to High',
    description: 'Lowest selling price first',
  },
  {
    value: 'price-desc',
    label: 'Price: High to Low',
    description: 'Highest selling price first',
  },
  {
    value: 'stock-desc',
    label: 'Highest Stock',
    description: 'Most available units first',
  },
  {
    value: 'name-asc',
    label: 'Alphabetical (A–Z)',
    description: 'Sort by spare part name',
  },
];

const defaultCategoryFilters = [
  { id: 'all', label: 'All Hardware' },
  { id: 'pipes', label: 'Pipes & Fittings' },
  { id: 'valves', label: 'Valves & Controls' },
  { id: 'taps', label: 'Taps & Diverters' },
  { id: 'sanitary', label: 'Sanitaryware & Flush' },
  { id: 'heaters', label: 'Geysers & Heating' },
  { id: 'tanks', label: 'Tanks & Accessories' },
];

function getSupplierName(part: DbSparePart): string | null {
  if (!part.suppliers) return null;
  if (Array.isArray(part.suppliers)) {
    return part.suppliers[0]?.name || null;
  }
  return part.suppliers.name || null;
}

interface SparePartsSectionProps {
  initialParts?: DbSparePart[];
}

export function SparePartsSection({ initialParts }: SparePartsSectionProps) {
  const hasInitialParts =
    Array.isArray(initialParts) && initialParts.length > 0;

  const [parts, setParts] = React.useState<DbSparePart[]>(
    () => getCachedSpareParts() ?? (hasInitialParts ? initialParts : [])
  );
  const [loading, setLoading] = React.useState(
    () => !getCachedSpareParts() && !hasInitialParts
  );
  const [error, setError] = React.useState<string | null>(null);

  // Admin session & upload/edit modal state
  const [activeUserEmail, setActiveUserEmail] = React.useState<string | null>(
    null
  );

  // Admin Product Form state (saves image to "Spare Parts" bucket and image_path to public.spare_parts)
  const [showAdminProductModal, setShowAdminProductModal] =
    React.useState(false);
  const [editingPart, setEditingPart] = React.useState<DbSparePart | null>(
    null
  );
  const [formName, setFormName] = React.useState('');
  const [formCategory, setFormCategory] = React.useState('Pipes & Fittings');
  const [formSku, setFormSku] = React.useState('');
  const [formSellingPrice, setFormSellingPrice] = React.useState('');
  const [formPurchasePrice, setFormPurchasePrice] = React.useState('');
  const [formStock, setFormStock] = React.useState('10');
  const [formReorderLevel, setFormReorderLevel] = React.useState('5');
  const [formImageFile, setFormImageFile] = React.useState<File | null>(null);
  const [formImagePath, setFormImagePath] = React.useState('');
  const [savingProduct, setSavingProduct] = React.useState(false);

  // Product Details Modal state (derived from ID so live updates/removals stay synced automatically)
  const [selectedDetailPartId, setSelectedDetailPartId] = React.useState<
    string | null
  >(null);

  const selectedDetailPart = React.useMemo(
    () =>
      selectedDetailPartId
        ? parts.find((p) => p.id === selectedDetailPartId) ?? null
        : null,
    [parts, selectedDetailPartId]
  );

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [sortBy, setSortBy] = React.useState<SortOption>('default');

  // Support deep linking via ?category=... and ?q=...
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get('category')?.toLowerCase();
    const qParam = params.get('q');
    queueMicrotask(() => {
      if (catParam) {
        setSelectedCategory(catParam);
      }
      if (qParam) {
        setSearchQuery(qParam);
      }
    });
  }, []);

  // Quantities for cards before adding to cart (product.id -> quantity)
  const [cardQuantities, setCardQuantities] = React.useState<
    Record<string, number>
  >({});

  const {
    items: cartItems,
    addItem,
    openCart,
    totalItemsCount,
    subtotal,
  } = useCart();

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
    clearSparePartsCache();
    const {
      data,
      error: err,
    } = await fetchLiveSpareParts({
      forceRefresh: true,
    });
    if (err) {
      setError(err);
      setParts([]);
    } else {
      setParts(data);
    }
    setLoading(false);
  }, []);

  // Check active Supabase session, subscribe to live `public.spare_parts` changes, and refresh on window focus
  React.useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setActiveUserEmail(data.session?.user?.email ?? null);
    });

    fetchLiveSpareParts({ forceRefresh: true }).then(
      ({ data, error: err }) => {
        if (!active) return;
        if (err) {
          setError(err);
          setParts([]);
        } else {
          setParts(data);
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

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible' && active) {
        loadParts(false);
      }
    };

    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);

    return () => {
      active = false;
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      supabase.removeChannel(channel);
    };
  }, [loadParts]);

  // Build category tabs combining standard plumbing categories + any custom database categories
  const categoryFilters = React.useMemo(() => {
    const base = [...defaultCategoryFilters];
    const knownLabels = new Set(base.map((b) => b.label.toLowerCase()));
    const knownIds = new Set(base.map((b) => b.id.toLowerCase()));

    for (const part of parts) {
      const cat = part.category?.trim();
      if (!cat) continue;
      const catLower = cat.toLowerCase();
      const matchesBuiltIn =
        knownLabels.has(catLower) ||
        knownIds.has(catLower) ||
        catLower.includes('pipe') ||
        catLower.includes('fitting') ||
        catLower.includes('valve') ||
        catLower.includes('tap') ||
        catLower.includes('diverter') ||
        catLower.includes('sanitary') ||
        catLower.includes('flush') ||
        catLower.includes('geyser') ||
        catLower.includes('heat') ||
        catLower.includes('tank');

      if (!matchesBuiltIn) {
        knownLabels.add(catLower);
        base.push({ id: `exact:${catLower}`, label: cat });
      }
    }
    return base;
  }, [parts]);

  const handleAdminSignOut = async () => {
    await supabase.auth.signOut();
    setActiveUserEmail(null);
    toast.info('Admin session disconnected');
    await loadParts(true);
  };

  const openAddPartModal = () => {
    setEditingPart(null);
    setFormName('');
    setFormCategory('Pipes & Fittings');
    setFormSku('');
    setFormSellingPrice('');
    setFormPurchasePrice('');
    setFormStock('10');
    setFormReorderLevel('5');
    setFormImageFile(null);
    setFormImagePath('');
    setShowAdminProductModal(true);
  };

  const openEditPartModal = (part: DbSparePart) => {
    setEditingPart(part);
    setFormName(part.name || '');
    setFormCategory(part.category || 'Pipes & Fittings');
    setFormSku(part.sku || '');
    setFormSellingPrice(
      part.selling_price !== null && part.selling_price !== undefined
        ? String(part.selling_price)
        : ''
    );
    setFormPurchasePrice(
      part.purchase_price !== null && part.purchase_price !== undefined
        ? String(part.purchase_price)
        : ''
    );
    setFormStock(
      part.stock !== null && part.stock !== undefined ? String(part.stock) : '0'
    );
    setFormReorderLevel(
      part.reorder_level !== null && part.reorder_level !== undefined
        ? String(part.reorder_level)
        : '5'
    );
    setFormImageFile(null);
    setFormImagePath(part.image_path || '');
    setShowAdminProductModal(true);
  };

  const handleSaveAdminProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error('Product name is required');
      return;
    }

    setSavingProduct(true);
    try {
      let finalImagePath: string | null = formImagePath.trim()
        ? normalizeSparePartStoragePath(formImagePath.trim()) ||
          formImagePath.trim()
        : null;

      // 1. If administrator selected an image file, upload it to the existing "Spare Parts" bucket
      if (formImageFile) {
        const uploadRes = await uploadSparePartImageToBucket(
          formImageFile,
          formSku.trim() || formName.trim()
        );
        if (uploadRes.error || !uploadRes.imagePath) {
          toast.error(
            uploadRes.error ||
              `Failed to upload image to "${SPARE_PARTS_BUCKET_NAME}" bucket`
          );
          setSavingProduct(false);
          return;
        }
        finalImagePath = uploadRes.imagePath;
      }

      const payload = {
        name: formName.trim(),
        category: formCategory.trim() || null,
        sku: formSku.trim() || null,
        selling_price: formSellingPrice !== '' ? Number(formSellingPrice) : 0,
        purchase_price:
          formPurchasePrice !== '' ? Number(formPurchasePrice) : null,
        stock: formStock !== '' ? Number(formStock) : 0,
        reorder_level:
          formReorderLevel !== '' ? Number(formReorderLevel) : 5,
        image_path: finalImagePath,
      };

      if (editingPart) {
        const { error: updateErr } = await supabase
          .from('spare_parts')
          .update(payload)
          .eq('id', editingPart.id);

        if (updateErr) {
          toast.error(`Failed to update spare part: ${updateErr.message}`);
          return;
        }
        toast.success(`Updated "${payload.name}" in catalog`);
      } else {
        const { error: insertErr } = await supabase
          .from('spare_parts')
          .insert(payload);

        if (insertErr) {
          toast.error(`Failed to add spare part: ${insertErr.message}`);
          return;
        }
        toast.success(
          `Added "${payload.name}" to spare parts catalog`
        );
      }

      setShowAdminProductModal(false);
      await loadParts(false);
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteAdminProduct = async (part: DbSparePart) => {
    const { error: delErr } = await supabase
      .from('spare_parts')
      .delete()
      .eq('id', part.id);

    if (delErr) {
      toast.error(`Unable to remove spare part: ${delErr.message}`);
      return;
    }

    if (part.image_path) {
      const cleanPath = normalizeSparePartStoragePath(part.image_path);
      if (cleanPath) {
        await supabase.storage
          .from(SPARE_PARTS_BUCKET_NAME)
          .remove([cleanPath]);
      }
    }

    toast.success(`Removed "${part.name}" from inventory`);
    if (selectedDetailPart?.id === part.id) {
      setSelectedDetailPartId(null);
    }
    await loadParts(false);
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
    const resolvedImage = getSparePartImageUrl(part);
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
      const supplierName = getSupplierName(part);
      const matchesSearch =
        !q ||
        part.name.toLowerCase().includes(q) ||
        (part.category && part.category.toLowerCase().includes(q)) ||
        (part.sku && part.sku.toLowerCase().includes(q)) ||
        (supplierName && supplierName.toLowerCase().includes(q)) ||
        (part.description && part.description.toLowerCase().includes(q));

      if (!matchesSearch) return false;
      if (selectedCategory === 'all') return true;

      if (selectedCategory.startsWith('exact:')) {
        const target = selectedCategory.slice(6);
        return (part.category || '').trim().toLowerCase() === target;
      }

      const catLower =
        `${part.category || ''} ${part.name || ''}`.toLowerCase();
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
              Authorized Counter Rates
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <MessageCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold text-foreground truncate">
              Direct WhatsApp Enquiry
            </span>
          </div>
        </div>

        {/* Active Counter Manager Session Banner (when authenticated) */}
        {activeUserEmail && (
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs">
            <div className="flex items-center gap-2.5 text-emerald-700 dark:text-emerald-300 font-medium">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>
                Inventory Manager ({activeUserEmail}) · {parts.length} catalog items active
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                size="sm"
                onClick={openAddPartModal}
                className="h-8 px-3 text-xs font-semibold rounded-xl gap-1.5"
              >
                <ImagePlus className="h-3.5 w-3.5" />
                Add Spare Part &amp; Upload Image
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => loadParts(true)}
                className="h-8 px-2.5 text-xs rounded-xl"
              >
                <RefreshCw className="mr-1 h-3 w-3" />
                Sync Now
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAdminSignOut}
                className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground rounded-xl"
              >
                <LogOut className="mr-1 h-3 w-3" />
                Sign Out
              </Button>
            </div>
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
                  placeholder="Search name, SKU, category..."
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
                  <RefreshCw
                    className={cn('h-3.5 w-3.5', loading && 'animate-spin')}
                  />
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
                genuine plumbing spare parts
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
                    <div className="h-3.5 w-1/2 rounded bg-muted/60" />
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
                We encountered a temporary issue loading the live spare parts
                catalog. You can retry or contact our parts desk directly on
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

        {/* Live Product Grid (Rendered from actual public.spare_parts records & "Spare Parts" Storage bucket) */}
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
              const cardQty = getCardQuantity(part.id);
              const inCartQty = cartQtyById[part.id] || 0;
              const supplierName = getSupplierName(part);

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
                      'group h-full p-0 gap-0 rounded-2xl border bg-card overflow-hidden transition-all duration-200 flex flex-col justify-between shadow-crisp-xs hover:shadow-crisp-md',
                      isOutOfStock
                        ? 'border-border/60 opacity-85'
                        : inCartQty > 0
                        ? 'border-emerald-500/50 dark:border-emerald-500/40'
                        : 'border-border/80 hover:border-primary/50'
                    )}
                  >
                    <div>
                      {/* Dedicated Unobstructed Product Image Container (Aligned to Top, 4:3 Aspect Ratio, Object-Contain) */}
                      <div
                        onClick={() => setSelectedDetailPartId(part.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedDetailPartId(part.id);
                          }
                        }}
                        className="relative w-full aspect-[4/3] bg-white dark:bg-slate-900/95 overflow-hidden border-b border-border/60 cursor-pointer"
                      >
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

                      {/* Product Info & Dedicated Non-Obstructive Metadata Badges */}
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
                                className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600 text-white shadow-2xs flex items-center gap-1 cursor-pointer hover:bg-emerald-700 transition-colors"
                              >
                                <Check className="h-2.5 w-2.5" />
                                <span>In Cart ({inCartQty})</span>
                              </button>
                            )}
                            <span
                              className={cn(
                                'px-2 py-0.5 rounded-md text-[10px] font-semibold border shrink-0',
                                isOutOfStock
                                  ? 'bg-destructive/10 text-destructive border-destructive/30'
                                  : isLowStock
                                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 font-bold'
                                  : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25'
                              )}
                            >
                              {isOutOfStock
                                ? 'Out of Stock'
                                : isLowStock
                                ? `Only ${part.stock} Left`
                                : part.stock !== null &&
                                  part.stock !== undefined
                                ? `${part.stock} in Stock`
                                : 'In Stock'}
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            {(part.brand || supplierName) ? (
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary truncate">
                                {part.brand || supplierName}
                              </span>
                            ) : (
                              <span />
                            )}
                            {part.sku && (
                              <span className="text-[10px] font-mono text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded border border-border/60 shrink-0">
                                SKU: {part.sku}
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => setSelectedDetailPartId(part.id)}
                            className="text-left font-display font-bold text-sm sm:text-base text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors cursor-pointer"
                          >
                            {part.name}
                          </button>
                          {part.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                              {part.description}
                            </p>
                          )}
                        </div>

                        {/* Price & View Details Row */}
                        <div className="pt-2 border-t border-border/60 flex items-baseline justify-between gap-2">
                          <div>
                            <span className="text-[10px] text-muted-foreground block">
                              Selling Price
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
                            <button
                              type="button"
                              onClick={() => setSelectedDetailPartId(part.id)}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                            >
                              <Eye className="h-3 w-3" />
                              <span>View Details</span>
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </div>

                    {/* Bottom Actions: Stepper + Add to Cart + Quick WhatsApp + Admin Quick Edit */}
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
                            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
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

                      {/* Admin Quick Edit / Delete Controls when Admin session is active */}
                      {activeUserEmail && (
                        <div className="pt-1.5 border-t border-border/50 flex items-center justify-between gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditPartModal(part)}
                            className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground"
                          >
                            <Pencil className="mr-1 h-3 w-3" />
                            Edit / Replace Image
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAdminProduct(part)}
                            className="h-7 px-2 text-[11px] text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="mr-1 h-3 w-3" />
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Empty State (When 0 items match or catalog is being updated) */}
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
                    : 'Direct Hardware Counter Supply'}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {searchQuery || selectedCategory !== 'all'
                    ? 'Try adjusting your search terms or clearing category filters to find the plumbing hardware you need.'
                    : 'Enquire directly with our Midnapore & Dantan hardware counter for genuine CPVC/UPVC pipes, brass ball valves, diverters, and sanitary fittings.'}
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
                ) : activeUserEmail ? (
                  <Button
                    onClick={openAddPartModal}
                    size="sm"
                    className="text-xs font-semibold rounded-xl gap-1.5"
                  >
                    <ImagePlus className="h-3.5 w-3.5" />
                    Add First Spare Part
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
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      <AnimatePresence>
        {selectedDetailPart && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDetailPartId(null)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.22, ease: luxuryEasing }}
              role="dialog"
              aria-modal="true"
              aria-label={selectedDetailPart.name}
              className="relative z-10 w-full max-w-2xl rounded-3xl border border-border/80 bg-card shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
            >
              <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[360px] bg-white dark:bg-slate-900/95 border-b md:border-b-0 md:border-r border-border/60">
                <SparePartImage
                  name={selectedDetailPart.name}
                  category={selectedDetailPart.category}
                  imagePath={selectedDetailPart.image_path}
                  imageUrl={selectedDetailPart.image_url}
                  isOutOfStock={
                    selectedDetailPart.stock !== null &&
                    selectedDetailPart.stock !== undefined &&
                    selectedDetailPart.stock <= 0
                  }
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              <div className="p-6 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                      {selectedDetailPart.category || 'Plumbing Hardware'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedDetailPartId(null)}
                      aria-label="Close product details"
                      className="h-8 w-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-lg sm:text-xl text-foreground leading-snug">
                      {selectedDetailPart.name}
                    </h3>
                    {selectedDetailPart.sku && (
                      <p className="text-xs font-mono text-muted-foreground mt-1">
                        SKU: {selectedDetailPart.sku}
                      </p>
                    )}
                    {getSupplierName(selectedDetailPart) && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Supplier: {getSupplierName(selectedDetailPart)}
                      </p>
                    )}
                  </div>

                  {selectedDetailPart.description && (
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {selectedDetailPart.description}
                    </p>
                  )}

                  <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/70 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">
                        Selling Price
                      </span>
                      {selectedDetailPart.selling_price !== null &&
                      selectedDetailPart.selling_price !== undefined &&
                      Number(selectedDetailPart.selling_price) > 0 ? (
                        <span className="font-mono font-extrabold text-xl text-foreground">
                          ₹
                          {Number(
                            selectedDetailPart.selling_price
                          ).toLocaleString('en-IN')}
                        </span>
                      ) : (
                        <span className="text-sm font-semibold text-primary">
                          Price on Enquiry
                        </span>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-muted-foreground block">
                        Available Stock
                      </span>
                      <span
                        className={cn(
                          'text-xs font-bold',
                          selectedDetailPart.stock !== null &&
                            selectedDetailPart.stock !== undefined &&
                            selectedDetailPart.stock <= 0
                            ? 'text-destructive'
                            : 'text-emerald-600 dark:text-emerald-400'
                        )}
                      >
                        {selectedDetailPart.stock !== null &&
                        selectedDetailPart.stock !== undefined
                          ? selectedDetailPart.stock <= 0
                            ? 'Out of Stock'
                            : `${selectedDetailPart.stock} Units Available`
                          : 'Available'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-border/60">
                  <div className="flex items-center gap-2.5">
                    {!(
                      selectedDetailPart.stock !== null &&
                      selectedDetailPart.stock !== undefined &&
                      selectedDetailPart.stock <= 0
                    ) && (
                      <div className="flex items-center rounded-xl border border-border/80 bg-muted/40 p-0.5 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            handleQuantityChange(
                              selectedDetailPart.id,
                              -1,
                              selectedDetailPart.stock
                            )
                          }
                          disabled={
                            getCardQuantity(selectedDetailPart.id) <= 1
                          }
                          className="h-9 w-9 rounded-lg flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold font-mono text-foreground">
                          {getCardQuantity(selectedDetailPart.id)}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleQuantityChange(
                              selectedDetailPart.id,
                              1,
                              selectedDetailPart.stock
                            )
                          }
                          disabled={
                            selectedDetailPart.stock !== null &&
                            selectedDetailPart.stock !== undefined &&
                            getCardQuantity(selectedDetailPart.id) >=
                              selectedDetailPart.stock
                          }
                          className="h-9 w-9 rounded-lg flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}

                    <Button
                      onClick={() => {
                        handleAddToCart(selectedDetailPart);
                        setSelectedDetailPartId(null);
                      }}
                      disabled={
                        selectedDetailPart.stock !== null &&
                        selectedDetailPart.stock !== undefined &&
                        selectedDetailPart.stock <= 0
                      }
                      className="flex-1 h-10 rounded-xl font-semibold text-xs gap-1.5"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span>Add to Cart</span>
                    </Button>
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full h-9.5 rounded-xl text-xs font-semibold border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10"
                  >
                    <a
                      href={getDirectWhatsAppUrl(selectedDetailPart)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
                      Enquire on WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Add / Edit Spare Part & "Spare Parts" Bucket Upload Modal */}
      <AnimatePresence>
        {showAdminProductModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdminProductModal(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              role="dialog"
              aria-modal="true"
              aria-label={
                editingPart ? 'Edit Spare Part' : 'Add New Spare Part'
              }
              className="relative z-10 w-full max-w-lg rounded-3xl border border-border/80 bg-card p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-foreground">
                    {editingPart
                      ? 'Edit Spare Part & Image'
                      : 'Add New Spare Part'}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Update spare part details, pricing, stock count, and product photo.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAdminProductModal(false)}
                  className="h-8 w-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSaveAdminProduct} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">
                    Product Name *
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Astral CPVC 1 Inch Ball Valve"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="h-9.5 text-xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground block">
                      Category
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. Valves & Controls"
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="h-9.5 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground block">
                      SKU Code
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. AST-BV-100"
                      value={formSku}
                      onChange={(e) => setFormSku(e.target.value)}
                      className="h-9.5 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground block">
                      Selling Price (₹)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="380"
                      value={formSellingPrice}
                      onChange={(e) => setFormSellingPrice(e.target.value)}
                      className="h-9.5 text-xs font-mono"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground block">
                      Stock Quantity
                    </label>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="20"
                      value={formStock}
                      onChange={(e) => setFormStock(e.target.value)}
                      className="h-9.5 text-xs font-mono"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground block">
                      Reorder Level
                    </label>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="5"
                      value={formReorderLevel}
                      onChange={(e) => setFormReorderLevel(e.target.value)}
                      className="h-9.5 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2 rounded-2xl border border-border/80 bg-muted/25 p-4">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Upload className="h-3.5 w-3.5 text-primary" />
                    <span>Upload Product Photo</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormImageFile(e.target.files?.[0] ?? null)
                    }
                    className="block w-full text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                  />
                  <div className="pt-1">
                    <label className="text-[11px] text-muted-foreground block mb-1">
                      Or specify existing product image path:
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. parts/fbef290d-579d-475f-8f9f-b901d5e6a1ab.jpg"
                      value={formImagePath}
                      onChange={(e) => setFormImagePath(e.target.value)}
                      className="h-8.5 text-xs font-mono bg-background"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAdminProductModal(false)}
                    className="rounded-xl text-xs h-9"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={savingProduct}
                    size="sm"
                    className="rounded-xl text-xs font-semibold h-9 px-4"
                  >
                    {savingProduct
                      ? 'Saving Spare Part...'
                      : editingPart
                      ? 'Save Changes'
                      : 'Save Spare Part'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                  <span>Review &amp; Send on WhatsApp</span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
