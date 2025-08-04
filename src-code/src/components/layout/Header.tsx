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
          ? 'bg-gray-800/95 backdrop-blur-sm shadow-sm border-b border-gray-600'
          : 'bg-transparent'
      )}
    >
      <div className="container flex items-center justify-between h-20 px-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-xl font-bold text-black hover:text-gray-600 transition-colors"
          >
            {logo ? (
              <Image src={logo} alt={siteName} width={32} height={32} className="h-8 w-auto" />
            ) : (
              <span>{siteName}</span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg border-2 border-transparent',
                  'hover:border-[var(--color-accent)] hover:shadow-[0_0_10px_rgba(0,99,45,0.3)] hover:text-[var(--color-accent)]',
                  'active:border-[var(--color-accent-hover)] active:shadow-[0_0_15px_rgba(0,99,45,0.5)]',
                  isActiveLink(item.href)
                    ? 'border-[var(--color-accent)] shadow-[0_0_8px_rgba(0,99,45,0.4)] text-[var(--color-accent)] bg-[var(--color-accent)]/5'
                    : 'text-gray-700'
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
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
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
            <div className="px-4 pt-4 pb-6 space-y-2 bg-gray-800 border-t border-gray-600 shadow-lg">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className={cn(
                      'block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 border-2 border-transparent',
                      'hover:border-[var(--color-accent)] hover:shadow-[0_0_8px_rgba(0,99,45,0.3)] hover:text-[var(--color-accent)]',
                      'active:border-[var(--color-accent-hover)] active:shadow-[0_0_12px_rgba(0,99,45,0.5)]',
                      isActiveLink(item.href)
                        ? 'border-[var(--color-accent)] shadow-[0_0_6px_rgba(0,99,45,0.4)] text-[var(--color-accent)] bg-[var(--color-accent)]/5'
                        : 'text-gray-300 hover:bg-gray-700'
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 mt-4 pt-4">
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