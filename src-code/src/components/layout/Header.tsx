'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button, ThemeToggle } from '@/components/ui';

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
  siteName = 'Portfolio',
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
      <div className="container flex items-center justify-between h-32 px-32 max-w-none">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-xl font-bold text-green-600 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            {logo && (
              <Image src={logo} alt={siteName} width={32} height={32} className="h-8 w-auto" />
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-16">
            {navigation.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                className={cn(
                  'relative px-24 py-20 text-lg font-semibold transition-all duration-300 rounded-2xl border-4 min-w-[140px] flex items-center justify-center text-center',
                  // Add explicit margins for extra spacing
                  index > 0 ? 'ml-8' : '',
                  // Persistent glow for all items with more button-like appearance
                  'border-green-400/70 shadow-[0_0_16px_rgba(34,197,94,0.5)] bg-green-50/40 dark:bg-green-950/40',
                  // Enhanced glow on hover with more pronounced button effect
                  'hover:border-green-500 hover:shadow-[0_0_24px_rgba(34,197,94,0.7)] hover:text-green-400 hover:bg-green-50/60 dark:hover:bg-green-950/60 hover:scale-110 hover:-translate-y-2',
                  // Emphasized glow on click/active with button press effect
                  'active:border-green-600 active:shadow-[0_0_32px_rgba(34,197,94,0.9)] active:scale-105 active:translate-y-0',
                  'focus:outline-none focus:ring-4 focus:ring-green-400/50 focus:ring-offset-4',
                  isActiveLink(item.href)
                    ? 'border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.6)] text-green-400 bg-green-50/50 dark:bg-green-950/50'
                    : 'text-green-600 dark:text-gray-300'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button and Theme Toggle */}
          <div className="hidden md:flex items-center gap-40 ml-20">
            <div className="relative">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-green-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
          <div className="md:hidden bg-white/95 backdrop-blur-sm dark:bg-black/95 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col space-y-8 px-12 py-16">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className={cn(
                    'relative px-16 py-20 text-xl font-semibold transition-all duration-300 rounded-2xl border-4 min-w-[160px] flex items-center justify-center text-center',
                    // Persistent glow for all items with more button-like appearance
                    'border-green-400/70 shadow-[0_0_16px_rgba(34,197,94,0.5)] bg-green-50/40 dark:bg-green-950/40',
                    // Enhanced glow on hover with more pronounced button effect
                    'hover:border-green-500 hover:shadow-[0_0_24px_rgba(34,197,94,0.7)] hover:text-green-400 hover:bg-green-50/60 dark:hover:bg-green-950/60 hover:scale-110 hover:-translate-y-2',
                    // Emphasized glow on click/active with button press effect
                    'active:border-green-600 active:shadow-[0_0_32px_rgba(34,197,94,0.9)] active:scale-105 active:translate-y-0',
                    'focus:outline-none focus:ring-4 focus:ring-green-400/50 focus:ring-offset-4',
                    isActiveLink(item.href)
                      ? 'text-green-400 border-green-400 shadow-[0_0_16px_rgba(34,197,94,0.6)]'
                      : 'text-green-600 dark:text-gray-300 hover:text-green-400'
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              <div className="flex items-center justify-between mt-12 pt-12 border-t border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        )}
    </header>
  );
};

export default Header;