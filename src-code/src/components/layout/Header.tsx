'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

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
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blog' },
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
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out',
        isScrolled
          ? 'bg-gray-900/90 backdrop-blur-md shadow-2xl border-b border-gray-700/50'
          : 'bg-transparent'
      )}
    >
      <div className="container flex items-center justify-between h-24 px-6 max-w-7xl mx-auto">
          {/* Logo with enhanced hover effect */}
          <Link
            href="/"
            className="group flex items-center space-x-3 text-2xl font-bold transition-all duration-300 hover:scale-105"
          >
            {logo ? (
              <div className="relative">
                <Image 
                  src={logo} 
                  alt={siteName} 
                  width={40} 
                  height={40} 
                  className="h-10 w-auto transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]" 
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              </div>
            ) : (
              <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 bg-clip-text text-transparent group-hover:from-green-300 group-hover:via-emerald-400 group-hover:to-green-500 transition-all duration-300">
                {siteName}
              </span>
            )}
          </Link>

          {/* Desktop Navigation with enhanced spacing and effects */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                className={cn(
                  'group relative px-4 py-3 text-sm font-semibold tracking-wide uppercase transition-all duration-500 ease-out',
                  'before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-green-400/10 before:via-emerald-500/10 before:to-green-600/10',
                  'before:opacity-0 before:scale-95 before:transition-all before:duration-300',
                  'hover:before:opacity-100 hover:before:scale-100',
                  'after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-green-400 after:via-emerald-500 after:to-green-600',
                  'after:transition-all after:duration-300 after:ease-out after:-translate-x-1/2',
                  'hover:after:w-full hover:scale-105 hover:text-green-400',
                  'active:scale-95 active:transition-transform active:duration-150',
                  isActiveLink(item.href)
                    ? 'text-green-400 after:w-full shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                    : 'text-gray-300 hover:text-green-400'
                )}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <span>{item.label}</span>
                  {/* Animated dot indicator */}
                  <span className={cn(
                    'w-1.5 h-1.5 rounded-full transition-all duration-300',
                    isActiveLink(item.href) 
                      ? 'bg-green-400 shadow-[0_0_6px_rgba(34,197,94,0.8)]' 
                      : 'bg-transparent group-hover:bg-green-400/60'
                  )}></span>
                </span>
                
                {/* Constellation-like particles on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute top-1 left-2 w-1 h-1 bg-green-400/60 rounded-full animate-pulse"></div>
                  <div className="absolute top-3 right-3 w-0.5 h-0.5 bg-emerald-400/80 rounded-full animate-pulse" style={{animationDelay: '200ms'}}></div>
                  <div className="absolute bottom-2 left-4 w-0.5 h-0.5 bg-green-300/70 rounded-full animate-pulse" style={{animationDelay: '400ms'}}></div>
                </div>
              </Link>
            ))}
          </nav>

          {/* Enhanced CTA Button */}
          <div className="hidden lg:flex items-center">
            <Link
              href="/contact"
              className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] active:scale-95"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span>Get In Touch</span>
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer"></div>
            </Link>
          </div>

          {/* Enhanced Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden relative p-3 rounded-xl text-gray-300 hover:text-green-400 hover:bg-gray-800/50 transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <span className={cn(
                'absolute left-0 top-1 w-6 h-0.5 bg-current transition-all duration-300 ease-out',
                isMenuOpen ? 'rotate-45 translate-y-2' : 'rotate-0 translate-y-0'
              )}></span>
              <span className={cn(
                'absolute left-0 top-3 w-6 h-0.5 bg-current transition-all duration-300 ease-out',
                isMenuOpen ? 'opacity-0' : 'opacity-100'
              )}></span>
              <span className={cn(
                'absolute left-0 top-5 w-6 h-0.5 bg-current transition-all duration-300 ease-out',
                isMenuOpen ? '-rotate-45 -translate-y-2' : 'rotate-0 translate-y-0'
              )}></span>
            </div>
          </button>
        </div>

        {/* Enhanced Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-md border-t border-gray-700/50 shadow-2xl">
              <div className="px-6 py-6 space-y-1 max-w-7xl mx-auto">
                {navigation.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className={cn(
                      'group block px-4 py-3 rounded-2xl text-base font-semibold tracking-wide uppercase transition-all duration-300',
                      'hover:bg-gradient-to-r hover:from-green-400/10 hover:via-emerald-500/10 hover:to-green-600/10',
                      'hover:scale-105 hover:shadow-[0_0_20px_rgba(34,197,94,0.2)]',
                      'active:scale-95 active:transition-transform active:duration-150',
                      isActiveLink(item.href)
                        ? 'bg-gradient-to-r from-green-400/20 via-emerald-500/20 to-green-600/20 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                        : 'text-gray-300 hover:text-green-400'
                    )}
                    style={{
                      animationDelay: `${index * 50}ms`
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center space-x-3">
                        <span>{item.label}</span>
                        <span className={cn(
                          'w-1.5 h-1.5 rounded-full transition-all duration-300',
                          isActiveLink(item.href) 
                            ? 'bg-green-400 shadow-[0_0_6px_rgba(34,197,94,0.8)]' 
                            : 'bg-transparent group-hover:bg-green-400/60'
                        )}></span>
                      </span>
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    
                    {/* Mobile constellation particles */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute top-2 left-3 w-0.5 h-0.5 bg-green-400/60 rounded-full animate-pulse"></div>
                      <div className="absolute top-4 right-4 w-1 h-1 bg-emerald-400/80 rounded-full animate-pulse" style={{animationDelay: '150ms'}}></div>
                      <div className="absolute bottom-3 left-6 w-0.5 h-0.5 bg-green-300/70 rounded-full animate-pulse" style={{animationDelay: '300ms'}}></div>
                    </div>
                  </Link>
                ))}
                
                {/* Mobile CTA Button */}
                <div className="pt-6 border-t border-gray-700/50 mt-6">
                  <Link
                    href="/contact"
                    className="group flex items-center justify-center w-full px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] active:scale-95"
                  >
                    <span className="relative z-10 flex items-center space-x-2">
                      <span>Get In Touch</span>
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                    
                    {/* Mobile button effects */}
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer"></div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
    </header>
  );
};

export default Header;