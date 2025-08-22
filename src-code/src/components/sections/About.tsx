'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { getAboutContent, getSiteConfig } from '@/lib/content-loader';


export default function About() {
  const aboutContent = getAboutContent();
  const siteConfig = getSiteConfig();

  return (
    <section id="about" className="py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 text-white">{aboutContent.title}</h2>
            <p className="text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto text-white">
              {aboutContent.subtitle}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <div className="bg-black/30 backdrop-blur-md rounded-lg p-6 border border-white/20">
                {aboutContent.bio.map((paragraph, index) => (
                  <p 
                    key={index}
                    className={`text-base sm:text-lg ${index === 0 ? 'md:text-xl' : ''} text-center ${index === 0 ? 'text-white/90' : 'text-white/80'} leading-relaxed ${index > 0 ? 'mt-6' : ''}`}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="bg-black/30 backdrop-blur-md rounded-lg p-8 border border-white/20">
                <Card className="p-10 text-center bg-transparent border-none shadow-none group cursor-pointer">
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-gradient-to-br from-accent to-secondary rounded-full mx-auto mb-8 flex items-center justify-center overflow-hidden transition-all duration-500 ease-out transform-gpu group-hover:scale-105 sm:group-hover:scale-110 group-hover:shadow-xl sm:group-hover:shadow-2xl group-hover:shadow-accent/20 sm:group-hover:shadow-accent/30 group-active:scale-95 sm:group-active:scale-100">
                    {aboutContent.profile.image ? (
                      <>
                        <img 
                          src={aboutContent.profile.image} 
                          alt={siteConfig.site.author.name}
                          className="w-full h-full object-cover transition-all duration-500 ease-out transform-gpu group-hover:scale-105 group-hover:brightness-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-accent/20 via-transparent to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out rounded-full"></div>
                      </>
                    ) : (
                      <span className="text-3xl sm:text-4xl md:text-6xl font-bold text-white transition-all duration-500 ease-out group-hover:scale-110 group-hover:text-accent">{aboutContent.profile.initials}</span>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-3 text-white transition-all duration-500 ease-out transform-gpu group-hover:scale-110 group-hover:text-accent group-hover:drop-shadow-2xl group-hover:shadow-accent/50 group-active:scale-95 group-hover:font-bold">{siteConfig.site.author.name}</h3>
                  <p className="text-base sm:text-lg md:text-xl text-white/80 transition-all duration-500 ease-out transform-gpu group-hover:scale-110 group-hover:text-white group-hover:underline group-hover:decoration-accent group-hover:decoration-2 group-hover:underline-offset-8 group-active:scale-95 group-hover:font-semibold">{aboutContent.profile.jobTitle}</p>
                </Card>
              </div>
            </div>
          </div>
          
          {/* Skills & Technologies Section - Full Width */}
          <div className="mt-12">
            <div className="bg-black/30 backdrop-blur-md rounded-lg p-8 border border-white/20">
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-center text-white mb-8">{aboutContent.skills.title}</h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {aboutContent.skills.items.map((skill, index) => (
                  <span
                    key={skill}
                    className="relative px-4 py-2 rounded-full text-sm font-medium border cursor-pointer transition-all duration-300 ease-out transform-gpu bg-accent/20 text-white border-accent/30 hover:bg-accent/40 hover:border-accent/60 hover:scale-110 hover:shadow-lg hover:shadow-accent/25"
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