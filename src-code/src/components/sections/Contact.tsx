'use client';

import React, { useState } from 'react';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';
import siteConfig from '@/data/site-config.json'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="relative inline-block bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-8">
              <h2 className="heading-2 !text-center mb-4 !text-white">Get In Touch</h2>
              <p className="text-large !text-center max-w-2xl mx-auto !text-white">
                I&apos;m always open to discussing new opportunities and interesting projects
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                <h3 className="heading-3 mb-6 !text-white">Let&apos;s Connect</h3>
                <p className="text-base mb-8 !text-white/80">
                  Whether you have a project in mind, want to collaborate, or just want to say hello, 
                  I&apos;d love to hear from you. Drop me a message and I&apos;ll get back to you as soon as possible.
                </p>
              </div>
              
              <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center border border-accent/30">
                    <EnvelopeIcon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Email</p>
                    <p className="text-white/80">{siteConfig.site.author.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center border border-accent/30">
                    <PhoneIcon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Phone</p>
                    <p className="text-white/80">{siteConfig.site.author.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center border border-accent/30">
                    <MapPinIcon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Location</p>
                    <p className="text-white/80">{siteConfig.site.author.location}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2 text-white">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent/50 text-white placeholder-white/50 transition-all duration-300"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent/50 text-white placeholder-white/50 transition-all duration-300"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2 text-white">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent/50 text-white placeholder-white/50 resize-none transition-all duration-300"
                    placeholder="Tell me about your project..."
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="w-full px-6 py-3 bg-accent/20 text-accent border border-accent/30 rounded-lg font-medium hover:bg-accent hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}