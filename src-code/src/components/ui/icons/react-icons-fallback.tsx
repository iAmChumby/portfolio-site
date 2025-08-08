// Temporary fallback icons using inline SVGs with react-icons styling
import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const SiReact = ({ className = '', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <circle cx="12" cy="12" r="2" fill="currentColor"/>
    <path d="M20.2 9c-.7-3.4-3.1-6.2-6.2-7.2.5 1.4.5 3.1-.3 4.4-1.1 1.8-3.1 2.4-4.8 1.8-.9-.3-1.6-1-2-1.8C4.8 7.8 4 10.4 4.8 13c.7 2.6 2.9 4.8 5.7 5.2 2.8.4 5.6-.8 7.2-3.2 1.6-2.4 1.6-5.6.5-8z" fill="none" stroke="currentColor" strokeWidth="1"/>
    <path d="M12 2c3.9 2.4 6.4 6.6 6.4 11.3 0 1.2-.2 2.4-.5 3.5-2.3-1.4-4.9-2.2-7.9-2.2s-5.6.8-7.9 2.2c-.3-1.1-.5-2.3-.5-3.5C1.6 8.6 4.1 4.4 8 2" fill="none" stroke="currentColor" strokeWidth="1"/>
  </svg>
);

export const SiTypescript = ({ className = '', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <rect width="24" height="24" rx="2" fill="currentColor"/>
    <path d="M12.5 8.5h3v1h-1v6h-1v-6h-1v-1zm-3 1.5c0-.3.1-.5.3-.7s.4-.3.7-.3.5.1.7.3.3.4.3.7v4c0 .3-.1.5-.3.7s-.4.3-.7.3-.5-.1-.7-.3-.3-.4-.3-.7v-4z" fill="white"/>
  </svg>
);

export const SiNextdotjs = ({ className = '', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <circle cx="12" cy="12" r="10" fill="currentColor"/>
    <path d="M8 8h8v1H8V8zm0 2h6v1H8v-1zm0 2h4v1H8v-1z" fill="white"/>
  </svg>
);

export const SiNodedotjs = ({ className = '', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <path d="M12 2L2 7v10l10 5 10-5V7l-10-5zM8 17.5l-4-2v-7l4-2 4 2v7l-4 2zm8 0l-4-2v-7l4-2 4 2v7l-4 2z" fill="currentColor"/>
  </svg>
);

export const SiPython = ({ className = '', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <path d="M12 2c-2.2 0-4 1.8-4 4v2h8V6c0-2.2-1.8-4-4-4zm-6 8v6c0 2.2 1.8 4 4 4h4c2.2 0 4-1.8 4-4v-6H6z" fill="currentColor"/>
    <circle cx="9" cy="7" r="1" fill="white"/>
    <circle cx="15" cy="17" r="1" fill="white"/>
  </svg>
);

export const SiPostgresql = ({ className = '', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <path d="M12 2C8.7 2 6 4.7 6 8v8c0 3.3 2.7 6 6 6s6-2.7 6-6V8c0-3.3-2.7-6-6-6zm0 2c2.2 0 4 1.8 4 4v8c0 2.2-1.8 4-4 4s-4-1.8-4-4V8c0-2.2 1.8-4 4-4z" fill="currentColor"/>
    <circle cx="12" cy="8" r="2" fill="white"/>
  </svg>
);

export const SiDocker = ({ className = '', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <rect x="2" y="8" width="3" height="3" fill="currentColor"/>
    <rect x="6" y="8" width="3" height="3" fill="currentColor"/>
    <rect x="10" y="8" width="3" height="3" fill="currentColor"/>
    <rect x="6" y="5" width="3" height="2" fill="currentColor"/>
    <rect x="10" y="5" width="3" height="2" fill="currentColor"/>
    <path d="M14 8h6c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-4c0-1.1.9-2 2-2h10z" fill="none" stroke="currentColor" strokeWidth="1"/>
  </svg>
);

export const SiAmazonaws = ({ className = '', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <path d="M6 14c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v6z" fill="currentColor"/>
    <path d="M4 18h16l-2 2H6l-2-2z" fill="currentColor"/>
    <circle cx="8" cy="10" r="1" fill="white"/>
    <circle cx="16" cy="10" r="1" fill="white"/>
  </svg>
);