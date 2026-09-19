'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BannerSlider } from '@/components/home/BannerSlider';
import { CategoryFilters } from '@/components/home/CategoryFilters';
import { ProductCard } from '@/components/product/ProductCard';
import { B2BBanner } from '@/components/home/B2BBanner';
import { productsData } from '@/data/products';
import { ProductCategory } from '@/types';
import { Search, RotateCcw } from 'lucide-react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all');

  const filteredProducts = useMemo(() => {
    let list = productsData;

    if (activeCategory !== 'all') {
      list = list.filter((p) => p.category === activeCategory);
    }

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      list = list.filter((p) => {
        const matchName = p.name.toLowerCase().includes(query);
        const matchCat =
          p.catLabel.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
        const matchDesc = p.description.toLowerCase().includes(query);
        const matchFeatures = p.features.some((f) => f.toLowerCase().includes(query));
        const matchPrice = p.price.toString().includes(query);
        return matchName || matchCat || matchDesc || matchFeatures || matchPrice;
      });
    }

    return list;
  }, [searchQuery, activeCategory]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 mt-2 gpu-layer">
      {/* 1. Hero 3-Banner Peek Slider */}
      <BannerSlider />

      {/* 2. E-Commerce Product Catalog Section */}
      <section
        id="catalogSection"
        className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto space-y-4 pt-1"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="px-1 text-left"
        >
          <h2 className="text-base sm:text-xl lg:text-2xl font-black text-slate-900 tracking-tight">
            Featured A4 Product Templates
          </h2>
          <p className="text-[10px] sm:text-xs text-slate-500 font-medium">
            Search, filter by category, or click any product to view details &amp; order
          </p>
        </motion.div>

        {/* Search & Category Filter Toolbar */}
        <CategoryFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          totalProductsCount={productsData.length}
        />

        {/* 4-Column Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-12 text-center space-y-3 shadow-sm"
          >
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto text-2xl shadow-inner">
              <Search className="w-8 h-8" />
            </div>
            <h4 className="text-base sm:text-lg font-black text-slate-900">
              No matching templates found
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              We couldn&apos;t find any products matching your search query or selected category.
              Try searching for &quot;camera&quot;, &quot;drone&quot;, &quot;audio&quot;, or reset
              filters.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="cta-gold-btn py-2.5 px-5 rounded-xl text-slate-950 font-black text-xs uppercase tracking-tight inline-flex items-center space-x-1.5 shadow-md cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          </motion.div>
        )}
      </section>

      {/* 3. B2B / Wholesale Strategy Banner */}
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
        <B2BBanner />
      </div>
    </div>
  );
}
