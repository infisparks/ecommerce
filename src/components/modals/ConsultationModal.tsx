'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getWhatsAppConsultationUrl } from '@/utils/whatsapp';

export const ConsultationModal: React.FC = () => {
  const { isBookingOpen, closeBookingModal } = useCart();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim().length < 10) {
      alert('Please enter a valid 10-digit WhatsApp phone number.');
      return;
    }
    const url = getWhatsAppConsultationUrl(name.trim(), phone.trim());
    window.open(url, '_blank');
    closeBookingModal();
    setName('');
    setPhone('');
  };

  return (
    <AnimatePresence>
      {isBookingOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeBookingModal}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white text-slate-900 border border-slate-200 w-full max-w-md rounded-3xl p-4 sm:p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center space-x-2">
                <span className="bg-amber-500/15 border border-amber-500/30 text-amber-700 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                  Consultation
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Fast 30-Sec Booking
                </span>
              </div>
              <button
                type="button"
                onClick={closeBookingModal}
                className="w-7 h-7 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center text-sm transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="text-center space-y-1">
                <h3 className="text-base sm:text-xl font-black text-slate-900 leading-snug">
                  Claim Your 1-on-1 Growth Consultation
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                  Enter your details to reserve your custom revenue strategy session
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-amber-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  WhatsApp Phone Number <span className="text-amber-600">*</span>
                </label>
                <div className="flex items-center bg-slate-50 border border-slate-200 focus-within:border-amber-500 rounded-xl overflow-hidden">
                  <div className="px-3 py-2.5 bg-slate-100 border-r border-slate-200 text-xs font-bold text-slate-600">
                    🇮🇳 +91
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={10}
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="8928884526"
                    className="w-full px-3 py-2.5 text-sm text-slate-900 bg-transparent placeholder-slate-400 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-700 hover:bg-purple-800 rounded-2xl p-3.5 text-center cursor-pointer shadow-lg mt-2 active:scale-95 transition-colors"
              >
                <div className="text-sm font-bold text-white flex items-center justify-center space-x-2 uppercase tracking-wide">
                  <span>Confirm &amp; Connect on WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>

              <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-400 text-center pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Confidential • No Spam Guarantee</span>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
