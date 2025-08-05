'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import siteConfig from "@/data/site-config.json";


export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background decoration - positioned behind spiral animation */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 -z-20"></div>
      
      {/* Subtle blur overlay over spiral animation */}
      <div className="absolute inset-0 backdrop-blur-[0.5px] z-0 pointer-events-none"></div>
      <div className="absolute top-10 left-10 md:top-20 md:left-20 w-48 h-48 md:w-72 md:h-72 bg-accent/10 rounded-full blur-sm animate-pulse -z-20"></div>
      <div className="absolute bottom-10 right-10 md:bottom-20 md:right-20 w-64 h-64 md:w-96 md:h-96 bg-secondary/10 rounded-full blur-sm animate-pulse delay-1000 -z-20"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 animate-fade-in text-white">
            Hi, I&apos;m <span className="text-gradient">{siteConfig.site.author.name}</span>
          </h1>
          
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 sm:mb-8 text-white animate-fade-in animation-delay-200">
            Full Stack Developer & UI/UX Designer
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl leading-relaxed mb-8 sm:mb-12 max-w-2xl mx-auto text-white animate-fade-in animation-delay-400">
            I create beautiful, functional, and user-centered digital experiences. 
            Passionate about clean code, innovative design, and solving complex problems.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in animation-delay-600">
            <Button 
              variant="primary" 
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View My Work
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get In Touch
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}