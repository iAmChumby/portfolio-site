'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { EnvelopeIcon, ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { getHeroContent } from '@/lib/content-loader';
import ProximityCard from '@/components/ui/ProximityCard';
import ContactForm from '@/components/ui/ContactForm';

export default function Hero() {
  const heroContent = getHeroContent();
  const [isContactExpanded, setIsContactExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Swipe gesture state
  const [swipeDistance, setSwipeDistance] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(600);
  const startXRef = useRef(0);
  const isDraggingRef = useRef(false);

  const SWIPE_THRESHOLD_RATIO = 0.7; // Increased threshold for more deliberate action
  const swipeThreshold = containerWidth * SWIPE_THRESHOLD_RATIO;
  const swipeProgress = Math.min(1, swipeDistance / swipeThreshold);

  // Global mouse/touch handlers
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

    if (!isContactExpanded) {
        document.addEventListener('mousemove', handleGlobalMouseMove);
        document.addEventListener('mouseup', handleGlobalMouseUp);
        document.addEventListener('touchmove', handleGlobalTouchMove);
        document.addEventListener('touchend', handleGlobalTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [isContactExpanded]);

  // Check if swipe threshold is met
  useEffect(() => {
    if (!isDragging && swipeDistance >= swipeThreshold) {
      setIsContactExpanded(true);
      setSwipeDistance(0);
    }
    if (!isDragging) {
      setSwipeDistance(0);
    }
  }, [isDragging, swipeDistance, swipeThreshold]);

  const handleSwipeStart = (clientX: number) => {
    if (isContactExpanded) return;
    
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
    isDraggingRef.current = true;
    setIsDragging(true);
    startXRef.current = clientX;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    handleSwipeStart(e.touches[0].clientX);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    handleSwipeStart(e.clientX);
  };

  const toggleContact = () => {
    setIsContactExpanded(!isContactExpanded);
  };

  const handleContactSuccess = () => {
      setTimeout(() => {
          setIsContactExpanded(false);
      }, 2000);
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Floating greeting badge */}
          <div className="mb-6 sm:mb-8 animate-fade-in">
            <span className="neu-badge">
              {heroContent.greeting}
            </span>
          </div>

          {/* Main name in neumorphic interactable container */}
          <ProximityCard 
            ref={containerRef}
            className={`neu-glass neu-texture p-6 sm:p-8 md:p-10 mb-6 sm:mb-8 rounded-2xl relative overflow-hidden transition-all duration-500 ease-in-out ${
                isContactExpanded ? 'ring-2 ring-neu-accent/20 cursor-default' : 'cursor-grab active:cursor-grabbing'
            }`}
            onTouchStart={!isContactExpanded ? handleTouchStart : undefined}
            onMouseDown={!isContactExpanded ? handleMouseDown : undefined}
          >
            {/* Swipe progress overlay */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-neu-accent/10 to-neu-accent/20 pointer-events-none"
              style={{ 
                transform: `translateX(${-100 + swipeProgress * 100}%)`,
                opacity: isDragging ? 1 : 0,
                transition: isDragging ? 'transform 50ms ease-out' : 'opacity 0.3s ease-out',
                zIndex: 0
              }}
            />

            <div className="relative z-10 w-full">
                <div className="flex flex-col">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-neu-text-primary select-none">
                        <span className="text-neu-warm-neutral">I&apos;m</span> <span className="neu-text-gradient">{heroContent.name}</span>
                    </h1>
                    
                    {/* Expand Trigger */}
                    <div 
                        className={`mt-6 flex items-center gap-3 text-neu-text-muted text-sm sm:text-base group text-left w-full transition-all duration-300 ${
                            isContactExpanded ? 'opacity-0 h-0 overflow-hidden mt-0' : 'opacity-100 h-auto'
                        }`}
                        aria-expanded={isContactExpanded}
                    >
                        <div className="px-4 py-2 rounded-full neu-surface-inset transition-colors flex items-center gap-2 select-none pointer-events-none">
                             <EnvelopeIcon className="w-4 h-4" />
                             <span className="font-medium">Swipe to message</span>
                             <div className="flex animate-slide-right ml-1">
                                <span className="text-xs opacity-40">&gt;</span>
                                <span className="text-xs opacity-70">&gt;</span>
                                <span className="text-xs opacity-100">&gt;</span>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Vertical Expansion Container */}
                <div 
                    className={`grid transition-[grid-template-rows,opacity,margin] duration-500 ease-in-out ${
                        isContactExpanded ? 'grid-rows-[1fr] opacity-100 mt-8' : 'grid-rows-[0fr] opacity-0 mt-0 pt-0'
                    }`}
                >
                    <div className="overflow-hidden">
                        <div className="flex justify-between items-center mb-6 border-b border-neu-text-muted/10 pb-4">
                            <h2 className="text-2xl font-bold text-neu-text-primary">Get in Touch</h2>
                            <button 
                                onClick={toggleContact}
                                className="p-2 rounded-full hover:bg-neu-text-muted/10 transition-colors text-neu-text-secondary"
                                aria-label="Close contact form"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <ContactForm 
                            onCancel={() => setIsContactExpanded(false)} 
                            onSuccess={handleContactSuccess} 
                            autoFocus={isContactExpanded}
                        />
                    </div>
                </div>
            </div>
          </ProximityCard>

          {/* Tagline pill */}
          <div className="mb-6 sm:mb-8 animate-fade-in animation-delay-400">
            <span className="neu-pill text-base sm:text-lg md:text-xl">
              {heroContent.tagline}
            </span>
          </div>

          {/* Description */}
          <ProximityCard className="neu-glass neu-texture p-6 mb-8 sm:mb-10 max-w-2xl mx-auto rounded-2xl animate-float-delayed">
            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-neu-text-secondary animate-fade-in animation-delay-400">
              {heroContent.description}
            </p>
          </ProximityCard>

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
