'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product } from '@/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, variant?: string, quantity?: number) => void;
  removeFromCart: (key: string) => void;
  updateQuantity: (key: string, delta: number) => void;
  clearCart: () => void;
  totalCount: number;
  totalPrice: number;

  // Cart Drawer
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;

  // Product Quick Preview Modal
  previewProduct: Product | null;
  isPreviewOpen: boolean;
  openPreviewModal: (product: Product) => void;
  closePreviewModal: () => void;

  // Booking Modal
  isBookingOpen: boolean;
  openBookingModal: () => void;
  closeBookingModal: () => void;

  // Toast
  toast: { show: boolean; message: string; title: string } | null;
  showToast: (title: string, message: string) => void;
  hideToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_CART_KEY = 'digital_theme_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const [toast, setToast] = useState<{ show: boolean; message: string; title: string } | null>(null);

  // Hydrate cart from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(items));
      } catch (e) {
        console.error('Failed to save cart to localStorage', e);
      }
    }
  }, [items, isMounted]);

  const showToast = (title: string, message: string) => {
    setToast({ show: true, title, message });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const hideToast = () => {
    setToast(null);
  };

  const addToCart = (product: Product, variant?: string, quantity: number = 1) => {
    const selectedVariant = variant || product.variants[0] || 'Standard';
    const key = `${product.id}_${selectedVariant}`;

    setItems((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { key, product, variant: selectedVariant, quantity }];
    });

    showToast('Added to Cart', `${product.name} (${selectedVariant})`);
  };

  const removeFromCart = (key: string) => {
    setItems((prev) => prev.filter((item) => item.key !== key));
  };

  const updateQuantity = (key: string, delta: number) => {
    setItems((prev) => {
      return prev
        .map((item) => {
          if (item.key === key) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const openPreviewModal = (product: Product) => {
    setPreviewProduct(product);
    setIsPreviewOpen(true);
  };

  const closePreviewModal = () => {
    setIsPreviewOpen(false);
    setPreviewProduct(null);
  };

  const openBookingModal = () => setIsBookingOpen(true);
  const closeBookingModal = () => setIsBookingOpen(false);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        totalPrice,
        isCartOpen,
        openCart,
        closeCart,
        previewProduct,
        isPreviewOpen,
        openPreviewModal,
        closePreviewModal,
        isBookingOpen,
        openBookingModal,
        closeBookingModal,
        toast,
        showToast,
        hideToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
