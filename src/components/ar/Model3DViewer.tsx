'use client';

import React, { useEffect, useState, useRef } from 'react';
import { RotateCw, Maximize2, Minimize2, Eye, Sparkles, Compass, Camera } from 'lucide-react';

interface Model3DViewerProps {
  src: string;
  poster?: string;
  alt?: string;
  className?: string;
  onOpenAR?: () => void;
  autoRotateDefault?: boolean;
}

export const Model3DViewer: React.FC<Model3DViewerProps> = ({
  src,
  poster,
  alt = '3D Product Model',
  className = '',
  onOpenAR,
  autoRotateDefault = true,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isModuleReady, setIsModuleReady] = useState(false);
  const [autoRotate, setAutoRotate] = useState(autoRotateDefault);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasArSupport, setHasArSupport] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const modelViewerRef = useRef<any>(null);

  useEffect(() => {
    // Dynamic import of @google/model-viewer to prevent SSR issues
    import('@google/model-viewer')
      .then(() => {
        setIsModuleReady(true);
      })
      .catch((err) => {
        console.error('Failed to load @google/model-viewer', err);
      });
  }, []);

  useEffect(() => {
    const viewer = modelViewerRef.current;
    if (!viewer) return;

    const handleProgress = (event: any) => {
      const progress = Math.round((event.detail?.totalProgress || 0) * 100);
      setLoadProgress(progress);
    };

    const handleLoad = () => {
      setIsLoaded(true);
      if (viewer.canActivateAR) {
        setHasArSupport(true);
      }
    };

    viewer.addEventListener('progress', handleProgress);
    viewer.addEventListener('load', handleLoad);

    return () => {
      viewer.removeEventListener('progress', handleProgress);
      viewer.removeEventListener('load', handleLoad);
    };
  }, [isModuleReady]);

  const handleResetCamera = () => {
    if (modelViewerRef.current) {
      modelViewerRef.current.cameraOrbit = '0deg 75deg 105%';
      modelViewerRef.current.fieldOfView = 'auto';
    }
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleTriggerNativeAR = () => {
    if (modelViewerRef.current?.canActivateAR) {
      modelViewerRef.current.activateAR();
    } else if (onOpenAR) {
      onOpenAR();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-purple-950 border border-slate-700 shadow-xl flex items-center justify-center select-none ${className}`}
    >
      {/* 3D Model Viewer Web Component */}
      {isModuleReady ? (
        <model-viewer
          ref={modelViewerRef}
          src={src}
          poster={poster}
          alt={alt}
          ar
          ar-modes="webxr scene-viewer quick-look"
          ar-scale="auto"
          camera-controls
          touch-action="pan-y"
          auto-rotate={autoRotate ? true : undefined}
          auto-rotate-delay="1000"
          rotation-per-second="25deg"
          shadow-intensity="1.2"
          shadow-softness="0.8"
          exposure="1.1"
          environment-image="neutral"
          loading="eager"
          style={{ width: '100%', height: '100%', outline: 'none' }}
        >
          {/* Custom AR Button slot */}
          <div slot="ar-button" style={{ display: 'none' }} />
        </model-viewer>
      ) : null}

      {/* Loading Overlay */}
      {(!isModuleReady || !isLoaded) && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm p-6 text-center text-white space-y-3">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="w-12 h-12 border-3 border-amber-400/20 border-t-amber-400 rounded-full animate-spin" />
            <Sparkles className="w-5 h-5 text-amber-400 absolute animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-black tracking-wide uppercase text-amber-300">
              Loading 3D Spatial Model
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
              {loadProgress > 0 ? `${loadProgress}% downloaded` : 'Initializing 3D renderer...'}
            </p>
          </div>
          <div className="w-48 bg-slate-800 rounded-full h-1.5 overflow-hidden border border-slate-700">
            <div
              className="bg-gradient-to-r from-purple-500 to-amber-400 h-full transition-all duration-300 rounded-full"
              style={{ width: `${Math.max(loadProgress, 8)}%` }}
            />
          </div>
        </div>
      )}

      {/* 3D Studio Badge & Top Controls */}
      <div className="absolute top-3 left-3 z-10 flex items-center space-x-2">
        <span className="bg-purple-900/80 backdrop-blur-md border border-purple-400/40 text-purple-200 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-lg">
          <Eye className="w-3 h-3 text-amber-400 animate-pulse" />
          <span>Interactive 3D</span>
        </span>
      </div>

      <div className="absolute top-3 right-3 z-10 flex items-center space-x-1.5">
        {/* Reset Camera Orbit */}
        <button
          type="button"
          onClick={handleResetCamera}
          title="Reset Camera View"
          className="w-8 h-8 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-all cursor-pointer shadow-md"
        >
          <Compass className="w-4 h-4" />
        </button>

        {/* Auto-rotate Toggle */}
        <button
          type="button"
          onClick={() => setAutoRotate(!autoRotate)}
          title={autoRotate ? 'Pause Rotation' : 'Auto Rotate'}
          className={`w-8 h-8 rounded-xl backdrop-blur-md border flex items-center justify-center transition-all cursor-pointer shadow-md ${
            autoRotate
              ? 'bg-amber-500/20 border-amber-400/60 text-amber-300'
              : 'bg-slate-900/80 border-slate-700/80 text-slate-400 hover:text-white'
          }`}
        >
          <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin-slow' : ''}`} />
        </button>

        {/* Fullscreen Toggle */}
        <button
          type="button"
          onClick={handleToggleFullscreen}
          title="Fullscreen"
          className="w-8 h-8 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-all cursor-pointer shadow-md"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Floating Instructions Bottom Tip */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="bg-slate-900/75 backdrop-blur-md border border-slate-800 text-slate-300 text-[10px] font-medium px-2.5 py-1 rounded-lg pointer-events-auto shadow-md">
          Drag to rotate • Pinch / Scroll to zoom
        </div>

        {/* Launch AR in Room CTA */}
        {onOpenAR && (
          <button
            type="button"
            onClick={onOpenAR}
            className="pointer-events-auto bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-black text-[10px] sm:text-xs uppercase tracking-tight px-3 py-1.5 rounded-xl shadow-lg border border-amber-300/40 flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-amber-200" />
            <span>View In Room (AR)</span>
          </button>
        )}
      </div>
    </div>
  );
};
