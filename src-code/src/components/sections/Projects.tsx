'use client';

import React from 'react';
import { Button } from '@/components/ui';
import projectsData from '@/data/projects.json';

const Projects: React.FC = () => {
  const featuredProjects = projectsData.projects.filter(project => project.featured);

  return (
    <section className="py-20 bg-[var(--color-background)]">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-green-600 mb-4 text-center">
          Featured Projects
        </h2>
        <p className="text-lg text-green-600 text-center mb-12 max-w-3xl mx-auto">
          Here are some of my recent projects that showcase my skills and experience
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project, index) => (
            <div key={index} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-700">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-green-600 mb-2">
                  {project.title}
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <p className="text-green-600 mb-4">
                  {project.description}
                </p>
                <div className="flex gap-4">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Button variant="primary" size="lg">
            View All Projects
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Projects;