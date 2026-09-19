'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, MessageCircle, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getWhatsAppCartCheckoutUrl, getWhatsAppGeneralInquiryUrl } from '@/utils/whatsapp';

export const CartDrawer: React.FC = () => {
  const { items, isCartOpen, closeCart, updateQuantity, removeFromCart, totalPrice, totalCount } = useCart();

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;
    const url = getWhatsAppCartCheckoutUrl(items);
    window.open(url, '_blank');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ opacity: 0, y: '100%', scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: '100%', scale: 0.95 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="bg-white text-slate-900 border border-slate-200 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-4 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.25)] relative flex flex-col max-h-[92vh] z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3 flex-shrink-0">
              <div className="flex items-center space-x-2">
                <span className="bg-amber-500/15 border border-amber-500/30 text-amber-700 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Your Cart
                </span>
                <span className="text-xs font-bold text-slate-600 font-mono">
                  ({totalCount} item{totalCount === 1 ? '' : 's'})
                </span>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-amber-400 flex items-center justify-center text-sm transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Festival Offer Notice */}
            <div className="bg-amber-50 border border-amber-200/80 rounded-xl px-3 py-2 mb-3 flex items-center justify-between text-[11px] text-amber-800 font-bold flex-shrink-0">
              <div className="flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Festival Offer: Extra Free Delivery Applied</span>
              </div>
              <span className="bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded">
                APPLIED
              </span>
            </div>

            {/* Cart Items List */}
            <div className="space-y-2.5 overflow-y-auto flex-1 pr-1 custom-scrollbar text-left">
              {items.length === 0 ? (
                <div className="text-center py-10 space-y-3 text-slate-400">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500 font-bold">Your cart is currently empty.</p>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="text-amber-600 text-xs underline font-bold cursor-pointer"
                  >
                    Browse Catalog
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    key={item.key}
                    className="flex items-center justify-between bg-slate-50 border border-slate-200 p-2.5 rounded-2xl"
                  >
                    <div className="flex items-center space-x-2.5 overflow-hidden">
                      <div className="relative w-12 h-16 rounded-xl overflow-hidden p-0.5 bg-white border border-slate-200 flex-shrink-0">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="overflow-hidden">
                        <h5 className="text-xs font-black text-slate-900 truncate">
                          {item.product.name}
                        </h5>
                        {item.variant && (
                          <p className="text-[10px] text-slate-500 font-medium">{item.variant}</p>
                        )}
                        <p className="text-amber-600 font-black text-xs">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}{' '}
                          <span className="text-[10px] text-slate-400 font-normal">
                            (@ ₹{item.product.price.toLocaleString('en-IN')})
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <div className="flex items-center space-x-1 bg-white border border-slate-200 rounded-lg p-0.5 shadow-xs">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, -1)}
                          className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs transition-colors cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-xs font-mono font-black text-slate-900 px-1">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, 1)}
                          className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.key)}
                        className="text-slate-400 hover:text-red-600 p-1 text-xs transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer Order Breakdown */}
            {items.length > 0 && (
              <div className="border-t border-slate-100 pt-3 mt-3 space-y-3 flex-shrink-0">
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Subtotal:</span>
                    <span className="font-mono font-bold text-slate-900">
                      ₹{totalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-emerald-600 font-bold">
                    <span>Express Shipping:</span>
                    <span className="uppercase">FREE (₹0)</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-100">
                    <span>Estimated Total:</span>
                    <span className="text-amber-600 text-lg font-black font-mono">
                      ₹{totalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleWhatsAppCheckout}
                  className="w-full bg-purple-700 hover:bg-purple-800 py-3.5 px-4 rounded-2xl text-white font-bold text-xs sm:text-sm uppercase tracking-wide flex items-center justify-center space-x-2 shadow-lg cursor-pointer transition-colors active:scale-95"
                >
                  <MessageCircle className="w-5 h-5 fill-white text-white" />
                  <span>Confirm &amp; Order on WhatsApp</span>
                </button>

                <a
                  href={getWhatsAppGeneralInquiryUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                  <span>Discuss on WhatsApp (+91 89288 84526)</span>
                </a>

                <div className="flex items-center justify-center space-x-3 text-[10px] text-slate-500 font-medium pt-0.5">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> 256-Bit SSL
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Truck className="w-3 h-3 text-amber-600" /> 24h Express Dispatch
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
