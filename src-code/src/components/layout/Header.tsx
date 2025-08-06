'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

const Header: React.FC<HeaderProps> = ({
  navigation = defaultNavigation,
  logo,
  siteName = 'Luke Edwards\' Portfolio',
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:bg-black/95 dark:border-gray-800'
          : 'bg-transparent'
      )}
    >
      <div className="relative flex items-center h-20 px-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-xl font-bold text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            {logo ? (
              <Image src={logo} alt={siteName} width={32} height={32} className="h-8 w-auto" />
            ) : (
              <span>{siteName}</span>
            )}
          </Link>

          {/* Desktop Navigation - Absolutely Centered */}
          <nav className="hidden md:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium transition-all duration-300 group',
                  'hover:text-accent active:scale-95 transform',
                  isActiveLink(item.href)
                    ? 'text-accent font-semibold'
                    : 'text-gray-700 dark:text-gray-300'
                )}
              >
                {item.label}
                {/* Green line that expands from center on hover */}
                <span 
                  className={cn(
                    'absolute bottom-0 left-1/2 h-0.5 bg-accent transition-all duration-300 transform -translate-x-1/2',
                    'group-hover:w-full group-active:w-full group-active:bg-accent-hover',
                    isActiveLink(item.href) ? 'w-full' : 'w-0'
                  )}
                />
                {/* Click ripple effect */}
                <span className="absolute inset-0 rounded-lg bg-accent/10 scale-0 group-active:scale-100 transition-transform duration-150" />
              </Link>
            ))}
          </nav>

          {/* CTA Button - Far Right with Same Margin as Logo */}
          <div className="hidden md:flex items-center ml-auto">
            <Button variant="primary" size="sm">
                Let&apos;s work together
              </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-4 pt-4 pb-6 space-y-2 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 shadow-lg">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className={cn(
                      'relative block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 group overflow-hidden',
                      'hover:text-accent active:scale-95 transform',
                      isActiveLink(item.href)
                        ? 'text-accent font-semibold bg-accent/5'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'
                    )}
                  >
                    {item.label}
                    {/* Green line that expands from center on hover */}
                    <span 
                      className={cn(
                        'absolute bottom-0 left-1/2 h-0.5 bg-accent transition-all duration-300 transform -translate-x-1/2',
                        'group-hover:w-full group-active:w-full group-active:bg-accent-hover',
                        isActiveLink(item.href) ? 'w-full' : 'w-0'
                      )}
                    />
                    {/* Click ripple effect */}
                    <span className="absolute inset-0 rounded-lg bg-accent/10 scale-0 group-active:scale-100 transition-transform duration-150" />
                  </Link>
                ))}
                <div className="px-4 py-3 flex items-center justify-center border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
                  <Button variant="primary" size="sm">
                    Get In Touch
                  </Button>
                </div>
              </div>
          </div>
        )}
    </header>
  );
};

export default Header;