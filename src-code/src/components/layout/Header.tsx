'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
}

interface HeaderProps {
  navigation?: NavigationItem[];
  logo?: string;
  siteName?: string;
}

const defaultNavigation: NavigationItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'GitHub', href: '/github' },
  { label: 'Contact', href: '/contact' },
];

export default function Header({ navigation, siteName }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = navigation || defaultNavigation;

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 w-full bg-background/90 backdrop-blur-sm border-b border-border"
      style={{
        display: 'block',
        visibility: 'visible',
        opacity: 1,
        minHeight: '80px',
      }}
    >
      <div className="container mx-auto flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-xl font-bold text-emerald-500 hover:text-accent transition-colors"
          >
            <span>{siteName || 'Portfolio'}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                className={cn(
                  'navbar-link relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg border-2 border-transparent',
                  'hover:border-accent hover:text-accent',
                  pathname === item.href
                    ? 'border-accent text-accent bg-accent/10'
                    : 'text-white hover:text-accent'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-6">
            <Button variant="primary" size="sm">
              Get In Touch
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mobile-menu-btn md:hidden p-2 rounded-md text-white hover:text-accent hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-4 pt-4 pb-6 space-y-2 bg-background/95 border-t border-border shadow-lg">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className={cn(
                      'navbar-link block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 border-2 border-transparent',
                      'hover:border-accent hover:text-accent',
                      pathname === item.href
                        ? 'border-accent text-accent bg-accent/10'
                        : 'text-white hover:text-accent hover:bg-muted'
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="px-4 py-3 flex items-center justify-center border-t border-border mt-4 pt-4">
                  <Button variant="primary" size="sm">
                    Get In Touch
                  </Button>
                </div>
              </div>
          </div>
        )}
    </header>
  );
}