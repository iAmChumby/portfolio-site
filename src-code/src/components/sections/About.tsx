'use client';

import React from 'react';
import { Button } from '@/components/ui';
import siteConfig from '@/data/site-config.json';

const About: React.FC = () => {
  return (
    <section className="py-20 bg-[var(--color-background)]">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-green-600 dark:text-white mb-8">
          About Me
        </h2>
        <p className="text-lg text-green-600 dark:text-gray-300 mb-8">
          {siteConfig.site.author.bio}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-green-600 dark:text-white mb-2">
              Location
            </h3>
            <p className="text-green-600 dark:text-gray-400">
              {siteConfig.site.author.location}
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-green-600 dark:text-white mb-2">
              Email
            </h3>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-green-600 dark:text-white mb-2">
              Specialization
            </h3>
            <p className="text-green-600 dark:text-gray-400">
              {siteConfig.contact.availability}
            </p>
          </div>
        </div>
        <Button variant="outline">
          Learn More About Me
        </Button>
      </div>
    </section>
  );
};

export default About;