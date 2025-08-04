'use client';

import React from 'react';
import siteConfig from '@/data/site-config.json';

const Contact: React.FC = () => {
  return (
    <section className="py-20 bg-[var(--color-background)]">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-green-600 mb-4">
          Get In Touch
        </h2>
        <p className="text-xl text-green-600 mb-8 max-w-2xl mx-auto">
          I&apos;m always interested in new opportunities and collaborations. 
          Feel free to reach out if you&apos;d like to work together!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
          <a
            href={`mailto:${siteConfig.site.author.email}`}
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Email Me
          </a>
          <a
            href={siteConfig.site.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 border-2 border-green-600 text-green-600 font-medium rounded-lg hover:bg-green-600 hover:text-white transition-colors"
          >
            LinkedIn
          </a>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center text-green-600">
          <div className="flex items-center justify-center gap-2">
            <span>📧</span>
            <span>{siteConfig.site.author.email}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span>📍</span>
            <span>{siteConfig.site.author.location}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;