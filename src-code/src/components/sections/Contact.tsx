'use client';

import React from 'react';
import { EmailIcon, BriefcaseIcon } from '../ui/icons';
import { Button } from '@/components/ui';
import siteConfig from '@/data/site-config.json';

const Contact: React.FC = () => {
  return (
    <section className="py-20 bg-[var(--color-background)]">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-green-600 dark:text-white mb-4">
          Let&apos;s Work Together
        </h2>
        <p className="text-xl text-green-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          I&apos;m always interested in new opportunities and exciting projects. 
          Let&apos;s discuss how we can bring your ideas to life.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button variant="secondary" size="lg">
            Start a Conversation
          </Button>
          <Button variant="outline" size="lg">
            Download Resume
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row gap-6 justify-center text-green-600 dark:text-gray-400">
          <div className="flex items-center justify-center gap-2">
            <EmailIcon className="text-primary" size={20} />
            <span>{siteConfig.contact.email}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span>📍</span>
            <span>{siteConfig.contact.location}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <BriefcaseIcon className="text-primary" size={20} />
            <span>{siteConfig.contact.availability}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;