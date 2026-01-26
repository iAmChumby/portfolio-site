'use client';

import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { getContactContent, getSiteConfig } from '@/lib/content-loader';
import ProximityCard from '@/components/ui/ProximityCard';
import ContactForm from '@/components/ui/ContactForm';

declare global {
  interface Window {
    turnstile?: {
      reset: (widgetId?: string) => void;
      render: (selector: HTMLElement, options: { sitekey: string; callback: (token: string) => void; theme: string }) => string;
      getResponse: (widgetId?: string) => string | undefined;
    };
  }
}

export default function Contact() {
  const contactContent = getContactContent();
  const siteConfig = getSiteConfig();

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <ProximityCard className="relative inline-block neu-surface p-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4">
                <span className="neu-text-gradient">{contactContent.title}</span>
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl text-center max-w-2xl mx-auto text-neu-text-secondary">
                {contactContent.subtitle}
              </p>
            </ProximityCard>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left Column - Info Cards */}
            <div className="space-y-8">
              {/* Intro Card */}
              <ProximityCard className="neu-surface p-6">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-neu-text-primary">{contactContent.intro.title}</h3>
                <p className="text-base mb-6 text-neu-text-secondary">
                  {contactContent.intro.description}
                </p>
                <div className="neu-badge">
                  <div className="w-2 h-2 bg-neu-accent-light rounded-full animate-pulse mr-2"></div>
                  <span className="text-sm text-neu-accent-light font-medium">{siteConfig.contact.availability}</span>
                </div>
              </ProximityCard>
              
              {/* Contact Details Card */}
              <ProximityCard className="neu-surface p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="neu-surface-inset w-12 h-12 rounded-lg flex items-center justify-center">
                    <EnvelopeIcon className="w-6 h-6 text-neu-accent-light" />
                  </div>
                  <div>
                    <p className="font-medium text-neu-text-primary">Email</p>
                    <a 
                      href={`mailto:${siteConfig.site.author.email}`}
                      className="text-neu-text-secondary hover:text-neu-accent-light transition-colors duration-200"
                    >
                      {siteConfig.site.author.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="neu-surface-inset w-12 h-12 rounded-lg flex items-center justify-center">
                    <PhoneIcon className="w-6 h-6 text-neu-accent-light" />
                  </div>
                  <div>
                    <p className="font-medium text-neu-text-primary">Phone</p>
                    <a 
                      href={`tel:${siteConfig.site.author.phone}`}
                      className="text-neu-text-secondary hover:text-neu-accent-light transition-colors duration-200"
                    >
                      {siteConfig.site.author.phone}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="neu-surface-inset w-12 h-12 rounded-lg flex items-center justify-center">
                    <MapPinIcon className="w-6 h-6 text-neu-accent-light" />
                  </div>
                  <div>
                    <p className="font-medium text-neu-text-primary">Location</p>
                    <p className="text-neu-text-secondary">{siteConfig.site.author.location}</p>
                  </div>
                </div>
              </ProximityCard>
            </div>
            
            {/* Right Column - Form */}
            <ProximityCard className="neu-surface p-8">
              <ContactForm />
            </ProximityCard>
          </div>
          

        </div>
      </div>
    </section>
  );
}
