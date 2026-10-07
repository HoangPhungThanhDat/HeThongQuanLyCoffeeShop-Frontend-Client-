// src/features/cart/useCart.js
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

/* =========================================================
   CONSTANTS
   ========================================================= */
const CART_KEY = 'cart';
const CART_UPDATED_EVENT = 'cartUpdated';
const MAX_QTY = 99;
const MIN_QTY = 1;

/* =========================================================
   STORAGE HELPERS
   ========================================================= */
const readCartFromStorage = () => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item) => item && typeof item === 'object' && item.id != null)
      .map((item) => ({
        ...item,
        // ⭐ Chuẩn hóa ảnh — đảm bảo luôn có imageUrl và image
        imageUrl:
          item.imageUrl || item.image || item.imageURL || item.image_path || '',
        image:
          item.image || item.imageUrl || item.imageURL || item.image_path || '',
        qty: normalizeQty(item.qty ?? item.quantity ?? 1),
      }));
  } catch (err) {
    console.warn('[useCart] Lỗi đọc localStorage:', err);
    return [];
  }
};

const writeCartToStorage = (cart) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    return true;
  } catch (err) {
    console.error('[useCart] Lỗi ghi localStorage:', err);
    return false;
  }
};

const emitCartUpdated = () => {
  try {
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
  } catch {
    /* noop */
  }
};

/* =========================================================
   VALIDATION HELPERS
   ========================================================= */
const normalizeQty = (value) => {
  const n = parseInt(value, 10);
  if (Number.isNaN(n) || n < MIN_QTY) return MIN_QTY;
  if (n > MAX_QTY) return MAX_QTY;
  return n;
};

const isValidProduct = (product) => {
  return product && typeof product === 'object' && product.id != null;
};

/* =========================================================
   HOOK: useCart
   ========================================================= */
export function useCart() {
  const [cart, setCart] = useState(() => readCartFromStorage());
  const isUpdatingRef = useRef(false);

  /* ---------- Sync với các tab / component khác ---------- */
  useEffect(() => {
    const sync = () => {
      if (isUpdatingRef.current) return;
      setCart(readCartFromStorage());
    };

    window.addEventListener('storage', sync);
    window.addEventListener(CART_UPDATED_EVENT, sync);

    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener(CART_UPDATED_EVENT, sync);
    };
  }, []);

  /* =========================================================
     CORE MUTATOR
     ========================================================= */
  const mutateCart = useCallback((mutator) => {
    setCart((prev) => {
      const next = mutator(prev);
      if (next === prev) return prev;

      isUpdatingRef.current = true;
      const ok = writeCartToStorage(next);
      isUpdatingRef.current = false;

      if (ok) emitCartUpdated();
      return next;
    });
  }, []);

  /* =========================================================
     COMPUTED VALUES
     ========================================================= */
  const stats = useMemo(() => {
    let totalItems = 0;
    let totalPrice = 0;

    for (const item of cart) {
      const qty = item.qty || 0;
      totalItems += qty;
      totalPrice += (item.price || 0) * qty;
    }

    return {
      cartCount: cart.length,
      totalItems,
      totalPrice,
    };
  }, [cart]);

  /* =========================================================
     ACTIONS
     ========================================================= */

  /**
   * Thêm sản phẩm vào giỏ — TỰ ĐỘNG chuẩn hóa field ảnh
   */
  const addToCart = useCallback(
    (product, quantity = 1) => {
      if (!isValidProduct(product)) {
        console.warn('[useCart] addToCart: sản phẩm không hợp lệ', product);
        return;
      }

      const qtyToAdd = normalizeQty(quantity);

      // ⭐ Chuẩn hóa ảnh — hỗ trợ nhiều tên field
      const normalizedImage =
        product.imageUrl ||
        product.image ||
        product.imageURL ||
        product.image_path ||
        '';

      // ⭐ Object sạch — luôn có field ảnh
      const cleanProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: normalizedImage,
        image: normalizedImage,
        categoryId: product.category?.id ?? product.categoryId,
        stockQuantity: product.stockQuantity,
      };

      mutateCart((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.id === cleanProduct.id,
        );

        if (existingIndex !== -1) {
          const next = [...prev];
          next[existingIndex] = {
            ...next[existingIndex],
            // Bổ sung ảnh nếu item cũ thiếu
            imageUrl: next[existingIndex].imageUrl || cleanProduct.imageUrl,
            image: next[existingIndex].image || cleanProduct.image,
            qty: normalizeQty((next[existingIndex].qty || 0) + qtyToAdd),
          };
          return next;
        }

        return [...prev, { ...cleanProduct, qty: qtyToAdd }];
      });
    },
    [mutateCart],
  );

  const removeFromCart = useCallback(
    (productId) => {
      mutateCart((prev) => {
        const next = prev.filter((item) => item.id !== productId);
        return next.length === prev.length ? prev : next;
      });
    },
    [mutateCart],
  );

  const removeByIndex = useCallback(
    (index) => {
      mutateCart((prev) => {
        if (index < 0 || index >= prev.length) return prev;
        return prev.filter((_, i) => i !== index);
      });
    },
    [mutateCart],
  );

  const updateQuantity = useCallback(
    (productId, quantity) => {
      const qty = normalizeQty(quantity);
      mutateCart((prev) => {
        const idx = prev.findIndex((item) => item.id === productId);
        if (idx === -1) return prev;
        if (prev[idx].qty === qty) return prev;

        const next = [...prev];
        next[idx] = { ...next[idx], qty };
        return next;
      });
    },
    [mutateCart],
  );

  const updateQtyByIndex = useCallback(
    (index, quantity) => {
      const qty = normalizeQty(quantity);
      mutateCart((prev) => {
        if (index < 0 || index >= prev.length) return prev;
        if (prev[index].qty === qty) return prev;

        const next = [...prev];
        next[index] = { ...next[index], qty };
        return next;
      });
    },
    [mutateCart],
  );

  const increaseQty = useCallback(
    (productId) => {
      mutateCart((prev) => {
        const idx = prev.findIndex((item) => item.id === productId);
        if (idx === -1) return prev;
        if (prev[idx].qty >= MAX_QTY) return prev;

        const next = [...prev];
        next[idx] = { ...next[idx], qty: prev[idx].qty + 1 };
        return next;
      });
    },
    [mutateCart],
  );

  const decreaseQty = useCallback(
    (productId) => {
      mutateCart((prev) => {
        const idx = prev.findIndex((item) => item.id === productId);
        if (idx === -1) return prev;
        if (prev[idx].qty <= MIN_QTY) return prev;

        const next = [...prev];
        next[idx] = { ...next[idx], qty: prev[idx].qty - 1 };
        return next;
      });
    },
    [mutateCart],
  );

  const clearCart = useCallback(() => {
    try {
      localStorage.removeItem(CART_KEY);
    } catch (err) {
      console.warn('[useCart] Lỗi xóa localStorage:', err);
    }
    setCart([]);
    emitCartUpdated();
  }, []);

  const refreshCart = useCallback(() => {
    setCart(readCartFromStorage());
  }, []);

  const isInCart = useCallback(
    (productId) => cart.some((item) => item.id === productId),
    [cart],
  );

  const getItemQty = useCallback(
    (productId) => {
      const item = cart.find((it) => it.id === productId);
      return item?.qty || 0;
    },
    [cart],
  );

  return {
    cart,
    cartCount: stats.cartCount,
    totalItems: stats.totalItems,
    totalPrice: stats.totalPrice,
    isEmpty: stats.cartCount === 0,

    addToCart,
    removeFromCart,
    removeByIndex,
    updateQuantity,
    updateQtyByIndex,
    increaseQty,
    decreaseQty,
    clearCart,
    refreshCart,

    isInCart,
    getItemQty,

    readCart: refreshCart,
  };
}

export { CART_KEY, MAX_QTY, MIN_QTY };