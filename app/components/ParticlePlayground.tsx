'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CameraOff, Hand, Sparkles, X, Info, Maximize2, Minimize2 } from 'lucide-react';
import { ParticleSystem } from '@/lib/particleSystem';
import { playSound } from '@/lib/sounds';
import { cn } from '@/lib/utils';

interface ParticlePlaygroundProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HandData {
  palmCenter: { x: number; y: number };
  fingerTips: { x: number; y: number }[];
  isOpen: boolean;
  velocity: { x: number; y: number };
}

// Landmark indices
const WRIST = 0;
const THUMB_TIP = 4;
const INDEX_TIP = 8;
const MIDDLE_TIP = 12;
const RING_TIP = 16;
const PINKY_TIP = 20;
const INDEX_MCP = 5;
const PINKY_MCP = 17;

export function ParticlePlayground({ isOpen, onClose }: ParticlePlaygroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const particleSystemRef = useRef<ParticleSystem | null>(null);
  const animationRef = useRef<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handsRef = useRef<{ close: () => void; send: (input: { image: HTMLVideoElement }) => Promise<void> } | null>(null);
  const previousHandsRef = useRef<{ palmCenter: { x: number; y: number } }[]>([]);

  const [showTutorial, setShowTutorial] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hands, setHands] = useState<HandData[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Process hand landmarks into usable data
  const processHands = useCallback((results: { multiHandLandmarks?: { x: number; y: number; z: number }[][] }) => {
    if (!results.multiHandLandmarks || !particleSystemRef.current) {
      if (particleSystemRef.current) {
        particleSystemRef.current.setInteractionPoints([]);
      }
      setHands([]);
      return;
    }

    const newHands: HandData[] = results.multiHandLandmarks.map((landmarks, index) => {
      const palmCenter = {
        x: (landmarks[INDEX_MCP].x + landmarks[PINKY_MCP].x + landmarks[WRIST].x) / 3,
        y: (landmarks[INDEX_MCP].y + landmarks[PINKY_MCP].y + landmarks[WRIST].y) / 3,
      };

      // Calculate velocity
      const previousHand = previousHandsRef.current[index];
      const velocity = previousHand
        ? {
            x: (palmCenter.x - previousHand.palmCenter.x) * 100,
            y: (palmCenter.y - previousHand.palmCenter.y) * 100,
          }
        : { x: 0, y: 0 };

      // Check if hand is open
      const palmCenterLandmark = {
        x: (landmarks[INDEX_MCP].x + landmarks[PINKY_MCP].x) / 2,
        y: (landmarks[INDEX_MCP].y + landmarks[PINKY_MCP].y) / 2,
        z: (landmarks[INDEX_MCP].z + landmarks[PINKY_MCP].z) / 2,
      };

      let extendedFingers = 0;
      [INDEX_TIP, MIDDLE_TIP, RING_TIP, PINKY_TIP].forEach((tipIndex) => {
        const tip = landmarks[tipIndex];
        const mcp = landmarks[tipIndex - 3];
        const tipDist = Math.sqrt(
          Math.pow(tip.x - palmCenterLandmark.x, 2) +
          Math.pow(tip.y - palmCenterLandmark.y, 2) +
          Math.pow(tip.z - palmCenterLandmark.z, 2)
        );
        const mcpDist = Math.sqrt(
          Math.pow(mcp.x - palmCenterLandmark.x, 2) +
          Math.pow(mcp.y - palmCenterLandmark.y, 2) +
          Math.pow(mcp.z - palmCenterLandmark.z, 2)
        );
        if (tipDist > mcpDist * 1.2) {
          extendedFingers++;
        }
      });

      const fingerTips = [THUMB_TIP, INDEX_TIP, MIDDLE_TIP, RING_TIP, PINKY_TIP].map(
        (idx) => ({ x: landmarks[idx].x, y: landmarks[idx].y })
      );

      return {
        palmCenter,
        fingerTips,
        isOpen: extendedFingers >= 3,
        velocity,
      };
    });

    previousHandsRef.current = newHands.map((h) => ({ palmCenter: h.palmCenter }));
    setHands(newHands);

    // Update particle system
    const interactionPoints = newHands.map((hand) => ({
      x: 1 - hand.palmCenter.x, // Mirror for natural feel
      y: hand.palmCenter.y,
      strength: 1,
      isAttract: hand.isOpen,
    }));

    particleSystemRef.current.setInteractionPoints(interactionPoints);

    // Add finger trails
    newHands.forEach((hand) => {
      if (hand.fingerTips[1]) {
        particleSystemRef.current?.addTrailPoint(
          1 - hand.fingerTips[1].x,
          hand.fingerTips[1].y
        );
      }
    });

    // Burst effect for quick movements
    newHands.forEach((hand) => {
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

  // Start camera and hand tracking
  const startTracking = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      setIsLoading(true);
      setError(null);

      // Get camera stream first
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });

      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      // Load MediaPipe Hands from CDN
      const { Hands } = await import('@mediapipe/hands');

      const hands = new Hands({
        locateFile: (file: string) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        },
      });

      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.5,
      });

      hands.onResults(processHands);
      handsRef.current = hands;

      // Start detection loop
      const detectHands = async () => {
        if (videoRef.current && handsRef.current && videoRef.current.readyState >= 2) {
          await handsRef.current.send({ image: videoRef.current });
        }
        animationRef.current = requestAnimationFrame(detectHands);
      };

      detectHands();
      setIsEnabled(true);
      setIsLoading(false);
      playSound('success');

    } catch (err) {
      console.error('Hand tracking error:', err);
      setError('Camera access denied. Please allow camera access and try again.');
      setIsLoading(false);
    }
  }, [processHands]);

  // Stop tracking
  const stopTracking = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (handsRef.current) {
      handsRef.current.close();
      handsRef.current = null;
    }

    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    setIsEnabled(false);
    setHands([]);
    previousHandsRef.current = [];

    if (particleSystemRef.current) {
      particleSystemRef.current.setInteractionPoints([]);
      particleSystemRef.current.clearTrail();
    }
  }, []);

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

    const handleResize = () => particleSystem.handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      particleSystem.stop();
      particleSystemRef.current = null;
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

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
      isAttract: e.buttons === 0,
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

  // Auto-start camera when tutorial is dismissed
  const handleStartPlay = useCallback(() => {
    setShowTutorial(false);
    // Small delay to let the UI update
    setTimeout(() => {
      startTracking();
    }, 100);
  }, [startTracking]);

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

      {/* Video element for camera */}
      <video
        ref={videoRef}
        className="hidden"
        playsInline
        muted
        autoPlay
      />

      {/* Camera preview (larger and more visible) */}
      {isEnabled && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="absolute bottom-24 right-4 w-48 h-36 rounded-2xl overflow-hidden border-2 border-gold/30 shadow-glow-gold"
        >
          <video
            className="w-full h-full object-cover transform scale-x-[-1]"
            ref={(el) => {
              if (el && videoRef.current?.srcObject) {
                el.srcObject = videoRef.current.srcObject;
                el.play();
              }
            }}
            playsInline
            muted
            autoPlay
          />

          {/* Hand position overlay */}
          {hands.map((hand, idx) => (
            <motion.div
              key={idx}
              className={cn(
                'absolute w-6 h-6 rounded-full border-2',
                hand.isOpen
                  ? 'bg-teal/50 border-teal shadow-glow-teal'
                  : 'bg-coral/50 border-coral shadow-glow-coral'
              )}
              style={{
                left: `${(1 - hand.palmCenter.x) * 100}%`,
                top: `${hand.palmCenter.y * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          ))}

          {/* "Looking for hands" indicator */}
          {hands.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <motion.div
                className="text-cream/70 text-xs text-center px-2"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Hand className="w-6 h-6 mx-auto mb-1" />
                Show your hands
              </motion.div>
            </div>
          )}
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
              <h2 className="text-xl font-bold text-cream">Zen Mode</h2>
              <p className="text-cream/50 text-sm">
                {isEnabled
                  ? hands.length > 0
                    ? `${hands.length} hand${hands.length > 1 ? 's' : ''} detected`
                    : 'Waiting for hands...'
                  : 'Enable camera to use hand tracking'}
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

      {/* Camera Toggle - more prominent */}
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
            'flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-lg',
            'transition-all duration-300',
            isEnabled
              ? 'bg-coral text-white shadow-[0_6px_0_0_#B54840]'
              : 'bg-gradient-to-r from-teal to-teal-dark text-white shadow-[0_6px_0_0_#147A6E]',
            'active:shadow-[0_2px_0_0] active:translate-y-1'
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ y: 4 }}
        >
          {isLoading ? (
            <motion.div
              className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          ) : isEnabled ? (
            <CameraOff className="w-6 h-6" />
          ) : (
            <Camera className="w-6 h-6" />
          )}
          {isLoading ? 'Starting Camera...' : isEnabled ? 'Stop Camera' : 'Start Hand Tracking'}
        </motion.button>

        <motion.button
          onClick={() => setShowTutorial(true)}
          className="p-4 rounded-xl bg-night-light/80 hover:bg-night-lighter transition-colors"
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
            className="absolute top-20 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl bg-coral/20 border border-coral/30 text-coral max-w-md text-center"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tutorial Modal - with auto-start option */}
      <AnimatePresence>
        {showTutorial && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto"
            >
              <div className="bg-night-light border border-cream/10 rounded-2xl p-6 shadow-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-gold/30 to-coral/30">
                    <Hand className="w-8 h-8 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-cream">Hand-Controlled Particles</h3>
                    <p className="text-cream/50 text-sm">Wave your hands in front of the camera</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-teal/10 border border-teal/20">
                    <div className="w-10 h-10 rounded-full bg-teal/20 flex items-center justify-center">
                      <span className="text-xl">🖐️</span>
                    </div>
                    <div>
                      <p className="text-teal font-medium">Open Palm</p>
                      <p className="text-cream/50 text-sm">Attracts particles toward you</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-coral/10 border border-coral/20">
                    <div className="w-10 h-10 rounded-full bg-coral/20 flex items-center justify-center">
                      <span className="text-xl">✊</span>
                    </div>
                    <div>
                      <p className="text-coral font-medium">Closed Fist</p>
                      <p className="text-cream/50 text-sm">Pushes particles away</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gold/10 border border-gold/20">
                    <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                      <span className="text-xl">👆</span>
                    </div>
                    <div>
                      <p className="text-gold font-medium">Index Finger</p>
                      <p className="text-cream/50 text-sm">Leaves glowing trails</p>
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={handleStartPlay}
                  className={cn(
                    'w-full py-4 rounded-xl font-semibold text-lg',
                    'bg-gradient-to-r from-coral via-gold to-teal',
                    'text-white shadow-[0_6px_0_0_rgba(0,0,0,0.3)]',
                    'active:shadow-[0_2px_0_0] active:translate-y-1',
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ y: 4 }}
                >
                  <Camera className="w-5 h-5 inline mr-2" />
                  Start Camera & Play
                </motion.button>

                <button
                  onClick={() => setShowTutorial(false)}
                  className="w-full mt-3 py-2 text-cream/40 text-sm hover:text-cream/60 transition-colors"
                >
                  Skip (use mouse instead)
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hand Status Indicator - larger and clearer */}
      {isEnabled && hands.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute bottom-24 left-4 space-y-2"
        >
          {hands.map((hand, idx) => (
            <motion.div
              key={idx}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-sm',
                hand.isOpen
                  ? 'bg-teal/30 border-2 border-teal/50'
                  : 'bg-coral/30 border-2 border-coral/50'
              )}
              animate={{
                scale: [1, 1.02, 1],
                boxShadow: hand.isOpen
                  ? ['0 0 20px rgba(27, 153, 139, 0.3)', '0 0 30px rgba(27, 153, 139, 0.5)', '0 0 20px rgba(27, 153, 139, 0.3)']
                  : ['0 0 20px rgba(232, 90, 79, 0.3)', '0 0 30px rgba(232, 90, 79, 0.5)', '0 0 20px rgba(232, 90, 79, 0.3)']
              }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <span className="text-2xl">{hand.isOpen ? '🖐️' : '✊'}</span>
              <div>
                <p className={cn('font-semibold', hand.isOpen ? 'text-teal' : 'text-coral')}>
                  {hand.isOpen ? 'Attracting' : 'Repelling'}
                </p>
                <p className="text-cream/50 text-xs">Hand {idx + 1}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
