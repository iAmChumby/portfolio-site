'use client';

import React from 'react';
import { Button } from '@/components/ui';
import siteConfig from '@/data/site-config.json';

const About: React.FC = () => {
  return (
    <section className="py-20 bg-[var(--color-background)]">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-green-600 mb-8 text-center">
          About Me
        </h2>
        <p className="text-lg text-green-600 mb-8 max-w-4xl mx-auto text-center">
          {siteConfig.site.author.bio}
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-green-600 mb-2">
              Experience
            </h3>
            <p className="text-green-600">
              5+ years of development
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-green-600 mb-2">
              Focus Areas
            </h3>
            <p className="text-green-600">
              Full-stack web development
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-green-600 mb-2">
              Location
            </h3>
            <p className="text-green-600">
              {siteConfig.site.author.location}
            </p>
          </div>
        </div>
        <div className="text-center mt-8">
          <Button variant="outline">
            Learn More About Me
          </Button>
        </div>
      </div>
    </section>
  );
};

export default About;