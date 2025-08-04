'use client';

import React from 'react';
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
    <section className="py-20 bg-[var(--color-background)]">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-green-600 mb-4 text-center">
          Technologies & Skills
        </h2>
        <p className="text-lg text-green-600 mb-12 text-center max-w-3xl mx-auto">
          Here are the technologies and tools I work with regularly
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center">
          {technologies.map((tech, index) => {
            const IconComponent = tech.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors w-full max-w-[180px] min-h-[140px] border border-gray-600"
              >
                <div className="text-4xl mb-3">
                  <IconComponent />
                </div>
                <h3 className="text-base font-semibold text-green-600 mb-2 text-center">
                  {tech.name}
                </h3>
                <p className="text-sm text-green-600 text-center">
                  {tech.category}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Technologies;