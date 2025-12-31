'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

export interface HandData {
  landmarks: HandLandmark[];
  isOpen: boolean; // palm open vs closed fist
  palmCenter: { x: number; y: number };
  fingerTips: { x: number; y: number }[];
  velocity: { x: number; y: number };
}

export interface UseHandTrackingOptions {
  onHandsDetected?: (hands: HandData[]) => void;
  maxHands?: number;
}

// Landmark indices for MediaPipe Hands
const WRIST = 0;
const THUMB_TIP = 4;
const INDEX_TIP = 8;
const MIDDLE_TIP = 12;
const RING_TIP = 16;
const PINKY_TIP = 20;
const INDEX_MCP = 5;
const PINKY_MCP = 17;

function calculateDistance(p1: HandLandmark, p2: HandLandmark): number {
  return Math.sqrt(
    Math.pow(p1.x - p2.x, 2) +
    Math.pow(p1.y - p2.y, 2) +
    Math.pow(p1.z - p2.z, 2)
  );
}

function isHandOpen(landmarks: HandLandmark[]): boolean {
  // Check if fingers are extended by comparing fingertip distance to palm
  const palmCenter = {
    x: (landmarks[INDEX_MCP].x + landmarks[PINKY_MCP].x) / 2,
    y: (landmarks[INDEX_MCP].y + landmarks[PINKY_MCP].y) / 2,
    z: (landmarks[INDEX_MCP].z + landmarks[PINKY_MCP].z) / 2,
  };

  const fingerTips = [INDEX_TIP, MIDDLE_TIP, RING_TIP, PINKY_TIP];
  let extendedFingers = 0;

  fingerTips.forEach((tipIndex) => {
    const tipDistance = calculateDistance(landmarks[tipIndex], palmCenter);
    const mcpDistance = calculateDistance(landmarks[tipIndex - 3], palmCenter);
    if (tipDistance > mcpDistance * 1.2) {
      extendedFingers++;
    }
  });

  return extendedFingers >= 3;
}

export function useHandTracking(options: UseHandTrackingOptions = {}) {
  const { onHandsDetected, maxHands = 2 } = options;

  const videoRef = useRef<HTMLVideoElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handsRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cameraRef = useRef<any>(null);
  const previousHandsRef = useRef<{ palmCenter: { x: number; y: number } }[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hands, setHands] = useState<HandData[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const processResults = useCallback((results: any) => {
    const newHands: HandData[] = [];

    if (results.multiHandLandmarks) {
      results.multiHandLandmarks.forEach((landmarks: HandLandmark[], index: number) => {
        const palmCenter = {
          x: (landmarks[INDEX_MCP].x + landmarks[PINKY_MCP].x + landmarks[WRIST].x) / 3,
          y: (landmarks[INDEX_MCP].y + landmarks[PINKY_MCP].y + landmarks[WRIST].y) / 3,
        };

        // Calculate velocity from previous frame
        const previousHand = previousHandsRef.current[index];
        const velocity = previousHand
          ? {
              x: (palmCenter.x - previousHand.palmCenter.x) * 100,
              y: (palmCenter.y - previousHand.palmCenter.y) * 100,
            }
          : { x: 0, y: 0 };

        const fingerTips = [THUMB_TIP, INDEX_TIP, MIDDLE_TIP, RING_TIP, PINKY_TIP].map(
          (idx) => ({ x: landmarks[idx].x, y: landmarks[idx].y })
        );

        newHands.push({
          landmarks,
          isOpen: isHandOpen(landmarks),
          palmCenter,
          fingerTips,
          velocity,
        });
      });
    }

    previousHandsRef.current = newHands.map((h) => ({ palmCenter: h.palmCenter }));
    setHands(newHands);
    onHandsDetected?.(newHands);
  }, [onHandsDetected]);

  const startTracking = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      setIsLoading(true);
      setError(null);

      // Dynamically import MediaPipe modules
      const { Hands } = await import('@mediapipe/hands');
      const { Camera } = await import('@mediapipe/camera_utils');

      // Initialize MediaPipe Hands
      const hands = new Hands({
        locateFile: (file: string) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        },
      });

      hands.setOptions({
        maxNumHands: maxHands,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.5,
      });

      hands.onResults(processResults);
      handsRef.current = hands;

      // Start camera
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current && handsRef.current) {
            await handsRef.current.send({ image: videoRef.current });
          }
        },
        width: 640,
        height: 480,
      });

      await camera.start();
      cameraRef.current = camera;

      setIsEnabled(true);
      setIsLoading(false);
    } catch (err) {
      console.error('Hand tracking error:', err);
      setError('Failed to start camera. Please allow camera access.');
      setIsLoading(false);
    }
  }, [maxHands, processResults]);

  const stopTracking = useCallback(() => {
    if (cameraRef.current) {
      cameraRef.current.stop();
      cameraRef.current = null;
    }
    if (handsRef.current) {
      handsRef.current.close();
      handsRef.current = null;
    }
    setIsEnabled(false);
    setHands([]);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

  return {
    videoRef,
    hands,
    isLoading,
    isEnabled,
    error,
    startTracking,
    stopTracking,
  };
}
