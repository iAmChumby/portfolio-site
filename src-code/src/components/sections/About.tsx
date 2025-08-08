'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import siteConfig from "@/data/site-config.json";


export default function About() {

  return (
    <section id="about" className="py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 text-white">About Me</h2>
            <p className="text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto text-white">
              Get to know more about my journey and expertise
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <div className="bg-black/30 backdrop-blur-md rounded-lg p-6 border border-white/20">
                <p className="text-base sm:text-lg md:text-xl text-center text-white/90 leading-relaxed">
                  I&apos;m a passionate full-stack developer with over 5 years of experience 
                  creating digital solutions that make a difference. I specialize in 
                  modern web technologies and love turning complex problems into 
                  simple, beautiful designs.
                </p>
                
                <p className="text-base sm:text-lg leading-relaxed text-center text-white/80 mt-6">
                  When I&apos;m not coding, you can find me exploring new technologies, 
                  contributing to open-source projects, or enjoying a good cup of coffee 
                  while reading about the latest in tech.
                </p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="bg-black/30 backdrop-blur-md rounded-lg p-8 border border-white/20">
                <Card className="p-10 text-center bg-transparent border-none shadow-none">
                  <div className="w-48 h-48 bg-gradient-to-br from-accent to-secondary rounded-full mx-auto mb-8 flex items-center justify-center">
                    <span className="text-6xl font-bold text-white">LE</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-3 text-white">{siteConfig.site.author.name}</h3>
                  <p className="text-base sm:text-lg md:text-xl text-white/80">Full Stack Developer</p>
                </Card>
              </div>
            </div>
          </div>
          
          {/* Skills & Technologies Section - Full Width */}
          <div className="mt-12">
            <div className="bg-black/30 backdrop-blur-md rounded-lg p-8 border border-white/20">
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-center text-white mb-8">Skills & Technologies</h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'PostgreSQL', 'Docker', 'Java', 'Electron', 'C', 'Spring Boot', 'Angular'].map((skill, index) => (
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