'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';

export default function About() {
  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-2 !text-center mb-12">About Me</h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-large !text-center">
                I&apos;m a passionate full-stack developer with over 5 years of experience 
                creating digital solutions that make a difference. I specialize in 
                modern web technologies and love turning complex problems into 
                simple, beautiful designs.
              </p>
              
              <p className="text-base !text-center">
                When I&apos;m not coding, you can find me exploring new technologies, 
                contributing to open-source projects, or enjoying a good cup of coffee 
                while reading about the latest in tech.
              </p>
              
              <div className="flex flex-wrap gap-3 justify-center">
                {['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS'].map((skill) => (
                  <span 
                    key={skill}
                    className="px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center">
              <Card className="p-8 text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-accent to-secondary rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">YN</span>
                </div>
                <h3 className="heading-3 mb-2">Your Name</h3>
                <p className="text-muted-foreground">Full Stack Developer</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}