'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export const SplashScreen: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Only show once per session to maintain quick subsequent navigation
    const hasSeenSplash = sessionStorage.getItem('ashren_splash_v4');
    if (hasSeenSplash) {
      setShowSplash(false);
      return;
    }

    const timer = setTimeout(() => {
      setShowSplash(false);
      sessionStorage.setItem('ashren_splash_v4', 'true');
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.02,
            transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[100] bg-[#FAF8F5] flex flex-col items-center justify-center p-6 select-none overflow-hidden"
        >
          {/* Subtle Warm Radiant Glow (Matches site background) */}
          <div className="absolute w-72 sm:w-96 h-72 sm:h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

          {/* Centered Logo with Clean Spring Animation */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative flex flex-col items-center justify-center text-center space-y-6 z-10 max-w-sm sm:max-w-md w-full"
          >
            {/* Clean Line Logo */}
            <div className="relative h-20 sm:h-24 md:h-28 w-60 sm:w-72 md:w-80">
              <Image
                src="/line-logo.png"
                alt="Ashren Haute Marketplace"
                fill
                className="object-contain"
                sizes="(max-width: 640px) 240px, (max-width: 768px) 288px, 320px"
                priority
              />
            </div>

            {/* Minimal Gold Shimmer Accent Line */}
            <div className="w-32 sm:w-40 h-0.5 bg-slate-200 rounded-full overflow-hidden relative">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  repeat: Infinity,
                  duration: 1.1,
                  ease: 'easeInOut',
                }}
                className="w-full h-full bg-gradient-to-r from-transparent via-amber-500 to-transparent"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
