'use client';

import React from 'react';
import Link from 'next/link';
import { getHeroContent } from '@/lib/content-loader';

export default function Hero() {
  const heroContent = getHeroContent();

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

          {/* Main name in neumorphic inset container */}
          <div className="neu-surface-inset p-6 sm:p-8 md:p-10 mb-6 sm:mb-8 animate-fade-in animation-delay-200">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-neu-text-primary">
              I'm <span className="neu-text-gradient">{heroContent.name}</span>
            </h1>
          </div>

          {/* Tagline pill */}
          <div className="mb-6 sm:mb-8 animate-fade-in animation-delay-400">
            <span className="neu-pill text-base sm:text-lg md:text-xl">
              {heroContent.tagline}
            </span>
          </div>

          {/* Description */}
          <div className="neu-surface-inset p-6 mb-8 sm:mb-10 max-w-2xl mx-auto rounded-2xl">
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
