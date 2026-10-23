'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { CartItem, OrderSummary, Product, ProductColor, ProductStorage, WishlistItem } from '@/types';
import { APPLECARE_PRICE } from '@/data/site';

const CART_KEY = 'aurora.cart.v1';
const WISHLIST_KEY = 'aurora.wishlist.v1';
const SAVED_KEY = 'aurora.saved.v1';
const ORDER_KEY = 'aurora.order.v1';

export interface ToastState {
  id: number;
  title: string;
  description?: string;
  tone: 'success' | 'info';
}

interface StoreContextValue {
  cart: CartItem[];
  wishlist: WishlistItem[];
  savedForLater: CartItem[];
  hydrated: boolean;
  toast: ToastState | null;
  cartCount: number;
  cartSubtotal: number;
  addToCart: (
    product: Product,
    color: ProductColor,
    storage: ProductStorage,
    quantity?: number,
    appleCare?: boolean,
  ) => void;
  removeFromCart: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  saveForLater: (key: string) => void;
  removeSavedForLater: (key: string) => void;
  moveSavedToCart: (key: string) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  moveToCart: (product: Product) => void;
  showToast: (title: string, description?: string, tone?: ToastState['tone']) => void;
  dismissToast: () => void;
  saveOrder: (order: OrderSummary) => void;
  getSavedOrder: () => OrderSummary | null;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable (private mode / quota) — silently ignore */
  }
}

export function cartItemKey(productId: string, color: string, storage: string) {
  return `${productId}::${color}::${storage}`;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [savedForLater, setSavedForLater] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load persisted state once on the client so the server and first client
  // render always match (no hydration mismatch).
  useEffect(() => {
    setCart(readJSON<CartItem[]>(CART_KEY, []));
    setWishlist(readJSON<WishlistItem[]>(WISHLIST_KEY, []));
    setSavedForLater(readJSON<CartItem[]>(SAVED_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(CART_KEY, cart);
  }, [cart, hydrated]);

  useEffect(() => {
    if (hydrated) writeJSON(WISHLIST_KEY, wishlist);
  }, [wishlist, hydrated]);

  useEffect(() => {
    if (hydrated) writeJSON(SAVED_KEY, savedForLater);
  }, [savedForLater, hydrated]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const showToast = useCallback((title: string, description?: string, tone: ToastState['tone'] = 'success') => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), title, description, tone });
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  const addToCart = useCallback(
    (
      product: Product,
      color: ProductColor,
      storage: ProductStorage,
      quantity = 1,
      appleCare = false,
    ) => {
      const key = cartItemKey(product.id, color.name, storage.label) + (appleCare ? '::ac' : '');
      const unitPrice = storage.price + (appleCare ? APPLECARE_PRICE : 0);
      setCart((prev) => {
        const existing = prev.find((item) => item.key === key);
        if (existing) {
          return prev.map((item) =>
            item.key === key ? { ...item, quantity: Math.min(item.quantity + quantity, 10) } : item,
          );
        }
        const newItem: CartItem = {
          key,
          productId: product.id,
          name: product.name,
          image: product.image,
          categoryLabel: product.categoryLabel,
          color: color.name,
          colorHex: color.hex,
          storage: storage.label,
          unitPrice,
          quantity,
          chip: product.chip,
          appleCare: appleCare || undefined,
        };
        return [...prev, newItem];
      });
      showToast(
        `${product.name} added to bag`,
        `${color.name} • ${storage.label}${appleCare ? ' • AppleCare+' : ''}`,
      );
    },
    [showToast],
  );

  const removeFromCart = useCallback(
    (key: string) => {
      setCart((prev) => {
        const target = prev.find((item) => item.key === key);
        if (target) showToast(`${target.name} removed`, 'Item removed from your bag', 'info');
        return prev.filter((item) => item.key !== key);
      });
    },
    [showToast],
  );

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setCart((prev) =>
      prev.flatMap((item) =>
        item.key === key
          ? quantity <= 0
            ? []
            : [{ ...item, quantity: Math.min(quantity, 10) }]
          : [item],
      ),
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const saveForLater = useCallback(
    (key: string) => {
      setCart((prev) => {
        const target = prev.find((item) => item.key === key);
        if (!target) return prev;
        setSavedForLater((saved) =>
          saved.some((item) => item.key === key) ? saved : [...saved, { ...target, quantity: 1 }],
        );
        showToast(`${target.name} saved for later`, undefined, 'info');
        return prev.filter((item) => item.key !== key);
      });
    },
    [showToast],
  );

  const removeSavedForLater = useCallback(
    (key: string) => {
      setSavedForLater((prev) => {
        const target = prev.find((item) => item.key === key);
        if (target) showToast(`${target.name} removed from saved items`, undefined, 'info');
        return prev.filter((item) => item.key !== key);
      });
    },
    [showToast],
  );

  const moveSavedToCart = useCallback(
    (key: string) => {
      setSavedForLater((prev) => {
        const target = prev.find((item) => item.key === key);
        if (!target) return prev;
        setCart((items) =>
          items.some((item) => item.key === key)
            ? items
            : [...items, { ...target, quantity: 1 }],
        );
        showToast(`${target.name} moved to your bag`);
        return prev.filter((item) => item.key !== key);
      });
    },
    [showToast],
  );

  const toggleWishlist = useCallback(
    (product: Product) => {
      setWishlist((prev) => {
        const exists = prev.some((item) => item.productId === product.id);
        if (exists) {
          showToast(`${product.name} removed from wishlist`, undefined, 'info');
          return prev.filter((item) => item.productId !== product.id);
        }
        showToast(`${product.name} saved to wishlist`);
        return [
          ...prev,
          {
            productId: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            categoryLabel: product.categoryLabel,
          },
        ];
      });
    },
    [showToast],
  );

  const isInWishlist = useCallback(
    (productId: string) => wishlist.some((item) => item.productId === productId),
    [wishlist],
  );

  const moveToCart = useCallback(
    (product: Product) => {
      const color = product.colors[0];
      const storage = product.storages[0];
      addToCart(product, color, storage);
      setWishlist((prev) => prev.filter((item) => item.productId !== product.id));
    },
    [addToCart],
  );

  const saveOrder = useCallback((order: OrderSummary) => {
    writeJSON(ORDER_KEY, order);
  }, []);

  const getSavedOrder = useCallback(() => readJSON<OrderSummary | null>(ORDER_KEY, null), []);

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const cartSubtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [cart],
  );

  const value = useMemo<StoreContextValue>(
    () => ({
      cart,
      wishlist,
      savedForLater,
      hydrated,
      toast,
      cartCount,
      cartSubtotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      saveForLater,
      removeSavedForLater,
      moveSavedToCart,
      toggleWishlist,
      isInWishlist,
      moveToCart,
      showToast,
      dismissToast,
      saveOrder,
      getSavedOrder,
    }),
    [
      cart,
      wishlist,
      savedForLater,
      hydrated,
      toast,
      cartCount,
      cartSubtotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      saveForLater,
      removeSavedForLater,
      moveSavedToCart,
      toggleWishlist,
      isInWishlist,
      moveToCart,
      showToast,
      dismissToast,
      saveOrder,
      getSavedOrder,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used inside <StoreProvider>');
  }
  return context;
}
