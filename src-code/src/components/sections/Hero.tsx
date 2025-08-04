'use client';

import React from 'react';
import { Button } from '@/components/ui';
import siteConfig from '@/data/site-config.json';

const Hero: React.FC = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-[var(--color-background)] pt-20">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-green-600 mb-6">
          Hi, I&apos;m {siteConfig.site.author.name}
        </h1>
        <h2 className="text-2xl md:text-3xl text-green-600 mb-8">
          {siteConfig.site.title}
        </h2>
        <div className="w-full flex justify-center mb-12">
          <p className="text-lg md:text-xl text-green-600 max-w-3xl text-center">
            {siteConfig.site.author.bio}
          </p>
        </div>
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
  );
};

export default Hero;