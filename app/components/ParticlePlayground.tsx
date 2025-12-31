'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CameraOff, Hand, Sparkles, X, Info, Maximize2, Minimize2 } from 'lucide-react';
import { useHandTracking, HandData } from '@/lib/handTracking';
import { ParticleSystem } from '@/lib/particleSystem';
import { playSound } from '@/lib/sounds';
import { cn } from '@/lib/utils';

interface ParticlePlaygroundProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ParticlePlayground({ isOpen, onClose }: ParticlePlaygroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particleSystemRef = useRef<ParticleSystem | null>(null);
  const [showTutorial, setShowTutorial] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleHandsDetected = useCallback((hands: HandData[]) => {
    if (!particleSystemRef.current) return;

    // Convert hand data to interaction points
    const interactionPoints = hands.map((hand) => ({
      x: 1 - hand.palmCenter.x, // Mirror for natural feel
      y: hand.palmCenter.y,
      strength: 1,
      isAttract: hand.isOpen, // Open palm attracts, closed fist repels
    }));

    particleSystemRef.current.setInteractionPoints(interactionPoints);

    // Add finger trails for index finger
    hands.forEach((hand) => {
      if (hand.fingerTips[1]) {
        // Index finger
        particleSystemRef.current?.addTrailPoint(
          1 - hand.fingerTips[1].x,
          hand.fingerTips[1].y
        );
      }
    });

    // Burst effect when hand velocity is high (quick movements)
    hands.forEach((hand) => {
      const speed = Math.sqrt(hand.velocity.x ** 2 + hand.velocity.y ** 2);
      if (speed > 5) {
        particleSystemRef.current?.burst(
          1 - hand.palmCenter.x,
          hand.palmCenter.y,
          Math.floor(speed * 2)
        );
        playSound('whoosh');
      }
    });
  }, []);

  const {
    videoRef,
    hands,
    isLoading,
    isEnabled,
    error,
    startTracking,
    stopTracking,
  } = useHandTracking({ onHandsDetected: handleHandsDetected });

  // Initialize particle system
  useEffect(() => {
    if (!canvasRef.current || !isOpen) return;

    const particleSystem = new ParticleSystem(canvasRef.current, {
      particleCount: 400,
      colors: ['#E85A4F', '#1B998B', '#F4C95D', '#EAEAEA', '#FF8A80', '#80CBC4', '#FFD54F'],
      maxRadius: 5,
      minRadius: 1.5,
      attractStrength: 0.06,
      repelStrength: 0.12,
      friction: 0.97,
    });

    particleSystem.start();
    particleSystemRef.current = particleSystem;

    const handleResize = () => {
      particleSystem.handleResize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      particleSystem.stop();
      particleSystemRef.current = null;
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  // Handle mouse/touch fallback when camera not enabled
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (isEnabled || !particleSystemRef.current || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    particleSystemRef.current.setInteractionPoints([{
      x,
      y,
      strength: 1,
      isAttract: e.buttons === 0, // No button = attract, button pressed = repel
    }]);

    particleSystemRef.current.addTrailPoint(x, y);
  }, [isEnabled]);

  const handlePointerLeave = useCallback(() => {
    if (!isEnabled && particleSystemRef.current) {
      particleSystemRef.current.setInteractionPoints([]);
      particleSystemRef.current.clearTrail();
    }
  }, [isEnabled]);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const handleClose = useCallback(() => {
    stopTracking();
    onClose();
  }, [stopTracking, onClose]);

  if (!isOpen) return null;

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-night z-50 overflow-hidden"
    >
      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-none"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      />

      {/* Hidden video for camera feed */}
      <video
        ref={videoRef}
        className="hidden"
        playsInline
        muted
      />

      {/* Camera preview (small) */}
      {isEnabled && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute bottom-20 right-4 w-32 h-24 rounded-xl overflow-hidden border-2 border-cream/20 shadow-lg"
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover transform scale-x-[-1]"
            playsInline
            muted
            autoPlay
          />
          {/* Hand indicators */}
          {hands.map((hand, idx) => (
            <motion.div
              key={idx}
              className={cn(
                'absolute w-4 h-4 rounded-full',
                hand.isOpen ? 'bg-teal' : 'bg-coral'
              )}
              style={{
                left: `${(1 - hand.palmCenter.x) * 100}%`,
                top: `${hand.palmCenter.y * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          ))}
        </motion.div>
      )}

      {/* Header */}
      <div className="absolute top-0 inset-x-0 p-4 safe-top">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <Sparkles className="w-6 h-6 text-gold" />
            <div>
              <h2 className="text-xl font-bold text-cream">Particle Flow</h2>
              <p className="text-cream/50 text-sm">
                {isEnabled ? 'Move your hands to control particles' : 'Move cursor or enable camera'}
              </p>
            </div>
          </motion.div>

          <div className="flex items-center gap-2">
            <motion.button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-night-light/80 hover:bg-night-lighter transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5 text-cream/60" />
              ) : (
                <Maximize2 className="w-5 h-5 text-cream/60" />
              )}
            </motion.button>

            <motion.button
              onClick={handleClose}
              className="p-2 rounded-xl bg-night-light/80 hover:bg-night-lighter transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5 text-cream/60" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Camera Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3"
      >
        <motion.button
          onClick={isEnabled ? stopTracking : startTracking}
          disabled={isLoading}
          className={cn(
            'flex items-center gap-2 px-6 py-3 rounded-2xl font-medium',
            'transition-all duration-300',
            isEnabled
              ? 'bg-coral text-white shadow-[0_4px_0_0_#B54840]'
              : 'bg-teal text-white shadow-[0_4px_0_0_#147A6E]',
            'active:shadow-[0_1px_0_0] active:translate-y-1'
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ y: 3 }}
        >
          {isLoading ? (
            <motion.div
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          ) : isEnabled ? (
            <CameraOff className="w-5 h-5" />
          ) : (
            <Camera className="w-5 h-5" />
          )}
          {isLoading ? 'Starting...' : isEnabled ? 'Stop Camera' : 'Enable Camera'}
        </motion.button>

        <motion.button
          onClick={() => setShowTutorial(true)}
          className="p-3 rounded-xl bg-night-light/80 hover:bg-night-lighter transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Info className="w-5 h-5 text-cream/60" />
        </motion.button>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-coral/20 border border-coral/30 text-coral"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tutorial Modal */}
      <AnimatePresence>
        {showTutorial && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowTutorial(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto"
            >
              <div className="bg-night-light border border-cream/10 rounded-2xl p-6 shadow-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-gold/20">
                    <Hand className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="text-xl font-bold text-cream">How to Play</h3>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-teal font-bold">1</span>
                    </div>
                    <div>
                      <p className="text-cream font-medium">Open Palm = Attract</p>
                      <p className="text-cream/50 text-sm">Particles flow toward your open hand</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-coral/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-coral font-bold">2</span>
                    </div>
                    <div>
                      <p className="text-cream font-medium">Closed Fist = Repel</p>
                      <p className="text-cream/50 text-sm">Particles push away from your fist</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-gold font-bold">3</span>
                    </div>
                    <div>
                      <p className="text-cream font-medium">Quick Movements = Burst</p>
                      <p className="text-cream/50 text-sm">Fast hand motion creates particle explosions</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-cream/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-cream font-bold">4</span>
                    </div>
                    <div>
                      <p className="text-cream font-medium">Finger Trails</p>
                      <p className="text-cream/50 text-sm">Your index finger leaves a glowing trail</p>
                    </div>
                  </div>
                </div>

                <p className="text-cream/40 text-sm mb-4 text-center">
                  No camera? Use your mouse/finger to interact!
                </p>

                <motion.button
                  onClick={() => setShowTutorial(false)}
                  className={cn(
                    'w-full py-3 rounded-xl font-medium',
                    'bg-gradient-to-r from-coral via-gold to-teal',
                    'text-white shadow-[0_4px_0_0_rgba(0,0,0,0.3)]',
                    'active:shadow-[0_1px_0_0] active:translate-y-1',
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ y: 3 }}
                >
                  Let&apos;s Play!
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hand Status Indicator */}
      {isEnabled && hands.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute bottom-20 left-4 space-y-2"
        >
          {hands.map((hand, idx) => (
            <motion.div
              key={idx}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-xl',
                hand.isOpen ? 'bg-teal/20 border border-teal/30' : 'bg-coral/20 border border-coral/30'
              )}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <Hand className={cn('w-4 h-4', hand.isOpen ? 'text-teal' : 'text-coral')} />
              <span className={cn('text-sm font-medium', hand.isOpen ? 'text-teal' : 'text-coral')}>
                {hand.isOpen ? 'Attracting' : 'Repelling'}
              </span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
