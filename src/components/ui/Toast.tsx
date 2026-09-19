'use client';

import React from 'react';
import { ShoppingBag, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export const Toast: React.FC = () => {
  const { toast } = useCart();

  if (!toast?.show) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-6 left-2.5 sm:left-6 z-50 max-w-[280px] transition-all duration-300 animate-toast-in pointer-events-none">
      <div className="bg-white/95 border border-slate-200 text-slate-900 rounded-2xl p-3 shadow-xl backdrop-blur-md flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center flex-shrink-0 shadow-xs border border-amber-300/40">
          <ShoppingBag className="w-4 h-4" />
        </div>
        <div className="text-[11px] sm:text-xs overflow-hidden leading-tight space-y-0.5 flex-1 min-w-0">
          <div className="flex items-center space-x-1.5">
            <span className="font-extrabold text-slate-900 truncate">{toast.title}</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          </div>
          <p className="text-amber-600 font-bold truncate">{toast.message}</p>
          <div className="flex items-center space-x-1 text-[10px] text-slate-500 font-mono">
            <span>Free Express Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
};
