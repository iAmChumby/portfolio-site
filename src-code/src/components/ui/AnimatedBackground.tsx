'use client';

import React, { useEffect, useRef } from 'react';

interface TopoPoint {
  x: number;
  y: number;
  elevation: number;
  animatedElevation: number; // Add animated elevation for color calculations
  char: string;
}

interface AnimatedBackgroundWrapperProps {
  className?: string;
}

const AnimatedBackgroundWrapper: React.FC<AnimatedBackgroundWrapperProps> = ({ 
  className = '' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const topoPointsRef = useRef<TopoPoint[]>([]);
  const animationRef = useRef<number | undefined>(undefined);
  const timeRef = useRef<number>(0);
  const isRunningRef = useRef<boolean>(false);
  const lastFrameTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Simplified character sets for clearer spiral visibility
    const topoChars = ['8', '0', 'O']; // High elevation - spiral arms
    const detailChars = ['.', '_', '-']; // Low elevation - valleys
    const gridSize = 16; // Smaller size for more detail
    
    // Noise function for texture
    const noise = (x: number, y: number, scale: number = 1) => {
      return Math.sin(x * scale) * Math.cos(y * scale) * 0.5 + 0.5;
    };

    const createTopoMap = () => {
      const points: TopoPoint[] = [];
      const cols = Math.ceil(canvas.width / gridSize);
      const rows = Math.ceil(canvas.height / gridSize);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * gridSize;
          const y = row * gridSize;
          
          // Calculate distance and angle from center for spiral pattern
          const dx = x - centerX;
          const dy = y - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx);
          
          // Create clean, distinct spiral pattern
          const spiralFreq = 0.004; // Looser spiral for clearer arms
          const spiralArms = 3; // Number of spiral arms
          const baseSpiral = Math.sin((distance * spiralFreq) + (angle * spiralArms)) * 1.0;
          
          // Add gentle radial waves for depth
          const radialWaves = Math.sin(distance * 0.006) * 0.3;
          
          // Minimal noise for slight texture only
          const subtleNoise = noise(x * 0.03, y * 0.03, 1) * 0.1;
          
          const complexElevation = baseSpiral + radialWaves + subtleNoise;
          
          points.push({
            x,
            y,
            elevation: complexElevation,
            animatedElevation: complexElevation, // Initialize with base elevation
            char: topoChars[0] // Will be updated in animation
          });
        }
      }
      
      topoPointsRef.current = points;
    };

    const drawTopoMap = () => {
      // Ensure canvas and context are valid
      if (!canvas || !ctx) return;
      
      // Clear with black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Set font for ASCII characters
      ctx.font = `${gridSize * 0.8}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const points = topoPointsRef.current;
      if (!points || points.length === 0) return;
      
      points.forEach(point => {
        // Use animated elevation for consistent color calculations
        // Map from [-1.05, 1.05] to [0, 1] for color intensity
        const colorElevation = (point.animatedElevation + 1.05) / 2.1;
        const clampedColorElevation = Math.max(0, Math.min(1, colorElevation));
        
        // Enhanced color calculation for better spiral visibility
        const colorIntensity = clampedColorElevation;
        const red = Math.floor(colorIntensity * 255);
        const green = Math.floor(colorIntensity * 220);
        const blue = Math.floor(colorIntensity * 180);
        
        ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
        
        // Add glow effect for higher elevations to make spiral more visible
        if (clampedColorElevation > 0.6) {
          ctx.shadowColor = `rgba(${green}, ${Math.floor(green * 0.9)}, ${Math.floor(green * 0.7)}, 0.4)`;
          ctx.shadowBlur = 3;
        } else {
          ctx.shadowBlur = 0;
        }
        
        // Draw ASCII character
        if (point.char !== ' ') {
          ctx.fillText(
            point.char,
            point.x + gridSize / 2,
            point.y + gridSize / 2
          );
        }
      });
    };

    const animate = () => {
      // Check if animation should continue running
      if (!isRunningRef.current) {
        return;
      }

      // Use simple continuous time without modulo to prevent discontinuities
      const currentTime = performance.now() * 0.001;
      timeRef.current = currentTime;
      lastFrameTimeRef.current = performance.now();
      
      // Update topographic map with spiral pattern
      const points = topoPointsRef.current;
      const time = currentTime;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Only process if we have points
      if (points && points.length > 0) {
        points.forEach(point => {
          // Calculate distance and angle from center
          const dx = point.x - centerX;
          const dy = point.y - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx);
          
          // Create clean, distinct spiral pattern with consistent amplitude
          const spiralFreq = 0.005; // Slightly higher frequency for smaller bands
          const spiralArms = 8; // Changed from 6 to 8 spiral arms
          const spiralElevation = Math.sin((distance * spiralFreq) + (angle * spiralArms) + (time * 0.5)) * 0.6; // Reduced amplitude for smaller bands
          
          // Add gentle radial waves for depth
          const radialWaves = Math.sin((distance * 0.006) + (time * 0.3)) * 0.2;
          
          // Minimal noise for slight texture only
          const subtleNoise = noise(point.x * 0.03, point.y * 0.03, 1) * 0.05;
          
          // Combine elevations with better balance to ensure spiral visibility
          const combinedElevation = spiralElevation + radialWaves + subtleNoise;
          
          // Store the animated elevation for color calculations
          point.animatedElevation = combinedElevation;
          
          // Improved normalization to ensure spiral arms are always visible
          // Map from [-1.05, 1.05] to [0, 1] with bias toward higher values
          const normalizedElevation = (combinedElevation + 1.05) / 2.1;
          const clampedElevation = Math.max(0, Math.min(1, normalizedElevation));
          
          // Enhanced character selection with better contrast
          if (clampedElevation < 0.4) {
            // Low areas - valleys between spiral arms
            point.char = detailChars[Math.floor(clampedElevation * 2.5 * detailChars.length) % detailChars.length];
          } else {
            // High areas - spiral arms - ensure they're always visible
            const highIndex = Math.floor((clampedElevation - 0.4) * 1.67 * topoChars.length);
            point.char = topoChars[Math.min(highIndex, topoChars.length - 1)];
          }
        });
      }
      
      drawTopoMap();
      
      // Continue animation only if still running
      if (isRunningRef.current) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    const startAnimation = () => {
      if (!isRunningRef.current) {
        isRunningRef.current = true;
        lastFrameTimeRef.current = performance.now();
        animate();
      }
    };

    const stopAnimation = () => {
      isRunningRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
    };

    // Watchdog to restart animation if it stops unexpectedly
    const watchdog = setInterval(() => {
      if (isRunningRef.current) {
        const now = performance.now();
        const timeSinceLastFrame = now - lastFrameTimeRef.current;
        // If more than 100ms since last frame, restart animation
        if (timeSinceLastFrame > 100) {
          console.log('Animation watchdog: restarting stopped animation');
          animationRef.current = requestAnimationFrame(animate);
          lastFrameTimeRef.current = now;
        }
      }
    }, 50);

    resizeCanvas();
    createTopoMap();
    startAnimation();

    const handleResize = () => {
      resizeCanvas();
      createTopoMap();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(watchdog);
      stopAnimation();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full ${className}`}
      style={{ 
        zIndex: -10,
        pointerEvents: 'none',
        opacity: 1.0,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh'
      }}
    />
  );
};

export default AnimatedBackgroundWrapper;