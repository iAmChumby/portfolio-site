'use client';

import React, { useState } from 'react';
import { EnvelopeIcon, PhoneIcon, MapPinIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import siteConfig from '@/data/site-config.json'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Handle form submission
      console.log('Form submitted:', formData);
      
      setFormStatus('success');
      setStatusMessage('Thank you! Your message has been sent successfully.');
      
      // Reset form after success
      setTimeout(() => {
        setFormData({ name: '', email: '', message: '' });
        setFormStatus('idle');
        setStatusMessage('');
      }, 3000);
      
    } catch {
      setFormStatus('error');
      setStatusMessage('Sorry, there was an error sending your message. Please try again.');
      
      setTimeout(() => {
        setFormStatus('idle');
        setStatusMessage('');
      }, 5000);
    }
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
            <div className="relative inline-block bg-black/30 backdrop-blur-md border border-white/20 rounded-lg p-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 text-white">Get In Touch</h2>
              <p className="text-lg sm:text-xl md:text-2xl text-center max-w-2xl mx-auto text-white">
                I&apos;m always open to discussing new opportunities and interesting projects
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-lg p-6">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-white">Let&apos;s Connect</h3>
                <p className="text-base mb-6 !text-white/80">
                  Whether you have a project in mind, want to collaborate, or just want to say hello, 
                  I&apos;d love to hear from you. Drop me a message and I&apos;ll get back to you as soon as possible.
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-400 font-medium">{siteConfig.contact.availability}</span>
                </div>
              </div>
              
              <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-lg p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center border border-accent/30">
                    <EnvelopeIcon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Email</p>
                    <a 
                      href={`mailto:${siteConfig.site.author.email}`}
                      className="text-white/80 hover:text-accent transition-colors duration-200"
                    >
                      {siteConfig.site.author.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center border border-accent/30">
                    <PhoneIcon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Phone</p>
                    <a 
                      href={`tel:${siteConfig.site.author.phone}`}
                      className="text-white/80 hover:text-accent transition-colors duration-200"
                    >
                      {siteConfig.site.author.phone}
                    </a>
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
            
            <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-lg p-8">
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
                    disabled={formStatus === 'loading'}
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent/50 text-white placeholder-white/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    disabled={formStatus === 'loading'}
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent/50 text-white placeholder-white/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    disabled={formStatus === 'loading'}
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent/50 text-white placeholder-white/50 resize-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Tell me about your project..."
                  />
                </div>
                
                {statusMessage && (
                  <div className={`flex items-center gap-2 p-3 rounded-lg ${
                    formStatus === 'success' 
                      ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
                      : 'bg-red-500/20 border border-red-500/30 text-red-400'
                  }`}>
                    {formStatus === 'success' ? (
                      <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
                    ) : (
                      <ExclamationCircleIcon className="w-5 h-5 flex-shrink-0" />
                    )}
                    <span className="text-sm">{statusMessage}</span>
                  </div>
                )}
                
                <button 
                  type="submit" 
                  disabled={formStatus === 'loading'}
                  className="w-full px-6 py-3 bg-accent/20 text-accent border border-accent/30 rounded-lg font-medium hover:bg-accent hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {formStatus === 'loading' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>
          </div>
          
          {/* Connect Online Section - Full Width */}
          <div className="mt-12 bg-black/30 backdrop-blur-md border border-white/20 rounded-lg p-6">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-white">Connect Online</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a
                href={siteConfig.site.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 px-6 py-4 bg-accent/20 rounded-lg border border-accent/30 text-accent hover:bg-accent hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="font-medium">GitHub</span>
              </a>
              
              <a
                href={siteConfig.site.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 px-6 py-4 bg-accent/20 rounded-lg border border-accent/30 text-accent hover:bg-accent hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span className="font-medium">LinkedIn</span>
              </a>
              
              <a
                href={siteConfig.site.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 px-6 py-4 bg-accent/20 rounded-lg border border-accent/30 text-accent hover:bg-accent hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                <span className="font-medium">Twitter</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}