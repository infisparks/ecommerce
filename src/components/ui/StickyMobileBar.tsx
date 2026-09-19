'use client';

import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export const StickyMobileBar: React.FC = () => {
  const { totalCount, totalPrice, openCart, isCartOpen, isPreviewOpen, isBookingOpen } = useCart();

  const isAnyModalOpen = isCartOpen || isPreviewOpen || isBookingOpen;

  if (totalCount === 0 || isAnyModalOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-2.5 left-2.5 right-2.5 sm:bottom-5 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-md z-40 transition-all duration-300">
      <div className="bg-white/95 border border-amber-400/90 rounded-2xl p-2 sm:p-2.5 shadow-[0_10px_35px_rgba(245,166,35,0.25)] backdrop-blur-xl flex items-center justify-between gap-2 text-slate-900">
        <div className="flex items-center space-x-2 min-w-0 pl-1">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 flex items-center justify-center font-black flex-shrink-0 text-xs">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div className="flex items-baseline space-x-1.5 whitespace-nowrap overflow-hidden">
            <span className="text-sm sm:text-base font-black text-amber-600 font-mono">
              ₹{totalPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] font-bold text-slate-500 font-sans truncate">
              ({totalCount} item{totalCount === 1 ? '' : 's'})
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={openCart}
          className="bg-purple-700 hover:bg-purple-800 py-2 px-3.5 sm:px-4 rounded-xl text-white font-bold text-[11px] sm:text-xs uppercase tracking-tight flex items-center space-x-1 shadow-md flex-shrink-0 whitespace-nowrap cursor-pointer transition-colors active:scale-95"
        >
          <span>Checkout</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
