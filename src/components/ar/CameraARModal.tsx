'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Camera,
  Maximize2,
  RefreshCw,
  Sliders,
  Sparkles,
  QrCode,
  Download,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Move,
  ZoomIn,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { Product } from '@/types';
import { DEFAULT_PRODUCT_GLB, WHATSAPP_PHONE } from '@/data/products';

interface CameraARModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const CameraARModal: React.FC<CameraARModalProps> = ({ product, isOpen, onClose }) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [scale, setScale] = useState(1);
  const [rotationY, setRotationY] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);
  const [showQr, setShowQr] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const modelViewerRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const glbUrl = product.glbModel || DEFAULT_PRODUCT_GLB;

  // Detect mobile
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768;
      setIsMobileDevice(isMobile);
    }
  }, []);

  // Dynamically load @google/model-viewer
  useEffect(() => {
    if (isOpen) {
      import('@google/model-viewer').catch((e) => console.error('Model viewer import error', e));
    }
  }, [isOpen]);

  // Start Camera
  const startCamera = useCallback(async (facing: 'environment' | 'user') => {
    setCameraError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera permission was denied. Please allow camera access in browser settings.'
          : 'Could not access device camera. You can still preview in 3D studio or scan QR code on mobile.'
      );
      setCameraActive(false);
    }
  }, []);

  // Stop Camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  // Lifecycle when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setPosition({ x: 0, y: 0 });
      setScale(1);
      setRotationY(0);
      setSnapshotUrl(null);
      startCamera(facingMode);
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, startCamera, stopCamera, facingMode]);

  // Flip Camera
  const toggleCameraFacing = () => {
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);
    startCamera(nextFacing);
  };

  // Launch Native WebXR / Google Scene Viewer if available
  const handleLaunchNativeAR = () => {
    if (modelViewerRef.current && modelViewerRef.current.canActivateAR) {
      modelViewerRef.current.activateAR();
    } else {
      alert('Native WebXR is not supported on this browser. Use the live Camera AR placement mode right on this screen!');
    }
  };

  // Dragging the product across the room
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - position.x, y: clientY - position.y });
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setPosition({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Capture Photo Snapshot
  const handleTakeSnapshot = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw live video feed
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // If model viewer canvas can be drawn
    try {
      // Add watermark
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(20, canvas.height - 70, 360, 50);
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 16px Inter, sans-serif';
      ctx.fillText(`${product.name} - AR Room Preview`, 32, canvas.height - 44);
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText(`Infispark Tech • ₹${product.price.toLocaleString('en-IN')}`, 32, canvas.height - 28);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setSnapshotUrl(dataUrl);
    } catch (e) {
      console.warn('Snapshot capture warning', e);
    }
  };

  // Download snapshot
  const handleDownloadSnapshot = () => {
    if (!snapshotUrl) return;
    const a = document.createElement('a');
    a.href = snapshotUrl;
    a.download = `${product.name.replace(/\s+/g, '_')}_Room_AR.jpg`;
    a.click();
  };

  const arPageUrl = typeof window !== 'undefined' ? `${window.location.origin}/ar?id=${product.id}` : '';
  const qrCodeApi = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    arPageUrl
  )}&color=4c1d95&bgcolor=ffffff`;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex flex-col bg-slate-950 text-white select-none overflow-hidden">
        {/* Top Control Bar */}
        <header className="relative z-30 flex items-center justify-between px-4 py-3 bg-slate-900/85 backdrop-blur-md border-b border-slate-800">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/50 flex items-center justify-center flex-shrink-0">
              <Camera className="w-4 h-4 text-amber-400" />
            </div>
            <div className="truncate text-left">
              <h3 className="text-xs sm:text-sm font-extrabold text-white truncate">
                {product.name}
              </h3>
              <p className="text-[10px] text-amber-400 font-mono font-bold">
                AR Room Camera • ₹{product.price.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Native AR Button if available */}
            <button
              type="button"
              onClick={handleLaunchNativeAR}
              className="hidden sm:inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-tight bg-purple-700 hover:bg-purple-600 text-white px-3 py-1.5 rounded-xl border border-purple-400/40 shadow-md cursor-pointer transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Native WebXR AR</span>
            </button>

            {/* Switch Camera facing */}
            {cameraActive && (
              <button
                type="button"
                onClick={toggleCameraFacing}
                title="Flip Camera"
                className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}

            {/* QR Code toggle for desktop */}
            {!isMobileDevice && (
              <button
                type="button"
                onClick={() => setShowQr(!showQr)}
                title="Scan QR on phone"
                className={`w-8 h-8 rounded-xl border flex items-center justify-center cursor-pointer transition-colors ${
                  showQr
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <QrCode className="w-4 h-4" />
              </button>
            )}

            {/* Close Modal */}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main AR Camera Viewport */}
        <main
          className="relative flex-1 w-full h-full overflow-hidden bg-black flex items-center justify-center"
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Hidden Canvas for Snapshots */}
          <canvas ref={canvasRef} className="hidden" />

          {/* 1. Live Background Video from Camera */}
          {cameraActive ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
          ) : (
            /* Fallback room background if camera not active */
            <div className="absolute inset-0 w-full h-full bg-radial from-slate-900 via-slate-950 to-black z-0 flex flex-col items-center justify-center p-6 text-center">
              {cameraError ? (
                <div className="max-w-md bg-slate-900/90 border border-red-500/40 rounded-2xl p-6 text-center space-y-3 shadow-xl">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Camera Access Required for Room View</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{cameraError}</p>
                  <button
                    type="button"
                    onClick={() => startCamera(facingMode)}
                    className="cta-gold-btn px-4 py-2 rounded-xl text-slate-950 text-xs font-black uppercase tracking-tight shadow-md cursor-pointer"
                  >
                    Retry Camera
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2 text-slate-400">
                  <div className="w-10 h-10 border-3 border-amber-400/20 border-t-amber-400 rounded-full animate-spin" />
                  <p className="text-xs font-semibold">Starting camera feed...</p>
                </div>
              )}
            </div>
          )}

          {/* 2. Interactive 3D Model Placement Layer */}
          <div
            onMouseDown={handleTouchStart}
            onTouchStart={handleTouchStart}
            style={{
              transform: `translate(${position.x}px, ${position.y}px)`,
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
            className="absolute z-10 w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] md:w-[440px] md:h-[440px] flex items-center justify-center transition-transform duration-75 will-change-transform"
          >
            {/* Floor Ambient Contact Shadow */}
            <div
              style={{
                width: `${scale * 65}%`,
                height: `${scale * 20}%`,
              }}
              className="absolute bottom-6 rounded-full bg-black/60 blur-xl pointer-events-none transform -rotate-x-60"
            />

            {/* 3D Model Viewer Element */}
            <div
              style={{
                transform: `scale(${scale}) rotateY(${rotationY}deg)`,
                width: '100%',
                height: '100%',
              }}
              className="transition-transform duration-100 flex items-center justify-center relative"
            >
              <model-viewer
                ref={modelViewerRef}
                src={glbUrl}
                alt={product.name}
                ar
                ar-modes="webxr scene-viewer quick-look"
                ar-scale="auto"
                camera-controls
                touch-action="none"
                auto-rotate
                auto-rotate-delay="1500"
                shadow-intensity="1.5"
                shadow-softness="0.9"
                exposure="1.2"
                environment-image="neutral"
                loading="eager"
                onLoad={() => setIsModelLoaded(true)}
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'transparent',
                  outline: 'none',
                }}
              >
                <div slot="ar-button" style={{ display: 'none' }} />
              </model-viewer>

              {/* Drag Indicator Overlay */}
              <div className="absolute top-1 left-1/2 -translate-x-1/2 bg-slate-900/70 backdrop-blur-md border border-white/20 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 opacity-80 hover:opacity-100 pointer-events-none">
                <Move className="w-2.5 h-2.5 text-amber-400" />
                <span>Drag to Place</span>
              </div>
            </div>
          </div>

          {/* Desktop QR Code Overlay Modal */}
          {showQr && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute z-40 bg-white text-slate-900 p-6 rounded-3xl shadow-2xl max-w-xs text-center space-y-3 border border-slate-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-purple-900 tracking-wider">
                  Open on Phone Camera
                </span>
                <button
                  type="button"
                  onClick={() => setShowQr(false)}
                  className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                Scan with your smartphone camera to place this 3D product directly in your physical room!
              </p>
              <div className="p-2 bg-slate-50 rounded-2xl border border-slate-200 inline-block shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrCodeApi}
                  alt="Scan QR for AR"
                  width={200}
                  height={200}
                  className="rounded-xl mx-auto"
                />
              </div>
              <div className="text-[10px] font-mono text-purple-800 font-bold">
                Instant Room AR • No App Download Required
              </div>
            </motion.div>
          )}

          {/* Snapshot Preview Dialog */}
          {snapshotUrl && (
            <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
              <div className="relative max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3 text-center shadow-2xl">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center space-x-1.5 text-amber-400 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Room Photo Captured!</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSnapshotUrl(null)}
                    className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-700 bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={snapshotUrl}
                    alt="AR Snapshot"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleDownloadSnapshot}
                    className="flex-1 cta-gold-btn py-2.5 px-4 rounded-xl text-slate-950 font-black text-xs uppercase tracking-tight flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Save Photo</span>
                  </button>
                  <a
                    href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
                      `Hi! I tested the 3D AR Room view for "${product.name}" and want to order!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cta-whatsapp-btn py-2.5 px-4 rounded-xl text-white font-black text-xs uppercase tracking-tight flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>WhatsApp Order</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Bottom AR Control Panel */}
        <footer className="relative z-30 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 px-4 py-3 space-y-2.5">
          {/* Slider Controls: Scale & Rotation */}
          <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
            {/* Scale Slider */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl px-2.5 py-1.5 space-y-1">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                <span className="flex items-center gap-1">
                  <ZoomIn className="w-3 h-3 text-amber-400" />
                  <span>Room Scale</span>
                </span>
                <span className="font-mono text-amber-400">{Math.round(scale * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.3"
                max="2.0"
                step="0.05"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
              />
            </div>

            {/* Rotation Slider */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl px-2.5 py-1.5 space-y-1">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                <span className="flex items-center gap-1">
                  <Compass className="w-3 h-3 text-purple-400" />
                  <span>Turn Angle</span>
                </span>
                <span className="font-mono text-purple-300">{Math.round(rotationY)}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                step="5"
                value={rotationY}
                onChange={(e) => setRotationY(parseFloat(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
              />
            </div>
          </div>

          {/* Action Row: Reset Position, Snapshot Shutter Button, Native AR */}
          <div className="flex items-center justify-between max-w-md mx-auto pt-1">
            <button
              type="button"
              onClick={() => {
                setPosition({ x: 0, y: 0 });
                setScale(1);
                setRotationY(0);
              }}
              className="text-[11px] font-bold text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-slate-800/60 border border-slate-700 cursor-pointer transition-colors"
            >
              Center Product
            </button>

            {/* Camera Snapshot Shutter Button */}
            {cameraActive && (
              <button
                type="button"
                onClick={handleTakeSnapshot}
                className="relative w-14 h-14 rounded-full bg-white p-1 border-4 border-amber-400 shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer group"
                title="Take Room Photo"
              >
                <div className="w-10 h-10 rounded-full bg-amber-500 group-hover:bg-amber-400 transition-colors flex items-center justify-center">
                  <Camera className="w-5 h-5 text-slate-950" />
                </div>
              </button>
            )}

            {/* Mobile Native AR Launch */}
            <button
              type="button"
              onClick={handleLaunchNativeAR}
              className="sm:hidden text-[10px] font-extrabold uppercase bg-purple-700 text-white px-2.5 py-1.5 rounded-lg border border-purple-400/40 shadow-sm cursor-pointer"
            >
              Native AR
            </button>
          </div>
        </footer>
      </div>
    </AnimatePresence>
  );
};
