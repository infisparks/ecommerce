'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Sparkles } from 'lucide-react';
import { getWhatsAppBulkOrderUrl } from '@/utils/whatsapp';

export const B2BBanner: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-5 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl border border-slate-700/80 relative overflow-hidden gpu-layer"
    >
      {/* Ambient background glow */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="space-y-1.5 text-left z-10">
        <span className="text-amber-400 text-[10px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Enterprise &amp; B2B Concierge</span>
        </span>
        <h3 className="text-base sm:text-2xl font-black tracking-tight">
          Looking for Custom Templates or Bulk Inquiries?
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Connect directly with our revenue specialists on WhatsApp for instant wholesale quotes, inventory verification, and commercial pricing.
        </p>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0 w-full md:w-auto z-10">
        <motion.a
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          href={getWhatsAppBulkOrderUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full md:w-auto cta-whatsapp-btn text-white font-black text-xs sm:text-sm py-3 px-5 rounded-2xl flex items-center justify-center space-x-2 shadow-xl"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>Discuss on WhatsApp (+91 89288 84526)</span>
        </motion.a>
      </div>
    </motion.section>
  );
};
