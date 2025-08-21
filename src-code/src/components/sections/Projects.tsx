'use client';

import React, { useState } from 'react';
import { ArrowTopRightOnSquareIcon, CodeBracketIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { getProjectsContent } from '@/lib/content-loader';

export default function Projects() {
  const projectsContent = getProjectsContent();
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const displayedProjects = showAllProjects ? projectsContent.items : projectsContent.items.slice(0, 3);

  const handleToggleProjects = () => {
    setIsAnimating(true);
    setShowAllProjects(!showAllProjects);
    // Reset animation state after animation completes
    setTimeout(() => setIsAnimating(false), 600);
  };
  return (
    <section id="projects" className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="relative inline-block bg-black/30 backdrop-blur-md border border-white/20 rounded-lg p-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 text-white">{projectsContent.title}</h2>
              <p className="text-lg sm:text-xl md:text-2xl text-center max-w-2xl mx-auto text-white">
                {projectsContent.subtitle}
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-500 ease-in-out">
            {displayedProjects.map((project, index) => {
              const isNewProject = index >= 3;
              const animationDelay = isNewProject ? `${(index - 3) * 150}ms` : '0ms';
              
              return (
                <div 
                  key={project.id}
                  className={`group bg-black/30 backdrop-blur-md border border-white/20 rounded-lg overflow-hidden hover:bg-black/40 hover:border-accent/50 hover:scale-105 transition-all duration-300 ${
                    isNewProject ? 'project-card-enter' : ''
                  }`}
                  style={{
                    animationDelay: isNewProject ? animationDelay : undefined,
                    animationFillMode: 'both'
                  }}
                >
                  <div className="aspect-video bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center border-b border-white/10 overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-all duration-300"
                    />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-semibold text-white mb-3 text-xl">{project.title}</h3>
                    <p className="text-white/80 mb-4 text-sm leading-relaxed">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-3 mb-6 justify-center">
                      {project.technologies.map((tech) => (
                        <span 
                          key={tech}
                          className="relative px-4 py-2 rounded-full text-sm font-medium border cursor-pointer transition-all duration-300 ease-out transform-gpu bg-accent/20 text-white border-accent/30 hover:bg-accent/40 hover:border-accent/60 hover:scale-110 hover:shadow-lg hover:shadow-accent/25"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex gap-3">
                      <button className="flex items-center gap-2 px-4 py-2 bg-accent/20 text-accent border border-accent/30 rounded-lg text-sm font-medium hover:bg-accent hover:text-white transition-all duration-300">
                        <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                        Live Demo
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg text-sm font-medium hover:bg-white/20 hover:border-white/40 transition-all duration-300">
                        <CodeBracketIcon className="w-4 h-4" />
                        Code
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="text-center mt-12">
            <button 
              onClick={handleToggleProjects}
              disabled={isAnimating}
              className={`flex items-center gap-2 px-6 py-3 bg-white/10 text-white border border-white/20 rounded-lg font-medium transition-all duration-300 mx-auto transform-gpu ${
                isAnimating 
                  ? 'scale-95 bg-white/5 cursor-not-allowed opacity-80' 
                  : 'hover:bg-white/20 hover:border-white/40 hover:scale-105 active:scale-95 active:bg-white/30'
              }`}
            >
              <div className={`transition-transform duration-300 ${isAnimating ? 'rotate-180' : ''}`}>
                {showAllProjects ? (
                  <ChevronUpIcon className="w-5 h-5" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5" />
                )}
              </div>
              <span className="transition-all duration-300">
                {isAnimating 
                  ? (showAllProjects ? projectsContent.buttons.hiding : projectsContent.buttons.loading) 
                  : (showAllProjects ? projectsContent.buttons.showLess : projectsContent.buttons.showMore)
                }
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}