'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { getHeroContent } from '@/lib/content-loader';


export default function Hero() {
  const heroContent = getHeroContent();
  
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background decoration - positioned behind spiral animation */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 -z-20"></div>
      
      {/* Subtle blur overlay over spiral animation */}
      <div className="absolute inset-0 z-0 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-black/30 backdrop-blur-md rounded-lg p-8 border border-white/20">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 animate-fade-in text-white">
              {heroContent.title} <span className="text-gradient">{heroContent.name}</span>
            </h1>
            
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 sm:mb-8 text-white animate-fade-in animation-delay-200">
              {heroContent.subtitle}
            </h2>
            
            <p className="text-base sm:text-lg md:text-xl leading-relaxed mb-8 sm:mb-12 max-w-2xl mx-auto text-white animate-fade-in animation-delay-400">
              {heroContent.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in animation-delay-600">
              {heroContent.buttons.map((button, index) => (
                <Link key={index} href={button.href}>
                  <Button 
                    variant={button.variant} 
                    size={button.size}
                    className="w-full sm:w-auto"
                  >
                    {button.text}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}