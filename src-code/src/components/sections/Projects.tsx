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
    <section id="projects" className="py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="relative inline-block neu-surface p-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 text-neu-text-primary">
                <span className="neu-text-gradient">{projectsContent.title}</span>
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl text-center max-w-2xl mx-auto text-neu-text-secondary">
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
                  className={`group neu-surface overflow-hidden hover:scale-105 transition-all duration-300 ${
                    isNewProject ? 'project-card-enter' : ''
                  }`}
                  style={{
                    animationDelay: isNewProject ? animationDelay : undefined,
                    animationFillMode: 'both'
                  }}
                >
                  <div className="aspect-video bg-neu-bg-dark flex items-center justify-center border-b border-[#234d35] overflow-hidden p-2">
                    <div className="w-full h-full rounded-t-lg overflow-hidden">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-all duration-300"
                      />
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-semibold text-neu-text-primary mb-3 text-xl">{project.title}</h3>
                    <div className="neu-surface-inset p-4 rounded-lg mb-4">
                      <p className="text-neu-text-secondary text-sm leading-relaxed">{project.description}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-6 justify-center">
                      {project.technologies.map((tech) => (
                        <span 
                          key={tech}
                          className="neu-badge text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex gap-3 justify-center">
                      {project.demo && project.demo !== '#' && (
                        <button 
                          onClick={() => window.open(project.demo, '_blank')}
                          className="neu-btn neu-btn-raised flex items-center gap-2 px-4 py-2 text-sm"
                        >
                          <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                          Live Demo
                        </button>
                      )}
                      {project.code && project.code !== '#' && (
                        <button 
                          onClick={() => window.open(project.code, '_blank')}
                          className="neu-btn neu-btn-outline flex items-center gap-2 px-4 py-2 text-sm"
                        >
                          <CodeBracketIcon className="w-4 h-4" />
                          Code
                        </button>
                      )}
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
              className={`neu-btn flex items-center gap-2 px-6 py-3 transition-all duration-300 mx-auto transform-gpu ${
                isAnimating 
                  ? 'neu-surface-inset cursor-not-allowed opacity-80' 
                  : 'neu-btn-raised'
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