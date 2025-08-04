import React from 'react';
import { Button } from '@/components/ui';
import { Card, CardHeader, CardBody } from '@/components/ui';
import siteConfig from '@/data/site-config.json';
import projectsData from '@/data/projects.json';

export default function Home() {
  const featuredProjects = projectsData.projects.filter(project => project.featured);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
            {siteConfig.site.author.name}
          </h1>
          <h2 className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 mb-8">
            {siteConfig.site.title}
          </h2>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
            {siteConfig.site.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg">
              View My Work
            </Button>
            <Button variant="outline" size="lg">
              Get In Touch
            </Button>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
              About Me
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              {siteConfig.site.author.bio}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Location
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {siteConfig.site.author.location}
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Email
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {siteConfig.site.author.email}
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Status
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {siteConfig.contact.availability}
                </p>
              </div>
            </div>
            <Button variant="outline">
              Learn More About Me
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Projects
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
            Here are some of my recent works that I&apos;m proud of
          </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProjects.map((project) => (
              <Card key={project.id} variant="elevated" interactive>
                <CardHeader>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
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
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
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

      {/* Contact CTA Section */}
      <section className="py-20 bg-blue-600 dark:bg-blue-800">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Let&apos;s Work Together
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            I&apos;m always interested in new opportunities and exciting projects. 
            Let&apos;s discuss how we can bring your ideas to life.
          </p>
          <Button variant="secondary" size="lg">
            Start a Conversation
          </Button>
        </div>
      </section>
    </div>
  );
}
