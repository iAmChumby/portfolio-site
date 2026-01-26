'use client';

import React, { useEffect, useRef } from 'react';

interface TopoPoint {
  x: number;
  y: number;
  elevation: number;
  animatedElevation: number;
  char: string;
  // Pre-calculated values for performance
  distance: number;
  angle: number;
  dx: number;
  dy: number;
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
  
  // Performance optimization: Target 15fps for better optimization
  const targetFPS = 15;
  const frameInterval = 1000 / targetFPS;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Optimized character sets and grid size for better performance
    const topoChars = ['8', '0', 'O']; // High elevation - spiral arms
    const detailChars = ['.', '_', '-']; // Low elevation - valleys
    const gridSize = 20; // Increased from 16 to reduce point count for better performance
    
    // Simplified noise function for texture
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
          
          // Pre-calculate distance and angle for performance optimization
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
            animatedElevation: complexElevation,
            char: topoChars[0],
            // Store pre-calculated values for performance
            distance,
            angle,
            dx,
            dy
          });
        }
      }
      
      topoPointsRef.current = points;
    };

    const drawTopoMap = () => {
      // Ensure canvas and context are valid
      if (!canvas || !ctx) return;
      
      // Clear with dark background for the new theme
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0a1510'; // Neumorphic dark green background
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Set font for ASCII characters - only set once for performance
      ctx.font = `${gridSize * 0.7}px monospace`; // Slightly smaller font for better performance
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const points = topoPointsRef.current;
      if (!points || points.length === 0) return;
      
      // Batch rendering for better performance
      points.forEach(point => {
        // Use animated elevation for consistent color calculations
        const colorElevation = (point.animatedElevation + 1.05) / 2.1;
        const clampedColorElevation = Math.max(0, Math.min(1, colorElevation));
        
        // Neumorphic dark green color scheme - warmer, muted tones
        const colorIntensity = clampedColorElevation;
        const red = Math.floor(15 + colorIntensity * 40); // Slightly warmer
        const green = Math.floor(30 + colorIntensity * 130); // Muted sage green
        const blue = Math.floor(20 + colorIntensity * 50); // Subtle depth
        
        ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
        
        // Green shadow effects for better performance
        if (clampedColorElevation > 0.7) {
          ctx.shadowColor = `rgba(${Math.floor(green * 0.7)}, ${green}, ${Math.floor(green * 0.5)}, 0.3)`;
          ctx.shadowBlur = 2; // Reduced from 3 to 2
        } else {
          ctx.shadowBlur = 0;
        }
        
        // Draw ASCII character only if visible
        if (point.char !== ' ' && clampedColorElevation > 0.1) {
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

      const currentTime = performance.now();
      
      // Frame rate limiting for smoother performance
      if (currentTime - lastFrameTimeRef.current < frameInterval) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Update frame time
      lastFrameTimeRef.current = currentTime;
      timeRef.current = currentTime * 0.001;
      
      // Update topographic map with spiral pattern
      const points = topoPointsRef.current;
      const time = timeRef.current;
      
      // Only process if we have points
      if (points && points.length > 0) {
        points.forEach(point => {
          // Use pre-calculated distance and angle for better performance
          const distance = point.distance;
          const angle = point.angle;
          
          // Create clean, distinct spiral pattern with consistent amplitude
          const spiralFreq = 0.005; // Slightly higher frequency for smaller bands
          const spiralArms = 6; // Reduced from 8 to 6 for better performance
          const spiralElevation = Math.sin((distance * spiralFreq) + (angle * spiralArms) + (time * 0.4)) * 0.6; // Slower animation
          
          // Add gentle radial waves for depth
          const radialWaves = Math.sin((distance * 0.006) + (time * 0.2)) * 0.2; // Slower animation
          
          // Minimal noise for slight texture only (pre-calculated)
          const subtleNoise = noise(point.x * 0.03, point.y * 0.03, 1) * 0.05;
          
          // Combine elevations with better balance to ensure spiral visibility
          const combinedElevation = spiralElevation + radialWaves + subtleNoise;
          
          // Store the animated elevation for color calculations
          point.animatedElevation = combinedElevation;
          
          // Improved normalization to ensure spiral arms are always visible
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

    // Optimized watchdog with longer interval for better performance
    const watchdog = setInterval(() => {
      if (isRunningRef.current) {
        const now = performance.now();
        const timeSinceLastFrame = now - lastFrameTimeRef.current;
        // If more than 200ms since last frame, restart animation (increased from 100ms)
        if (timeSinceLastFrame > 200) {
          console.log('Animation watchdog: restarting stopped animation');
          animationRef.current = requestAnimationFrame(animate);
          lastFrameTimeRef.current = now;
        }
      }
    }, 100); // Increased from 50ms to 100ms for better performance

    resizeCanvas();
    createTopoMap();
    console.log('AnimatedBackground: Starting animation with', topoPointsRef.current.length, 'points');
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
  }, [frameInterval]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full ${className}`}
      style={{ 
        zIndex: -5,  // Changed from -10 to -5 to be above background elements but below content
        pointerEvents: 'none',
        opacity: 1.0,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#0a1510'  // Neumorphic dark green background
      }}
    />
  );
};

export default AnimatedBackgroundWrapper;