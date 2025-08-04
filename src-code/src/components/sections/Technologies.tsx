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

  const categories = ['Frontend', 'Framework', 'Language', 'Backend', 'Database', 'DevOps', 'Cloud'];

  return (
    <section className="py-20 bg-[var(--color-background)]">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-green-600 dark:text-white mb-4">
          Technologies & Skills
        </h2>
        <p className="text-lg text-green-600 dark:text-gray-300 mb-12">
          Tools and technologies I work with
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
          {technologies.map((tech) => {
            const IconComponent = tech.icon;
            return (
              <div
                key={tech.name}
                className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full max-w-[180px] min-h-[140px]"
              >
                <div className="text-primary mb-3">
                  <IconComponent size={40} />
                </div>
                <h3 className="text-base font-semibold text-green-600 dark:text-white mb-2 text-center">
                  {tech.name}
                </h3>
                <p className="text-sm text-green-600 dark:text-gray-400 text-center">
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