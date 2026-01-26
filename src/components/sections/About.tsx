'use client';

import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { getAboutContent, getSiteConfig } from '@/lib/content-loader';



export default function About() {
  const aboutContent = getAboutContent();
  const siteConfig = getSiteConfig();

  return (
    <section id="about" className="py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-neu-text-primary">
              <span className="neu-text-gradient">{aboutContent.title}</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto text-neu-text-secondary">
              {aboutContent.subtitle}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <div className="neu-surface p-6 sm:p-8">
                {aboutContent.bio.map((paragraph, index) => (
                  <p 
                    key={index}
                    className={`text-base sm:text-lg ${index === 0 ? 'md:text-xl' : ''} text-center ${index === 0 ? 'text-neu-text-primary' : 'text-neu-text-secondary'} leading-relaxed ${index > 0 ? 'mt-6' : ''}`}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="neu-surface p-8 w-full flex flex-col items-center">
                <Card className="p-0 text-center bg-transparent border-none shadow-none group cursor-pointer w-full">
                  <div className="neu-surface-inset relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full mx-auto mb-8 flex items-center justify-center overflow-hidden transition-all duration-500 ease-out transform-gpu group-hover:scale-105">
                    {aboutContent.profile.image ? (
                      <>
                      <Image 
                          src={aboutContent.profile.image} 
                          alt={siteConfig.site.author.name}
                          fill
                          className="object-cover p-1 rounded-full transition-all duration-500 ease-out group-hover:scale-110"
                        />
                      </>
                    ) : (
                      <span className="text-3xl sm:text-4xl md:text-6xl font-bold text-neu-text-primary transition-all duration-500 ease-out group-hover:scale-110 group-hover:text-neu-accent">{aboutContent.profile.initials}</span>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-3 neu-text-gradient transition-all duration-500 ease-out transform-gpu group-hover:scale-105">{siteConfig.site.author.name}</h3>
                  <p className="text-base sm:text-lg md:text-xl text-neu-text-primary transition-all duration-500 ease-out transform-gpu group-hover:text-neu-accent">{aboutContent.profile.jobTitle}</p>
                </Card>
              </div>
            </div>
          </div>
          
          {/* Skills & Technologies Section - Full Width */}
          <div className="mt-12">
            <div className="neu-surface p-8">
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-center text-neu-text-primary mb-8">{aboutContent.skills.title}</h3>
              <div className="flex flex-wrap gap-4 justify-center">
                {aboutContent.skills.items.map((skill, index) => (
                  <span
                    key={skill}
                    className="neu-badge hover:text-neu-accent hover:scale-110 transition-transform duration-300 cursor-default"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}