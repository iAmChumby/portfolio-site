'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CheckCircleIcon, ExclamationCircleIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { getContactContent, getSiteConfig } from '@/lib/content-loader';
import { reverseGeocode } from '@/lib/geolocation';

interface ContactFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
  autoFocus?: boolean;
}

declare global {
  interface Window {
    turnstile?: {
      reset: (widgetId?: string) => void;
      render: (selector: HTMLElement, options: { 
        sitekey: string; 
        callback: (token: string) => void; 
        theme: string;
        'expire-callback'?: () => void;
      }) => string;
      getResponse: (widgetId?: string) => string | undefined;
      remove: (widgetId: string) => void;
    };
  }
}

export default function ContactForm({ onSuccess, onCancel, className = '', autoFocus = false }: ContactFormProps) {
  const contactContent = getContactContent();
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
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Focus name input if autoFocus is true
  useEffect(() => {
    if (autoFocus && nameInputRef.current) {
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 300); // Small delay for animation to complete
    }
  }, [autoFocus]);

  /**
   * Get browser geolocation and reverse geocode to human-readable format
   */
  const getBrowserGeolocation = async (): Promise<void> => {
    if (geolocationRequestedRef.current || !navigator.geolocation) {
      return;
    }

    geolocationRequestedRef.current = true;

    try {
      let permissionGranted = false;
      
      if ('permissions' in navigator) {
        try {
          const permissionStatus = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
          permissionGranted = permissionStatus.state === 'granted';
        } catch (permError) {
          return;
        }
      } else {
        return;
      }

      if (!permissionGranted) {
        return;
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            timeout: 5000,
            maximumAge: 300000,
            enableHighAccuracy: false,
          }
        );
      });

      const location = await reverseGeocode(
        position.coords.latitude,
        position.coords.longitude
      );

      if (location) {
        setGeolocation(location);
      }
    } catch (error) {
      // Silently fail
    }
  };

  // Turnstile setup
  useEffect(() => {
    if (!turnstileRef.current) return;
    
    // Check if widget already exists
    if (turnstileRef.current.querySelector('[id^="cf-chl-widget"]')) return;
    
    // Cleanup function for previous instances
    let widgetId: string | null = null;
    let isCancelled = false;
    
    const initTurnstile = () => {
        if (isCancelled) return;
        
        // Double-check existence inside initialization
        if (turnstileRef.current && window.turnstile && !turnstileRef.current.querySelector('[id^="cf-chl-widget"]')) {
          let siteKey = process.env.NEXT_PUBLIC_TURNSTILE_KEY;
          
          // Debug logs
          console.log('[ContactForm] Raw siteKey type:', typeof siteKey);
          console.log('[ContactForm] Raw siteKey:', siteKey);

          // Handle potential objects or nulls defensively
          if (typeof siteKey !== 'string') {
              console.warn('[ContactForm] siteKey is not a string. Attempting stringify or fallback.');
              if (siteKey) siteKey = String(siteKey);
          }

          // Strip quotes if accidentally included in value
          if (typeof siteKey === 'string') {
             siteKey = siteKey.replace(/^["']|["']$/g, '');
          }

          if (!siteKey || typeof siteKey !== 'string' || siteKey.trim() === '') {
            console.error('[ContactForm] NEXT_PUBLIC_TURNSTILE_KEY is missing or invalid after processing');
            setFormStatus('error');
            setStatusMessage('Configuration error: CAPTCHA key missing.');
            return;
          }
          
          try {
            widgetId = window.turnstile.render(turnstileRef.current, {
              sitekey: siteKey.trim(),
              callback: (token: string) => {
                turnstileTokenRef.current = token;
              },
              'expire-callback': () => {
                turnstileTokenRef.current = '';
              },
              theme: 'light'
            });
            turnstileWidgetIdRef.current = widgetId;
          } catch (error) {
            console.error('[ContactForm] Turnstile render error:', error);
          }
        }
    };

    const existingScript = document.querySelector('script[src*="turnstile"]');
    
    if (existingScript && window.turnstile) {
      initTurnstile();
    } else if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      script.onload = initTurnstile;
      document.head.appendChild(script);
    }
    
    return () => {
        isCancelled = true;
        if (window.turnstile && widgetId) {
            try {
                window.turnstile.remove(widgetId);
            } catch (e) {
                // Ignore removal errors
            }
        }
    };
  }, []);

  // Geolocation trigger
  useEffect(() => {
    const handleFocus = () => getBrowserGeolocation();
    
    // Try on mount if already granted
    getBrowserGeolocation();
    
    // Or on interaction
    const currentRef = nameInputRef.current;
    if (currentRef) {
        currentRef.addEventListener('focus', handleFocus, { once: true });
    }

    return () => {
        if (currentRef) {
            currentRef.removeEventListener('focus', handleFocus);
        }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      console.log('[ContactForm] Server response:', data);

      if (!response.ok) {
        setFormStatus('error');
        // Include details in status message if available (dev mode)
        const errorMessage = data.details 
          ? `${data.error}: ${data.details}`
          : (data.error || 'Failed to send message. Please try again.');
          
        setStatusMessage(errorMessage);
        console.error('[ContactForm] API Error:', data);

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
        if (onSuccess) {
            onSuccess();
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
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1.5 text-neu-text-primary">
            {contactContent.form.fields.name.label}
          </label>
          <input
            ref={nameInputRef}
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
          <label htmlFor="email" className="block text-sm font-medium mb-1.5 text-neu-text-primary">
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
        
        {/* Compact message field for Hero usage */}
        <div className="flex-1 min-h-0">
          <label htmlFor="message" className="block text-sm font-medium mb-1.5 text-neu-text-primary">
            {contactContent.form.fields.message.label}
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={3}
            disabled={formStatus === 'loading'}
            className="neu-input neu-textarea w-full resize-none"
            placeholder={contactContent.form.fields.message.placeholder}
          />
        </div>
        
        {statusMessage && (
          <div className={`neu-surface-inset flex items-center gap-2 p-3 rounded-lg text-sm ${
            formStatus === 'success'
              ? 'text-neu-accent-light'
              : 'text-red-400'
          }`}>
            {formStatus === 'success' ? (
              <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
            ) : (
              <ExclamationCircleIcon className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{statusMessage}</span>
          </div>
        )}

        <div className="flex flex-col gap-3 pt-1">
            {/* Turnstile CAPTCHA Widget */}
            <div className="flex justify-center h-[65px] min-h-[65px]">
                <div
                ref={turnstileRef}
                className="cf-turnstile"
                key="turnstile-widget"
                />
            </div>

            <div className="flex gap-3">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={formStatus === 'loading'}
                        className="neu-btn neu-btn-outline flex-1 py-2 text-sm sm:text-base"
                    >
                        Cancel
                    </button>
                )}
                <button 
                    type="submit" 
                    disabled={formStatus === 'loading'}
                    className={`neu-btn flex-[2] flex items-center justify-center gap-2 py-2 text-sm sm:text-base ${
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
                    <>
                        <span>{contactContent.form.submitButton}</span>
                        <PaperAirplaneIcon className="w-4 h-4" />
                    </>
                    )}
                </button>
            </div>
        </div>
      </form>
    </div>
  );
}
