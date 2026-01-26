'use client';

import React, { useState, useEffect, useRef } from 'react';
import { EnvelopeIcon, PhoneIcon, MapPinIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { getContactContent, getSiteConfig } from '@/lib/content-loader';
import { reverseGeocode } from '@/lib/geolocation';

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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [geolocation, setGeolocation] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileTokenRef = useRef<string>('');
  const turnstileWidgetIdRef = useRef<string | null>(null);
  const geolocationRequestedRef = useRef<boolean>(false);

  /**
   * Get browser geolocation and reverse geocode to human-readable format
   * Only attempts if permission is already granted (doesn't prompt user)
   */
  const getBrowserGeolocation = async (): Promise<void> => {
    // Skip if already requested or geolocation not available
    if (geolocationRequestedRef.current || !navigator.geolocation) {
      return;
    }

    geolocationRequestedRef.current = true;

    try {
      // Check if geolocation permission is already granted
      // Only proceed if permission is granted, don't prompt
      let permissionGranted = false;
      
      if ('permissions' in navigator) {
        try {
          const permissionStatus = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
          permissionGranted = permissionStatus.state === 'granted';
        } catch (permError) {
          // Permissions API not supported or failed
          // If Permissions API isn't available, we can't safely check, so skip to avoid prompts
          return;
        }
      } else {
        // Permissions API not available - skip to avoid any potential prompts
        return;
      }

      // Only proceed if permission is already granted
      if (!permissionGranted) {
        // Permission not granted, skip silently - will use IP-based geolocation
        return;
      }

      // Permission is granted, safe to request position
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            timeout: 5000, // Reasonable timeout
            maximumAge: 300000, // Accept cached position up to 5 minutes old
            enableHighAccuracy: false, // Use less accurate but faster method
          }
        );
      });

      // Reverse geocode coordinates to human-readable format
      const location = await reverseGeocode(
        position.coords.latitude,
        position.coords.longitude
      );

      if (location) {
        setGeolocation(location);
      }
    } catch (error) {
      // Silently fail - will fallback to IP-based geolocation on server
      // This includes permission denied, timeout, or other errors
    }
  };

  useEffect(() => {
    if (!turnstileRef.current) return;
    
    // Check if widget already exists in DOM
    if (turnstileRef.current.querySelector('[id^="cf-chl-widget"]')) return;
    
    // Check if script already exists
    const existingScript = document.querySelector('script[src*="turnstile"]');
    
    if (existingScript && window.turnstile) {
      // Script loaded, render widget
      const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_KEY;
      if (siteKey && typeof siteKey === 'string') {
        try {
          const widgetId = window.turnstile.render(turnstileRef.current, {
            sitekey: siteKey,
            callback: (token: string) => {
              turnstileTokenRef.current = token;
            },
            theme: 'light'
          });
          turnstileWidgetIdRef.current = widgetId;
        } catch (error) {
          console.error('Turnstile render error:', error);
        }
      }
      return;
    }

    // Only add script if it doesn't exist
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (turnstileRef.current && window.turnstile && !turnstileRef.current.querySelector('[id^="cf-chl-widget"]')) {
          const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_KEY;
          if (!siteKey || typeof siteKey !== 'string') {
            console.error('NEXT_PUBLIC_TURNSTILE_KEY is missing or invalid');
            return;
          }
          try {
            const widgetId = window.turnstile.render(turnstileRef.current, {
              sitekey: siteKey,
              callback: (token: string) => {
                turnstileTokenRef.current = token;
              },
              theme: 'light'
            });
            turnstileWidgetIdRef.current = widgetId;
          } catch (error) {
            console.error('Turnstile render error:', error);
          }
        }
      };
      document.head.appendChild(script);
    }
  }, []);

  // Silently check for geolocation when form is focused or component mounts
  // Only uses location if permission already granted (no prompt)
  useEffect(() => {
    const formElement = document.querySelector('form');
    if (!formElement) return;

    const handleFormFocus = () => {
      getBrowserGeolocation();
    };

    // Check geolocation on form focus (only if permission already granted)
    formElement.addEventListener('focusin', handleFormFocus, { once: true });
    
    // Also try on mount (only if permission already granted)
    getBrowserGeolocation();

    return () => {
      formElement.removeEventListener('focusin', handleFormFocus);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get token BEFORE changing state
    let token = '';
    if (window.turnstile && turnstileWidgetIdRef.current) {
      token = window.turnstile.getResponse(turnstileWidgetIdRef.current) || '';
    }
    if (!token) {
      token = turnstileTokenRef.current;
    }
    
    if (!token) {
      setFormStatus('error');
      setStatusMessage('Please complete the CAPTCHA verification.');
      setTimeout(() => {
        setFormStatus('idle');
        setStatusMessage('');
      }, 3000);
      return;
    }
    
    setFormStatus('loading');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          turnstileToken: token,
          geolocation: geolocation || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setFormStatus('error');
        setStatusMessage(data.error || 'Failed to send message. Please try again.');

        // Reset Turnstile
        if (window.turnstile && turnstileWidgetIdRef.current) {
          window.turnstile.reset(turnstileWidgetIdRef.current);
          turnstileTokenRef.current = '';
        }

        setTimeout(() => {
          setFormStatus('idle');
          setStatusMessage('');
        }, 5000);
        return;
      }

      setFormStatus('success');
      setStatusMessage(data.message || 'Thank you! Your message has been sent successfully.');

      setTimeout(() => {
        setFormData({ name: '', email: '', message: '' });
        setFormStatus('idle');
        setStatusMessage('');
        if (window.turnstile && turnstileWidgetIdRef.current) {
          window.turnstile.reset(turnstileWidgetIdRef.current);
          turnstileTokenRef.current = '';
        }
      }, 3000);
    } catch (error) {
      console.error('Form submission error:', error);
      setFormStatus('error');
      setStatusMessage('An error occurred. Please try again.');

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
          {/* Header */}
          <div className="text-center mb-16">
            <div className="relative inline-block neu-surface p-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4">
                <span className="neu-text-gradient">{contactContent.title}</span>
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl text-center max-w-2xl mx-auto text-neu-text-secondary">
                {contactContent.subtitle}
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left Column - Info Cards */}
            <div className="space-y-8">
              {/* Intro Card */}
              <div className="neu-surface p-6">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-neu-text-primary">{contactContent.intro.title}</h3>
                <p className="text-base mb-6 text-neu-text-secondary">
                  {contactContent.intro.description}
                </p>
                <div className="neu-badge">
                  <div className="w-2 h-2 bg-neu-accent-light rounded-full animate-pulse mr-2"></div>
                  <span className="text-sm text-neu-accent-light font-medium">{siteConfig.contact.availability}</span>
                </div>
              </div>
              
              {/* Contact Details Card */}
              <div className="neu-surface p-6 space-y-6">
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
              </div>
            </div>
            
            {/* Right Column - Form */}
            <div className="neu-surface p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2 text-neu-text-primary">
                    {contactContent.form.fields.name.label}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={formStatus === 'loading'}
                    className="neu-input w-full"
                    placeholder={contactContent.form.fields.name.placeholder}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-neu-text-primary">
                    {contactContent.form.fields.email.label}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={formStatus === 'loading'}
                    className="neu-input w-full"
                    placeholder={contactContent.form.fields.email.placeholder}
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2 text-neu-text-primary">
                    {contactContent.form.fields.message.label}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    disabled={formStatus === 'loading'}
                    className="neu-input neu-textarea w-full"
                    placeholder={contactContent.form.fields.message.placeholder}
                  />
                </div>
                
                {statusMessage && (
                  <div className={`neu-surface-inset flex items-center gap-2 p-4 rounded-lg ${
                    formStatus === 'success'
                      ? 'text-neu-accent-light'
                      : 'text-red-400'
                  }`}>
                    {formStatus === 'success' ? (
                      <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
                    ) : (
                      <ExclamationCircleIcon className="w-5 h-5 flex-shrink-0" />
                    )}
                    <span className="text-sm">{statusMessage}</span>
                  </div>
                )}

                {/* Turnstile CAPTCHA Widget */}
                <div className="flex justify-center">
                  <div
                    ref={turnstileRef}
                    className="cf-turnstile"
                    key="turnstile-widget"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={formStatus === 'loading'}
                  className={`neu-btn w-full flex items-center justify-center gap-2 ${
                    formStatus === 'loading' 
                      ? 'neu-surface-inset cursor-not-allowed opacity-80' 
                      : 'neu-btn-accent'
                  }`}
                >
                  {formStatus === 'loading' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-neu-accent-light border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    contactContent.form.submitButton
                  )}
                </button>
              </form>
            </div>
          </div>
          
          {/* Connect Online Section - Full Width */}
          <div className="mt-12 neu-surface p-6">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-neu-text-primary">Connect Online</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a
                href={siteConfig.site.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="neu-btn neu-btn-raised flex items-center justify-center gap-3 px-6 py-4"
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
                className="neu-btn neu-btn-raised flex items-center justify-center gap-3 px-6 py-4"
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
                className="neu-btn neu-btn-raised flex items-center justify-center gap-3 px-6 py-4"
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
