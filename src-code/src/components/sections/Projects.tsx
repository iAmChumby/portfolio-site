'use client';

import React, { useState } from 'react';
import { ArrowTopRightOnSquareIcon, CodeBracketIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const allProjects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce solution built with Next.js, Stripe, and PostgreSQL. Features include user authentication, payment processing, and admin dashboard.',
    image: '/api/placeholder/400/250',
    technologies: ['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL'],
    liveUrl: '#',
    githubUrl: '#'
  },
  {
    id: 2,
    title: 'Task Management App',
    description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
    image: '/api/placeholder/400/250',
    technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
    liveUrl: '#',
    githubUrl: '#'
  },
  {
    id: 3,
    title: 'Weather Dashboard',
    description: 'A responsive weather dashboard that displays current conditions and forecasts using multiple weather APIs with beautiful data visualizations.',
    image: '/api/placeholder/400/250',
    technologies: ['Vue.js', 'Chart.js', 'Weather API', 'Tailwind'],
    liveUrl: '#',
    githubUrl: '#'
  },
  {
    id: 4,
    title: 'Social Media Analytics',
    description: 'A comprehensive analytics platform for social media managers to track engagement, growth metrics, and audience insights across multiple platforms.',
    image: '/api/placeholder/400/250',
    technologies: ['React', 'D3.js', 'Python', 'FastAPI'],
    liveUrl: '#',
    githubUrl: '#'
  },
  {
    id: 5,
    title: 'Recipe Sharing Platform',
    description: 'A community-driven recipe sharing platform with advanced search, meal planning, and nutritional analysis features.',
    image: '/api/placeholder/400/250',
    technologies: ['Next.js', 'Prisma', 'PostgreSQL', 'AWS S3'],
    liveUrl: '#',
    githubUrl: '#'
  },
  {
    id: 6,
    title: 'Fitness Tracking App',
    description: 'A mobile-first fitness application with workout tracking, progress visualization, and social features for motivation and accountability.',
    image: '/api/placeholder/400/250',
    technologies: ['React Native', 'Firebase', 'Redux', 'Chart.js'],
    liveUrl: '#',
    githubUrl: '#'
  }
];

export default function Projects() {
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const displayedProjects = showAllProjects ? allProjects : allProjects.slice(0, 3);

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
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 text-white">Featured Projects</h2>
              <p className="text-lg sm:text-xl md:text-2xl text-center max-w-2xl mx-auto text-white">
                Here are some of my recent projects that showcase my skills and experience
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
                  <div className="aspect-video bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center border-b border-white/10">
                    <span className="text-4xl font-bold text-accent group-hover:text-white group-hover:scale-110 transition-all duration-300">{project.title.charAt(0)}</span>
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
                  ? (showAllProjects ? 'Hiding...' : 'Loading...') 
                  : (showAllProjects ? 'Show Less Projects' : 'View All Projects')
                }
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}