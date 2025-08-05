'use client';

import React from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { 
  ReactIcon, 
  CloudIcon, 
  NextIcon, 
  TypeScriptIcon, 
  NodeIcon, 
  PythonIcon, 
  PostgreSQLIcon, 
  DockerIcon 
} from '../ui/icons';

const Technologies: React.FC = () => {
  const technologies = [
    { name: 'React', icon: ReactIcon, category: 'Frontend' },
    { name: 'Next.js', icon: NextIcon, category: 'Framework' },
    { name: 'TypeScript', icon: TypeScriptIcon, category: 'Language' },
    { name: 'Node.js', icon: NodeIcon, category: 'Backend' },
    { name: 'Python', icon: PythonIcon, category: 'Language' },
    { name: 'PostgreSQL', icon: PostgreSQLIcon, category: 'Database' },
    { name: 'Docker', icon: DockerIcon, category: 'DevOps' },
    { name: 'AWS', icon: CloudIcon, category: 'Cloud' },
  ];

  return (
    <section className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="space-y-16">
          <div className="text-center space-y-6">
            <h2 className="heading-2 !text-center mb-4">
              Technologies & Skills
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-large !text-center">
                Here are the technologies and tools I work with regularly:
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8">
            {technologies.map((tech, index) => (
              <ScrollReveal key={tech.name} delay={index * 100} direction="up">
                <div className="group bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6 text-center hover:shadow-lg hover:shadow-[var(--color-accent)]/20 hover:scale-105 hover:border-[var(--color-accent)] transition-all duration-300">
                  <div className="flex justify-center mb-4">
                    <tech.icon className="w-12 h-12 text-[var(--color-accent)] group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="font-semibold text-[var(--color-text)] mb-2">{tech.name}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">{tech.category}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Technologies;