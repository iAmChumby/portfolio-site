'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import siteConfig from "@/data/site-config.json";


export default function About() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleSkillHover = (skill: string, event: React.MouseEvent<HTMLSpanElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    setHoveredSkill(skill);
    setMousePosition({ x, y });
  };

  const handleSkillLeave = () => {
    setHoveredSkill(null);
  };

  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-2 !text-center mb-12 !text-white">About Me</h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <p className="text-large !text-center !text-white">
                  I&apos;m a passionate full-stack developer with over 5 years of experience 
                  creating digital solutions that make a difference. I specialize in 
                  modern web technologies and love turning complex problems into 
                  simple, beautiful designs.
                </p>
                
                <p className="text-base !text-center !text-white mt-4">
                  When I&apos;m not coding, you can find me exploring new technologies, 
                  contributing to open-source projects, or enjoying a good cup of coffee 
                  while reading about the latest in tech.
                </p>
              </div>
              
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="flex flex-wrap gap-3 justify-center">
                  {['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'PostgreSQL', 'Docker', 'Java', 'Electron', 'C', 'Sprint Boot', 'Angular'].map((skill) => (
                    <span 
                      key={skill}
                      className={`
                        relative px-4 py-2 rounded-full text-sm font-medium border cursor-pointer
                        transition-all duration-300 ease-out transform-gpu
                        ${hoveredSkill === skill 
                          ? 'bg-accent/40 text-white border-accent/60 scale-110 shadow-lg shadow-accent/25' 
                          : 'bg-accent/20 text-white border-accent/30 hover:bg-accent/30 hover:border-accent/50 hover:scale-105'
                        }
                      `}
                      onMouseEnter={(e) => handleSkillHover(skill, e)}
                      onMouseLeave={handleSkillLeave}
                      onMouseMove={(e) => handleSkillHover(skill, e)}
                      style={{
                        transformOrigin: hoveredSkill === skill 
                          ? `${mousePosition.x}px ${mousePosition.y}px` 
                          : 'center'
                      }}
                    >
                      {skill}
                      {hoveredSkill === skill && (
                        <div 
                          className="absolute inset-0 rounded-full bg-gradient-to-r from-accent/20 to-secondary/20 animate-pulse"
                          style={{
                            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(16, 185, 129, 0.3) 0%, transparent 70%)`
                          }}
                        />
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <Card className="p-8 text-center bg-transparent border-none shadow-none">
                  <div className="w-32 h-32 bg-gradient-to-br from-accent to-secondary rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">LE</span>
                  </div>
                  <h3 className="heading-3 mb-2 !text-white">{siteConfig.site.author.name}</h3>
                  <p className="!text-white">Full Stack Developer</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}