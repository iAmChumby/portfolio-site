'use client';

import React, { useState, useEffect, useRef } from 'react';
import { EnvelopeIcon, PhoneIcon, MapPinIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { getContactContent, getSiteConfig } from '@/lib/content-loader';
import { reverseGeocode } from '@/lib/geolocation';
import ProximityCard from '@/components/ui/ProximityCard';

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
            </ProximityCard>
          </div>
          

        </div>
      </div>
    </section>
  );
}
