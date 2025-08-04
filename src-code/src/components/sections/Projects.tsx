'use client';

import React from 'react';
import { Button, Card, CardHeader, CardBody } from '@/components/ui';
import projectsData from '@/data/projects.json';

const Projects: React.FC = () => {
  const featuredProjects = projectsData.projects.filter(project => project.featured);

  return (
    <section className="py-20 bg-[var(--color-background)]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-green-600 dark:text-white mb-4">
            Featured Projects
          </h2>
          <p className="text-lg text-green-600 dark:text-gray-400">
            Here are some of my recent works that I&apos;m proud of
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredProjects.map((project) => (
            <Card key={project.id} variant="elevated" interactive>
              <CardHeader>
                <h3 className="text-xl font-semibold text-green-600 dark:text-white mb-2">
                  {project.title}
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-green-600 dark:text-gray-400 mb-4">
                  {project.description}
                </p>
                <div className="flex gap-2">
                  {project.githubUrl && (
                    <Button variant="outline" size="sm">
                      GitHub
                    </Button>
                  )}
                  {project.liveUrl && (
                    <Button variant="primary" size="sm">
                      Live Demo
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
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