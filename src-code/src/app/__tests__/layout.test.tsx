import { jest, describe, it } from '@jest/globals';

// Mock next/navigation FIRST
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock Header component to avoid usePathname issues
jest.mock('@/components/layout/Header', () => {
  function MockHeader({ navigation, siteName }: {
    navigation?: Array<{ label: string; href: string; external?: boolean }>;
    siteName?: string;
  }) {
    return (
      <header data-testid="header">
        <div data-testid="site-name">{siteName}</div>
        <nav data-testid="navigation">
          {navigation?.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </header>
    );
  }
  MockHeader.displayName = 'MockHeader';
  return MockHeader;
});

// Mock SmoothScrollProvider
jest.mock('@/components/providers/SmoothScrollProvider', () => ({
  SmoothScrollProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import RootLayout, { metadata } from '../layout';


// Mock Next.js fonts
jest.mock('next/font/google', () => ({
  Inter: () => ({
    variable: '--font-inter',
    className: 'font-inter',
  }),
  JetBrains_Mono: () => ({
    variable: '--font-jetbrains-mono',
    className: 'font-jetbrains-mono',
  }),
}));

// Mock components

jest.mock('@/components/ui/AnimatedBackground', () => {
  return function MockAnimatedBackground() {
    return <div data-testid="animated-background" />;
  };
});

jest.mock('@/components/layout/Footer', () => {
  return function MockFooter() {
    return <footer data-testid="footer" />;
  };
});

jest.mock('@/components/ui/PageTransition', () => {
  function MockPageTransition({ children }: { children: React.ReactNode }) {
    return <div data-testid="page-transition">{children}</div>;
  }
  MockPageTransition.displayName = 'MockPageTransition';
  return MockPageTransition;
});

// Mock site config
jest.mock('@/data/site-config.json', () => ({
  seo: {
    defaultTitle: 'Luke Edwards - Full Stack Developer',
    defaultDescription: 'Passionate full-stack developer creating innovative web solutions with modern technologies.',
    keywords: ['full-stack developer', 'web development', 'React', 'Next.js', 'TypeScript', 'Node.js', 'portfolio'],
    ogImage: '/images/og-image.jpg',
    twitterHandle: '@yourusername',
  },
  site: {
    name: "Luke Edwards' Portfolio",
    url: 'https://lukeedwards.me',
    author: {
      name: 'Luke Edwards',
    },
    navigation: [
      { label: 'Home', href: '/', external: false },
      { label: 'About', href: '/about', external: false },
      { label: 'Projects', href: '/projects', external: false },
      { label: 'Contact', href: '/contact', external: false },
    ],
  },
}));

// Mock CSS import
jest.mock('../globals.css', () => ({}));

describe('RootLayout', () => {
  const mockChildren = <div data-testid="page-content">Test Content</div>;

  describe('Rendering', () => {
    it('renders html element with correct lang attribute', () => {
      render(<RootLayout>{mockChildren}</RootLayout>);
      
      const htmlElement = document.documentElement;
      expect(htmlElement).toHaveAttribute('lang', 'en');
    });

    it('renders body with correct font classes', () => {
      render(<RootLayout>{mockChildren}</RootLayout>);
      
      const bodyElement = document.body;
      expect(bodyElement).toHaveClass(
        '--font-inter',
        '--font-jetbrains-mono',
        'font-sans',
        'antialiased'
      );
    });

    it('renders all main layout components', () => {
      render(<RootLayout>{mockChildren}</RootLayout>);
      
      expect(screen.getByTestId('animated-background')).toBeInTheDocument();
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('page-transition')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('renders children within PageTransition', () => {
      render(<RootLayout>{mockChildren}</RootLayout>);
      
      const pageTransition = screen.getByTestId('page-transition');
      const pageContent = screen.getByTestId('page-content');
      
      expect(pageTransition).toContainElement(pageContent);
    });

    it('renders main element with correct classes', () => {
      render(<RootLayout>{mockChildren}</RootLayout>);
      
      const mainElement = screen.getByRole('main');
      expect(mainElement).toHaveClass(
        'flex-1',
        'pt-16',
        'sm:pt-20',
        'md:pt-24'
      );
    });
  });

  describe('Header Configuration', () => {
    it('passes correct props to Header component', () => {
      render(<RootLayout>{mockChildren}</RootLayout>);
      
      const siteName = screen.getByTestId('site-name');
      expect(siteName).toHaveTextContent("Luke Edwards' Portfolio");
      
      const navigation = screen.getByTestId('navigation');
      expect(navigation).toBeInTheDocument();
      
      // Check navigation items
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText('Projects')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('passes navigation from site config to Header', () => {
      render(<RootLayout>{mockChildren}</RootLayout>);
      
      const homeLink = screen.getByText('Home');
      const aboutLink = screen.getByText('About');
      const projectsLink = screen.getByText('Projects');
      const contactLink = screen.getByText('Contact');
      
      expect(homeLink).toHaveAttribute('href', '/');
      expect(aboutLink).toHaveAttribute('href', '/about');
      expect(projectsLink).toHaveAttribute('href', '/projects');
      expect(contactLink).toHaveAttribute('href', '/contact');
    });
  });

  describe('Layout Structure', () => {
    it('maintains correct component order', () => {
      render(<RootLayout>{mockChildren}</RootLayout>);
      
      // Check that all required components are present
      expect(screen.getByTestId('animated-background')).toBeInTheDocument();
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('wraps children in main element', () => {
      render(<RootLayout>{mockChildren}</RootLayout>);
      
      const mainElement = screen.getByRole('main');
      const pageContent = screen.getByTestId('page-content');
      
      expect(mainElement).toContainElement(pageContent);
    });

    it('applies correct responsive padding to main', () => {
      render(<RootLayout>{mockChildren}</RootLayout>);
      
      const mainElement = screen.getByRole('main');
      expect(mainElement).toHaveClass(
        'pt-16',  // base padding
        'sm:pt-20', // small screen padding
        'md:pt-24'  // medium screen padding
      );
    });
  });

  describe('Multiple Children', () => {
    it('renders multiple children correctly', () => {
      const multipleChildren = (
        <>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <div data-testid="child-3">Child 3</div>
        </>
      );
      
      render(<RootLayout>{multipleChildren}</RootLayout>);
      
      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.getByTestId('child-3')).toBeInTheDocument();
    });

    it('renders complex nested children', () => {
      const complexChildren = (
        <div data-testid="complex-parent">
          <header data-testid="page-header">Page Header</header>
          <section data-testid="page-section">
            <h1>Page Title</h1>
            <p>Page content</p>
          </section>
        </div>
      );
      
      render(<RootLayout>{complexChildren}</RootLayout>);
      
      expect(screen.getByTestId('complex-parent')).toBeInTheDocument();
      expect(screen.getByTestId('page-header')).toBeInTheDocument();
      expect(screen.getByTestId('page-section')).toBeInTheDocument();
      expect(screen.getByText('Page Title')).toBeInTheDocument();
      expect(screen.getByText('Page content')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper semantic structure', () => {
      render(<RootLayout>{mockChildren}</RootLayout>);
      
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('maintains proper document structure', () => {
      render(<RootLayout>{mockChildren}</RootLayout>);
      
      const htmlElement = document.documentElement;
      const bodyElement = document.body;
      
      expect(htmlElement.tagName.toLowerCase()).toBe('html');
      expect(bodyElement.tagName.toLowerCase()).toBe('body');
      expect(htmlElement).toContainElement(bodyElement);
    });
  });

  describe('Font Configuration', () => {
    it('applies Inter font variable', () => {
      render(<RootLayout>{mockChildren}</RootLayout>);
      
      const bodyElement = document.body;
      expect(bodyElement).toHaveClass('--font-inter');
    });

    it('applies JetBrains Mono font variable', () => {
      render(<RootLayout>{mockChildren}</RootLayout>);
      
      const bodyElement = document.body;
      expect(bodyElement).toHaveClass('--font-jetbrains-mono');
    });

    it('applies default font classes', () => {
      render(<RootLayout>{mockChildren}</RootLayout>);
      
      const bodyElement = document.body;
      expect(bodyElement).toHaveClass('font-sans', 'antialiased');
    });
  });

  describe('Edge Cases', () => {
    it('handles null children gracefully', () => {
      render(<RootLayout>{null}</RootLayout>);
      
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByTestId('page-transition')).toBeInTheDocument();
    });

    it('handles undefined children gracefully', () => {
      render(<RootLayout>{undefined}</RootLayout>);
      
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByTestId('page-transition')).toBeInTheDocument();
    });

    it('handles empty string children', () => {
      render(<RootLayout>{''}</RootLayout>);
      
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByTestId('page-transition')).toBeInTheDocument();
    });

    it('handles React fragments as children', () => {
      const fragmentChildren = (
        <React.Fragment>
          <div data-testid="fragment-child-1">Fragment Child 1</div>
          <div data-testid="fragment-child-2">Fragment Child 2</div>
        </React.Fragment>
      );
      
      render(<RootLayout>{fragmentChildren}</RootLayout>);
      
      expect(screen.getByTestId('fragment-child-1')).toBeInTheDocument();
      expect(screen.getByTestId('fragment-child-2')).toBeInTheDocument();
    });
  });
});

describe('Metadata', () => {
  it('exports correct metadata object', () => {
    expect(metadata).toBeDefined();
    expect(metadata.title).toBe('Luke Edwards - Full Stack Developer');
    expect(metadata.description).toBe('Passionate full-stack developer creating innovative web solutions with modern technologies.');
  });

  it('includes correct keywords', () => {
    expect(metadata.keywords).toEqual([
      'full-stack developer',
      'web development',
      'React',
      'Next.js',
      'TypeScript',
      'Node.js',
      'portfolio'
    ]);
  });

  it('includes correct author information', () => {
    expect(metadata.authors).toEqual([{
      name: 'Luke Edwards',
      url: 'https://lukeedwards.me'
    }]);
    expect(metadata.creator).toBe('Luke Edwards');
  });

  it('includes correct OpenGraph metadata', () => {
    expect(metadata.openGraph).toEqual({
      type: 'website',
      locale: 'en_US',
      url: 'https://lukeedwards.me',
      title: 'Luke Edwards - Full Stack Developer',
      description: 'Passionate full-stack developer creating innovative web solutions with modern technologies.',
      siteName: "Luke Edwards' Portfolio",
      images: [{
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: "Luke Edwards' Portfolio"
      }]
    });
  });

  it('includes correct Twitter metadata', () => {
    expect(metadata.twitter).toEqual({
      card: 'summary_large_image',
      title: 'Luke Edwards - Full Stack Developer',
      description: 'Passionate full-stack developer creating innovative web solutions with modern technologies.',
      creator: '@yourusername',
      images: ['/images/og-image.jpg']
    });
  });
});