'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { ProductCategory } from '@/types';

interface CategoryFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  activeCategory: ProductCategory;
  onCategoryChange: (cat: ProductCategory) => void;
  totalProductsCount: number;
}

export const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  totalProductsCount,
}) => {
  const categories: { id: ProductCategory; label: string }[] = [
    { id: 'all', label: `All (${totalProductsCount})` },
    { id: 'electronics', label: '⚡ Action Cameras & Audio' },
    { id: 'security', label: '🛡️ Security & Body Cams' },
    { id: 'gadgets', label: '🎮 Drones & Smart Gadgets' },
    { id: 'fashion', label: '💎 Fashion & Luxury' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-sm space-y-2.5 gpu-layer"
    >
      {/* Search Bar */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search products by name, camera, drone, watch, audio, 4K..."
          className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all font-medium"
        />
        {searchQuery.length > 0 && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </motion.button>
        )}
      </div>

      {/* Category Pills with Gold & Purple Harmony */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-slate-100">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0 mr-1 hidden sm:inline">
          Category:
        </span>
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <motion.button
              whileTap={{ scale: 0.96 }}
              key={cat.id}
              type="button"
              onClick={() => onCategoryChange(cat.id)}
              className={`px-3 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-black flex-shrink-0 transition-all cursor-pointer relative ${
                isActive
                  ? 'bg-gradient-to-r from-purple-900 via-purple-800 to-purple-950 text-amber-300 border border-amber-400/80 shadow-md scale-102'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-purple-300 hover:text-purple-900'
              }`}
            >
              {cat.label}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};
