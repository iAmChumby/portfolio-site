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
          ? 'bg-[#0a1510]/95 backdrop-blur-md shadow-[8px_8px_16px_rgba(5,10,8,0.7)] border-b border-[#234d35]'
          : 'bg-transparent'
      )}
    >
      <div className="container h-20 px-6 mx-auto">
        {/* Desktop Layout - Centered Content */}
        <div className="hidden md:flex md:items-center md:justify-center md:h-full md:max-w-6xl md:mx-auto">
          <div className="flex items-center w-full max-w-5xl">
          {/* Left Column - Logo */}
          <div className="flex justify-start flex-1">
            <Link
              href="/"
              className="flex items-center space-x-2 text-xl font-bold text-neu-text-primary hover:text-neu-text-secondary transition-colors whitespace-nowrap"
            >
              {logo ? (
                <Image src={logo} alt={siteName} width={32} height={32} className="h-8 w-auto" />
              ) : (
                <span className="neu-text-gradient">Luke Edwards Portfolio</span>
              )}
            </Link>
          </div>

          {/* Center Column - Navigation */}
          <nav className="flex items-center justify-center space-x-4 lg:space-x-6 px-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-xl whitespace-nowrap',
                  isActiveLink(item.href)
                    ? 'text-neu-accent shadow-[inset_2px_2px_4px_rgba(5,10,8,0.7),inset_-2px_-2px_4px_rgba(35,77,53,0.4)] bg-[#0d1f17]'
                    : 'text-neu-text-secondary hover:text-neu-text-primary hover:shadow-[4px_4px_8px_rgba(5,10,8,0.7),-4px_-4px_8px_rgba(35,77,53,0.4)] hover:bg-[#132e1f]'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Column - CTA Button */}
          <div className="flex justify-end flex-1">
            <Link href="/contact">
              <button 
                className="neu-btn neu-btn-raised w-auto text-sm px-6 py-2.5"
              >
                Get In Touch
              </button>
            </Link>
          </div>
          </div>
        </div>

        {/* Mobile Layout - Original Flexbox */}
        <div className="flex md:hidden items-center justify-between h-full">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-xl font-bold text-neu-text-primary hover:text-neu-text-secondary transition-colors"
          >
            {logo ? (
              <Image src={logo} alt={siteName} width={32} height={32} className="h-8 w-auto" />
            ) : (
              <span className="neu-text-gradient">{siteName}</span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-xl text-neu-text-secondary hover:text-neu-text-primary hover:shadow-[4px_4px_8px_rgba(5,10,8,0.7),-4px_-4px_8px_rgba(35,77,53,0.4)] hover:bg-[#132e1f] transition-all"
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
      </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-4 pt-4 pb-6 space-y-3 bg-[#0a1510] border-t border-[#234d35] shadow-lg">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className={cn(
                      'block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300',
                      isActiveLink(item.href)
                        ? 'text-neu-accent shadow-[inset_2px_2px_4px_rgba(5,10,8,0.7),inset_-2px_-2px_4px_rgba(35,77,53,0.4)] bg-[#0d1f17]'
                        : 'text-neu-text-secondary hover:text-neu-text-primary hover:shadow-[4px_4px_8px_rgba(5,10,8,0.7),-4px_-4px_8px_rgba(35,77,53,0.4)] hover:bg-[#132e1f]'
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="px-4 py-3 flex items-center justify-center border-t border-[#234d35] mt-4 pt-4">
                  <Link href="/contact" className="w-full">
                    <button 
                      className="neu-btn neu-btn-raised w-full text-base py-3"
                    >
                      Get In Touch
                    </button>
                  </Link>
                </div>
              </div>
          </div>
        )}
    </header>
  );
};

export default Header;