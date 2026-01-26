'use client';

import React from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { 
  FaReact, 
  FaJava, 
  FaNodeJs, 
  FaPython, 
  FaDocker 
} from 'react-icons/fa';
import { 
  SiNextdotjs, 
  SiJavascript, 
  SiPostgresql,
  SiElectron,
  SiC,
  SiSpring,
  SiAngular
} from 'react-icons/si';

const Technologies: React.FC = () => {
  const technologies = [
    { name: 'React', icon: FaReact, category: 'Frontend' },
    { name: 'Next.js', icon: SiNextdotjs, category: 'Framework' },
    { name: 'JavaScript', icon: SiJavascript, category: 'Language' },
    { name: 'Node.js', icon: FaNodeJs, category: 'Backend' },
    { name: 'Python', icon: FaPython, category: 'Language' },
    { name: 'PostgreSQL', icon: SiPostgresql, category: 'Database' },
    { name: 'Docker', icon: FaDocker, category: 'DevOps' },
    { name: 'Java', icon: FaJava, category: 'Language' },
    { name: 'Electron', icon: SiElectron, category: 'Framework' },
    { name: 'C', icon: SiC, category: 'Language' },
    { name: 'Spring Boot', icon: SiSpring, category: 'Framework' },
    { name: 'Angular', icon: SiAngular, category: 'Frontend' },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="relative inline-block">
              <div className="neu-surface p-8 mb-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 neu-text-gradient">Technologies & Skills</h2>
                <p className="text-lg sm:text-xl md:text-2xl text-center max-w-2xl mx-auto text-neu-text-secondary">
                  Here are the technologies and tools I work with regularly
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {technologies.map((tech, index) => (
              <ScrollReveal key={tech.name} delay={index * 100} direction="up">
                <div className="group neu-surface p-6 text-center hover:scale-105 transition-transform duration-300">
                  <div className="flex justify-center mb-4">
                    <tech.icon className="w-12 h-12 text-neu-accent group-hover:scale-110 group-hover:text-neu-accent-light transition-all duration-300" />
                  </div>
                  <h3 className="font-semibold text-neu-text-primary mb-2">{tech.name}</h3>
                  <p className="text-sm text-neu-text-muted">{tech.category}</p>
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