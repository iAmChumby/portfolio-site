'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { HomeIcon, FolderIcon, EmailIcon, GitHubIcon, LinkedInIcon, CodeIcon } from '@/components/ui/icons';
import siteConfig from '@/data/site-config.json';

interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
  icon?: 'home' | 'folder' | 'email';
}

interface HeaderProps {
  navigation?: NavigationItem[];
  logo?: string;
  siteName?: string;
}

const defaultNavigation: NavigationItem[] = [
  { label: 'Home', href: '/', icon: 'home' },
  { label: 'Projects', href: '/projects', icon: 'folder' },
  { label: 'Contact', href: '/contact', icon: 'email' },
];

const iconMap = {
  home: HomeIcon,
  folder: FolderIcon,
  email: EmailIcon,
} as const;

const Header: React.FC<HeaderProps> = ({
  navigation = defaultNavigation,
  logo,
  siteName = 'Luke Edwards',
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [pressedItem, setPressedItem] = useState<string | null>(null);
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

  const handlePressStart = (id: string) => {
    setPressedItem(id);
  };

  const handlePressEnd = () => {
    setPressedItem(null);
  };

  // Social links configuration
  const socialLinks = [
    {
      name: 'GitHub',
      href: siteConfig.site.social.github,
      icon: GitHubIcon,
      ariaLabel: 'Visit GitHub profile',
    },
    {
      name: 'LinkedIn',
      href: siteConfig.site.social.linkedin,
      icon: LinkedInIcon,
      ariaLabel: 'Visit LinkedIn profile',
    },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
        isScrolled
          ? 'bg-[#0a1510]/95 backdrop-blur-md shadow-[8px_8px_16px_rgba(5,10,8,0.7)] border-[#234d35]'
          : 'bg-transparent border-transparent'
      )}
    >
      <div className="container h-20 px-6 mx-auto">
        {/* Desktop Layout */}
        <div className="hidden md:flex md:items-center md:justify-center md:h-full md:max-w-6xl md:mx-auto">
          <div className="flex items-center w-full max-w-5xl">
            {/* Left Column - Brand/Logo */}
            <div className="flex justify-start flex-1">
              <Link
                href="/"
                className="group flex items-center space-x-2"
                onMouseDown={() => handlePressStart('logo')}
                onMouseUp={handlePressEnd}
                onMouseLeave={handlePressEnd}
              >
                {logo ? (
                  <Image src={logo} alt={siteName} width={32} height={32} className="h-8 w-auto" />
                ) : (
                  <div className={cn(
                    'flex items-center gap-2',
                    'transition-all duration-150',
                    'group-hover:scale-[1.02]',
                    pressedItem === 'logo' && 'scale-[0.98]'
                  )}>
                    <CodeIcon
                      size={24}
                      className="text-neu-accent"
                    />
                    <span className="neu-text-gradient text-2xl font-bold tracking-tight">
                      {siteName}
                    </span>
                  </div>
                )}
              </Link>
            </div>

            {/* Center Column - Navigation */}
            <nav className="flex items-center justify-center space-x-2 lg:space-x-3 px-4">
              {navigation.map((item) => {
                const IconComponent = item.icon ? iconMap[item.icon] : null;
                const isPressed = pressedItem === item.href;
                const isActive = isActiveLink(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    onMouseDown={() => handlePressStart(item.href)}
                    onMouseUp={handlePressEnd}
                    onMouseLeave={handlePressEnd}
                    className={cn(
                      'relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl whitespace-nowrap',
                      'transition-all duration-150',
                      isActive
                        ? 'text-neu-accent shadow-[inset_4px_4px_8px_rgba(5,10,8,0.7),inset_-4px_-4px_8px_rgba(35,77,53,0.4)] bg-[#0d1f17]'
                        : 'text-neu-text-secondary hover:text-neu-text-primary hover:shadow-[4px_4px_8px_rgba(5,10,8,0.7),-4px_-4px_8px_rgba(35,77,53,0.4)] hover:bg-[#132e1f]',
                      isPressed && !isActive && 'shadow-[inset_4px_4px_8px_rgba(5,10,8,0.7),inset_-4px_-4px_8px_rgba(35,77,53,0.4)] scale-[0.98] bg-[#0d1f17]',
                      isPressed && isActive && 'shadow-[inset_6px_6px_12px_rgba(5,10,8,0.7),inset_-6px_-6px_12px_rgba(35,77,53,0.4)] scale-[0.97]'
                    )}
                  >
                    {IconComponent && (
                      <IconComponent
                        size={16}
                        className={cn(
                          'transition-colors duration-150',
                          isActive ? 'text-neu-accent' : 'text-neu-text-muted'
                        )}
                      />
                    )}
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Column - Social Icons */}
            <div className="flex justify-end flex-1">
              <div className="flex items-center space-x-3">
                {socialLinks.map((social) => {
                  const SocialIcon = social.icon;
                  const isPressed = pressedItem === social.href;

                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.ariaLabel}
                      onMouseDown={() => handlePressStart(social.href)}
                      onMouseUp={handlePressEnd}
                      onMouseLeave={handlePressEnd}
                      className={cn(
                        'p-2.5 rounded-xl transition-all duration-150',
                        'text-neu-text-secondary hover:text-neu-text-primary',
                        'hover:shadow-[4px_4px_8px_rgba(5,10,8,0.7),-4px_-4px_8px_rgba(35,77,53,0.4)] hover:bg-[#132e1f]',
                        isPressed && 'shadow-[inset_4px_4px_8px_rgba(5,10,8,0.7),inset_-4px_-4px_8px_rgba(35,77,53,0.4)] scale-[0.95] bg-[#0d1f17]'
                      )}
                    >
                      <SocialIcon size={20} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex md:hidden items-center justify-between h-full">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2"
            onMouseDown={() => handlePressStart('logo')}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressEnd}
            onTouchStart={() => handlePressStart('logo')}
            onTouchEnd={handlePressEnd}
          >
            {logo ? (
              <Image src={logo} alt={siteName} width={32} height={32} className="h-8 w-auto" />
            ) : (
              <div className={cn(
                'flex items-center gap-2',
                'transition-transform duration-150',
                pressedItem === 'logo' && 'scale-[0.98]'
              )}>
                <CodeIcon
                  size={20}
                  className="text-neu-accent"
                />
                <span className="neu-text-gradient text-xl font-bold">
                  {siteName}
                </span>
              </div>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            onMouseDown={() => handlePressStart('menu-toggle')}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressEnd}
            onTouchStart={() => handlePressStart('menu-toggle')}
            onTouchEnd={handlePressEnd}
            className={cn(
              'md:hidden p-2 rounded-xl transition-all duration-150',
              'text-neu-text-secondary hover:text-neu-text-primary',
              'hover:shadow-[4px_4px_8px_rgba(5,10,8,0.7),-4px_-4px_8px_rgba(35,77,53,0.4)] hover:bg-[#132e1f]',
              pressedItem === 'menu-toggle' && 'shadow-[inset_4px_4px_8px_rgba(5,10,8,0.7),inset_-4px_-4px_8px_rgba(35,77,53,0.4)] scale-[0.95] bg-[#0d1f17]'
            )}
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
            {navigation.map((item) => {
              const IconComponent = item.icon ? iconMap[item.icon] : null;
              const isPressed = pressedItem === item.href;
              const isActive = isActiveLink(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  onMouseDown={() => handlePressStart(item.href)}
                  onMouseUp={handlePressEnd}
                  onMouseLeave={handlePressEnd}
                  onTouchStart={() => handlePressStart(item.href)}
                  onTouchEnd={handlePressEnd}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium',
                    'transition-all duration-150',
                    isActive
                      ? 'text-neu-accent shadow-[inset_4px_4px_8px_rgba(5,10,8,0.7),inset_-4px_-4px_8px_rgba(35,77,53,0.4)] bg-[#0d1f17]'
                      : 'text-neu-text-secondary hover:text-neu-text-primary hover:shadow-[4px_4px_8px_rgba(5,10,8,0.7),-4px_-4px_8px_rgba(35,77,53,0.4)] hover:bg-[#132e1f]',
                    isPressed && !isActive && 'shadow-[inset_4px_4px_8px_rgba(5,10,8,0.7),inset_-4px_-4px_8px_rgba(35,77,53,0.4)] scale-[0.98] bg-[#0d1f17]',
                    isPressed && isActive && 'shadow-[inset_6px_6px_12px_rgba(5,10,8,0.7),inset_-6px_-6px_12px_rgba(35,77,53,0.4)] scale-[0.97]'
                  )}
                >
                  {IconComponent && (
                    <IconComponent
                      size={20}
                      className={cn(
                        'transition-colors duration-150',
                        isActive ? 'text-neu-accent' : 'text-neu-text-muted'
                      )}
                    />
                  )}
                  {item.label}
                </Link>
              );
            })}

            {/* Mobile Social Links */}
            <div className="pt-4 mt-4 border-t border-[#234d35]">
              <div className="flex items-center justify-center gap-4">
                {socialLinks.map((social) => {
                  const SocialIcon = social.icon;
                  const isPressed = pressedItem === social.href;

                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.ariaLabel}
                      onMouseDown={() => handlePressStart(social.href)}
                      onMouseUp={handlePressEnd}
                      onMouseLeave={handlePressEnd}
                      onTouchStart={() => handlePressStart(social.href)}
                      onTouchEnd={handlePressEnd}
                      className={cn(
                        'p-3 rounded-xl transition-all duration-150',
                        'text-neu-text-secondary hover:text-neu-text-primary',
                        'shadow-[4px_4px_8px_rgba(5,10,8,0.7),-4px_-4px_8px_rgba(35,77,53,0.4)] bg-[#132e1f]',
                        isPressed && 'shadow-[inset_4px_4px_8px_rgba(5,10,8,0.7),inset_-4px_-4px_8px_rgba(35,77,53,0.4)] scale-[0.95] bg-[#0d1f17]'
                      )}
                    >
                      <SocialIcon size={24} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
