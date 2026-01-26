'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getHeroContent } from '@/lib/content-loader';

export default function Hero() {
  const heroContent = getHeroContent();
  const router = useRouter();
  
  // Swipe gesture state
  const [swipeDistance, setSwipeDistance] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(600);
  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const isDraggingRef = useRef(false); // For use in event listeners
  
  // Use container width with 10% tolerance (90% of width triggers)
  const SWIPE_THRESHOLD_RATIO = 0.9;
  const swipeThreshold = containerWidth * SWIPE_THRESHOLD_RATIO;
  const swipeProgress = Math.min(1, swipeDistance / swipeThreshold);

  // Global mouse/touch handlers - allows swipe to continue outside container
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - startXRef.current;
      setSwipeDistance(Math.max(0, deltaX));
    };

    const handleGlobalMouseUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      setIsDragging(false);
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.touches[0].clientX - startXRef.current;
      setSwipeDistance(Math.max(0, deltaX));
    };

    const handleGlobalTouchEnd = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('touchmove', handleGlobalTouchMove);
    document.addEventListener('touchend', handleGlobalTouchEnd);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, []);

  // Check if swipe threshold is met when dragging stops
  useEffect(() => {
    if (!isDragging && swipeDistance >= swipeThreshold) {
      router.push('/contact');
    }
    if (!isDragging) {
      setSwipeDistance(0);
    }
  }, [isDragging, swipeDistance, swipeThreshold, router]);

  const handleSwipeStart = useCallback((clientX: number) => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
    isDraggingRef.current = true;
    setIsDragging(true);
    startXRef.current = clientX;
  }, []);

  // Touch handler for starting
  const handleTouchStart = (e: React.TouchEvent) => {
    handleSwipeStart(e.touches[0].clientX);
  };

  // Mouse handler for starting
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleSwipeStart(e.clientX);
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Neumorphic background base - Removed to show AnimatedBackground */}
      {/* <div className="absolute inset-0 bg-neu-bg-dark -z-10"></div> */}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Floating greeting badge */}
          <div className="mb-6 sm:mb-8 animate-fade-in">
            <span className="neu-badge">
              {heroContent.greeting}
            </span>
          </div>

          {/* Main name in neumorphic inset container - with swipe functionality */}
          <div 
            ref={containerRef}
            className="neu-glass neu-texture p-6 sm:p-8 md:p-10 mb-6 sm:mb-8 animate-float rounded-2xl relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
            onTouchStart={handleTouchStart}
            onMouseDown={handleMouseDown}
          >
            {/* Swipe progress overlay */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-neu-accent/30 to-neu-accent/50 pointer-events-none"
              style={{ 
                transform: `translateX(${-100 + swipeProgress * 100}%)`,
                opacity: isDragging ? 1 : 0,
                transition: isDragging ? 'transform 50ms ease-out' : 'opacity 0.3s ease-out, transform 0.3s ease-out'
              }}
            />
            
            <div className="relative z-10">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-neu-text-primary">
                <span className="text-neu-warm-neutral">I&apos;m</span> <span className="neu-text-gradient">{heroContent.name}</span>
              </h1>
              
              {/* Swipe hint with animated chevrons */}
              <div className="mt-4 flex items-center gap-3 text-neu-text-muted text-sm sm:text-base group">
                <span className="opacity-60">Swipe to send me a message</span>
                
                {/* Animated sliding chevrons */}
                <div className="flex items-center overflow-hidden w-12">
                  <div className="flex animate-slide-right">
                    <svg className="w-4 h-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <svg className="w-4 h-4 opacity-60 -ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <svg className="w-4 h-4 opacity-80 -ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tagline pill */}
          <div className="mb-6 sm:mb-8 animate-fade-in animation-delay-400">
            <span className="neu-pill text-base sm:text-lg md:text-xl">
              {heroContent.tagline}
            </span>
          </div>

          {/* Description */}
          <div className="neu-glass neu-texture p-6 mb-8 sm:mb-10 max-w-2xl mx-auto rounded-2xl animate-float-delayed">
            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-neu-text-secondary animate-fade-in animation-delay-400">
              {heroContent.description}
            </p>
          </div>

          {/* Neumorphic buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in animation-delay-600">
            {heroContent.buttons.map((button, index) => (
              <Link key={index} href={button.href}>
                <button
                  className={`neu-btn ${
                    button.variant === 'raised' ? 'neu-btn-raised' : 'neu-btn-outline'
                  } w-full sm:w-auto text-base sm:text-lg`}
                >
                  {button.text}
                </button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
